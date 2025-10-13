import { useHealthStore } from "@/store/useHealthStore";
import { useState } from "react";
import { Modal } from "react-native";

// components/LogActivityModal.tsx
interface LogActivityModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'water' | 'workout' | 'sleep' | 'meal';
}

const LogActivityModal = ({ visible, onClose, type }: LogActivityModalProps) => {
  const [value, setValue] = useState('');
  const { updateActivitySummary, todaysWater, todaysWorkoutMinutes } = useHealthStore();

  const handleSave = async () => {
    const numValue = parseFloat(value);

    switch (type) {
      case 'water':
        await updateActivitySummary({
          water: numValue
        });
        break;
      case 'workout':
        await updateActivitySummary({
          workoutMinutes: numValue
        });
        break;
      // Add other cases  
    }
    onClose();
  };

  return (
    <Modal visible={visible}>
      {/* UI for logging activity */}
    </Modal>
  );
};