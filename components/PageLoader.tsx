import React from "react";
import { View, ActivityIndicator, StyleSheet, Modal } from "react-native";

type Props = {
  visible: boolean;
};

const FullPageLoader = ({ visible }: Props) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
    >
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FullPageLoader;
