import { View, StyleSheet, Platform, Dimensions, Button } from "react-native";
import { useRef, useState } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { CameraView, useCameraPermissions } from "expo-camera/next";
import BarcodeMask from "react-native-barcode-mask";

const CustomScanCameraNext = ({ onScan, onClose }) => {
  const camRef = useRef();

  const finderWidth = 280;
  const finderHeight = 230;
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const viewMinX = (width - finderWidth) / 2;
  const viewMinY = (height - finderHeight) / 2;

  const [offset, setOffset] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const [scanned, setScanned] = useState(false);
  const [maskOffset, setMaskOffset] = useState({ x: 0, y: 0 });

  const handleLayout = () => {
    camRef.current.measureInWindow((x, y, width, height) => {
      if (offset.x == 0 || offset.y == 0) {
        console.log("OFFSET", x, y, width, height);
        setOffset({ x, y, width, height });
      }
    });
  };

  const handleBarCodeScanned = (scanningResult) => {
    if (!scanned) {
      if (Platform.OS == "android") {
        const { type, data, cornerPoints } = scanningResult;

        console.log("corner points", cornerPoints);
        const isWithinViewFinder = cornerPoints.every(({ x, y }) => {
          return (
            x > maskOffset.x &&
            x < maskOffset.x + finderWidth &&
            y > maskOffset.y &&
            y < maskOffset.y + finderHeight
          );
        });
        if (isWithinViewFinder) {
          setScanned(true);
          onScan({ type, data });
        }
        // console.log("is in view", isWithinViewFinder);
      } else if (Platform.OS == "ios") {
        const { type, data, cornerPoints, bounds } = scanningResult;

        console.log("type", type, data);
        console.log("corner points", cornerPoints);

        // const gapFromRightLeftSide = (offset.width - finderWidth) / 2;
        // const gapFromTopBottom = (offset.height - finderHeight) / 2;

        // console.log("gap RL", gapFromRightLeftSide);
        // console.log("gap TB", gapFromTopBottom);

        if (!cornerPoints) {
          console.log("SCANNED WIthout corner points");
          setScanned(true);
          onScan({ type, data });
          return;
        }

        const updatedCornerPoints = cornerPoints.map((c) => {
          return {
            x: c.x * offset.height,
            y: c.y * offset.width,
          };
        });

        const isWithinViewFinder = updatedCornerPoints.every(({ x, y }) => {
          return (
            x > maskOffset.y &&
            x < maskOffset.y + finderHeight &&
            y > maskOffset.x &&
            y < maskOffset.x + finderWidth
          );
        });
        if (isWithinViewFinder) {
          setScanned(true);
          onScan({ type, data: data.trim() });
        }
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 4 }} ref={camRef} onLayout={handleLayout}>
        <CameraView
          onBarcodeScanned={handleBarCodeScanned}
          barCodeScannerSettings={{
            barCodeTypes: [
              BarCodeScanner.Constants.BarCodeType.ean13,
              BarCodeScanner.Constants.BarCodeType.ean8,
              BarCodeScanner.Constants.BarCodeType.code39,
              BarCodeScanner.Constants.BarCodeType.code93,
              BarCodeScanner.Constants.BarCodeType.code128,
              BarCodeScanner.Constants.BarCodeType.interleaved2of5,
              BarCodeScanner.Constants.BarCodeType.aztec,
            ],
          }}
          style={[StyleSheet.absoluteFillObject, styles.container]}
        >
          <BarcodeMask
            width={finderWidth}
            height={finderHeight}
            edgeColor={"blue"}
            animatedLineColor={"blue"}
            showAnimatedLine
            useNativeDriver={true}
            onLayoutMeasured={(event) => {
              console.log("EVENT", event);
              setMaskOffset({
                x: event.nativeEvent.layout.x,
                y: event.nativeEvent.layout.y,
              });
            }}
          />
        </CameraView>
      </View>
      <View style={styles.btnContainer}>
        <Button title="Close Scanner" onPress={onClose}>
          Close Scanner
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btnContainer: {
    flex: 1,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
export default CustomScanCameraNext;
