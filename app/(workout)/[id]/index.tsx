import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Dimensions, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

interface ExerciseDetailProps {
  exerciseId: string;
  name: string;
  gifUrl: string;
  targetMuscles: string[];
  bodyParts: string[];
  equipments: string[];
  secondaryMuscles: string[];
  instructions: string[];
}

// Sample data - replace with actual data from route params
const sampleExercise: ExerciseDetailProps = {
  exerciseId: '1',
  name: 'jumping jack',
  gifUrl: 'https://example.com/jump.gif',
  targetMuscles: ['quadriceps', 'calves'],
  bodyParts: ['legs', 'cardio'],
  equipments: ['body weight'],
  secondaryMuscles: ['shoulders', 'core'],
  instructions: [
    'Spread Your Arms - To make the gestures feel more relaxed, stretch your arms as you start this movement. No bending of hands.',
    'Rest at The Toe - The basis of this movement is jumping. Now, what needs to be considered is that you have to use the tips of your feet',
    'Adjust Foot Movement - Jumping Jack is not just an ordinary jump. But you also have to pay close attention to leg movements.',
    'Clapping Both Hands - This cannot be taken lightly. You see, without realizing it, the clapping of your hands helps you to keep your rhythm while doing the Jumping Jack'
  ]
};

const WorkoutDetailScreen = () => {
  const { colors, gradients, theme } = useTheme();
  const { id } = useLocalSearchParams();
  console.log('id', id)
  const [customReps, setCustomReps] = useState([
    { id: 1, reps: 29, calories: 450 },
    { id: 2, reps: 30, calories: 450 },
    { id: 3, reps: 31, calories: 450 },
  ]);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [exercise, setExercise] = useState<ExerciseDetailProps>();


  const estimatedCalories = 390;
  const difficulty = 'Easy';

  const fetchExercise = async () => {
    const options = { method: 'GET', url: `https://v1.exercisedb.dev/api/v1/exercises/${id}` };

    try {
      const { data } = await axios.request(options);
      console.log('t', data)
      setExercise(data.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchExercise()
  }, [id])

  const updateReps = (id: number, value: string) => {
    const numValue = parseInt(value) || 0;
    setCustomReps(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, reps: numValue, calories: Math.round(numValue * 15) }
          : item
      )
    );
  };

  const totalCalories = customReps.reduce((sum, item) => sum + item.calories, 0);
  console.log(exercise?.gifUrl)

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.headerButton, { backgroundColor: colors.card }]}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.headerButton, { backgroundColor: colors.card }]}>
          <MaterialCommunityIcons name="dots-horizontal" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image/GIF */}
        <LinearGradient
          colors={gradients.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroContainer}
        >
          <View style={styles.heroPlaceholder}>
            {exercise ?
              (
                <Image source={{ uri: exercise?.gifUrl }} width={250} height={250} style={{ zIndex: 300 }} />) :
              (
                <MaterialCommunityIcons name="human-handsup" size={120} color="rgba(255,255,255,0.3)" />
              )}
          </View>

          {/* Favorite Button */}
          <TouchableOpacity style={styles.favoriteButton}>
            <MaterialCommunityIcons name="heart-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.content}>
          {/* Title & Stats */}
          <Text style={[styles.title, { color: colors.text }]}>
            {exercise?.name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Text>

          <Text style={[styles.subtitle, { color: colors.tintText3 }]}>
            {difficulty} | {estimatedCalories} Calories Burn
          </Text>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {exercise?.bodyParts.slice(0, 2).map((part, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: colors.card }]}>
                <Text style={[styles.tagText, { color: colors.text }]}>{part}</Text>
              </View>
            ))}
            {exercise?.equipments.slice(0, 1).map((equipment, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: colors.card }]}>
                <Text style={[styles.tagText, { color: colors.text }]}>{equipment}</Text>
              </View>
            ))}
          </View>



          {/* How To Do It */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>How To Do It</Text>
              <Text style={[styles.stepCount, { color: colors.tintText3 }]}>
                {exercise?.instructions.length} Steps
              </Text>
            </View>

            {exercise?.instructions.map((instruction, index) => (
              <View key={index} style={styles.stepContainer}>
                <View style={styles.stepIndicator}>
                  <LinearGradient
                    colors={gradients.button}
                    style={styles.stepNumber}
                  >
                    <Text style={styles.stepNumberText}>{String(index + 1).padStart(2, '0')}</Text>
                  </LinearGradient>
                  {index < exercise.instructions.length - 1 && (
                    <View style={[styles.stepLine, { backgroundColor: colors.tintText3 }]} />
                  )}
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, { color: colors.text }]}>
                    {instruction.split('-')[0].trim()}
                  </Text>
                  <Text style={[styles.stepText, { color: colors.tintText3 }]}>
                    {instruction.split('-')[1]?.trim() || instruction}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Custom Repetitions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Custom Repetitions</Text>
              <View style={styles.caloriesBadge}>
                <Ionicons name="flame" size={16} color="#FF6B6B" />
                <Text style={[styles.caloriesText, { color: colors.text }]}>
                  {totalCalories} Calories Burn
                </Text>
              </View>
            </View>

            {customReps.map((item) => (
              <View key={item.id} style={[styles.repCard, { backgroundColor: colors.card }]}>
                <View style={styles.repLeft}>
                  <Ionicons name="flame" size={20} color="#FF6B6B" />
                  <Text style={[styles.repCalories, { color: colors.text }]}>
                    {item.calories} Calories Burn
                  </Text>
                </View>
                <View style={styles.repRight}>
                  <TextInput
                    style={[styles.repInput, { color: colors.text, borderColor: colors.tintText3 }]}
                    value={item.reps.toString()}
                    onChangeText={(value) => updateReps(item.id, value)}
                    keyboardType="numeric"
                  />
                  <Text style={[styles.repUnit, { color: colors.tintText3 }]}>times</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Muscle Groups */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Target Muscles</Text>
            <View style={styles.musclesContainer}>
              {exercise?.targetMuscles.map((muscle, index) => (
                <View key={index} style={[styles.muscleChip, { backgroundColor: colors.card }]}>
                  <Text style={[styles.muscleText, { color: colors.text }]}>{muscle}</Text>
                </View>
              ))}
              {exercise?.secondaryMuscles.slice(0, 2).map((muscle, index) => (
                <View key={index} style={[styles.muscleChip, { backgroundColor: colors.card, opacity: 0.6 }]}>
                  <Text style={[styles.muscleText, { color: colors.tintText3 }]}>{muscle}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        {/* Bottom Action Button */}
        <View style={[styles.bottomBar, { backgroundColor: colors.background }]}>
          <TouchableOpacity style={{ flex: 1 }}>
            <LinearGradient
              colors={gradients.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>


    </View>
  );
};

export default WorkoutDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContainer: {
    height: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  heroPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'PoppinsSemiBold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'PoppinsRegular',
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'PoppinsRegular',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PoppinsSemiBold',
  },
  stepCount: {
    fontSize: 14,
    fontFamily: 'PoppinsRegular',
  },
  description: {
    fontSize: 14,
    fontFamily: 'PoppinsRegular',
    lineHeight: 22,
  },
  readMore: {
    fontFamily: 'PoppinsMedium',
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepIndicator: {
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'PoppinsSemiBold',
  },
  stepLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
    opacity: 0.3,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontFamily: 'PoppinsSemiBold',
    marginBottom: 4,
  },
  stepText: {
    fontSize: 13,
    fontFamily: 'PoppinsRegular',
    lineHeight: 20,
  },
  caloriesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  caloriesText: {
    fontSize: 12,
    fontFamily: 'PoppinsRegular',
  },
  repCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  repLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  repCalories: {
    fontSize: 14,
    fontFamily: 'PoppinsRegular',
  },
  repRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  repInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: 'PoppinsSemiBold',
    minWidth: 60,
    textAlign: 'center',
  },
  repUnit: {
    fontSize: 14,
    fontFamily: 'PoppinsRegular',
  },
  musclesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  muscleChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  muscleText: {
    fontSize: 12,
    fontFamily: 'PoppinsRegular',
  },
  bottomBar: {
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'PoppinsSemiBold',
  },
});