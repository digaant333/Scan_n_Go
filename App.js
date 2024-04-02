import { StatusBar } from "expo-status-bar";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import CustomScanCameraNext from "./CustomScanCameraNext";
import { useState } from "react";

export default function App() {
  const [showScanner, setShowScanner] = useState(false);

  const closeScanner = () => {
    setShowScanner(false);
  };

  const openScanner = () => {
    setShowScanner(true);
  };

  const onScan = () => {
    Alert.alert("Scanned", "Scanned Data");
    closeScanner();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {!showScanner && (
        <Button title="Open Scanner" onPress={openScanner}>
          Open Scanner
        </Button>
      )}
      {showScanner && (
        <View style={styles.scanner}>
          <CustomScanCameraNext onScan={onScan} onClose={closeScanner} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  scanner: {
    flex: 1,
    width: "90%",
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 40,
  },
});
