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
    
    switch(type) {
      case 'water':
        await updateActivitySummary({ 
          water: (todaysWater || 0) + numValue 
        });
        break;
      case 'workout':
        await updateActivitySummary({ 
          workoutMinutes: (todaysWorkoutMinutes || 0) + numValue 
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