import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const exercises = ['Bicep Curls', 'Lunges', 'Rope Pulldowns', 'Squats', 'Bench Press'];

const AddWorkoutScreen = ({ navigation }) => {
  const [exercise, setExercise] = useState(exercises[0]);
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState('kg');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');
  const [rest, setRest] = useState('');

  const handleAddWorkout = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await addDoc(collection(db, 'workouts'), {
          userId: user.uid,
          exercise,
          weight: parseFloat(weight),
          unit,
          reps: parseInt(reps),
          sets: parseInt(sets),
          rest: parseInt(rest),
          timestamp: new Date(),
        });
        navigation.goBack();
      } catch (error) {
        console.error('Error adding workout:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={exercise}
        onValueChange={(itemValue) => setExercise(itemValue)}
      >
        {exercises.map((ex) => (
          <Picker.Item key={ex} label={ex} value={ex} />
        ))}
      </Picker>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Weight"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />
        <Picker
          selectedValue={unit}
          onValueChange={(itemValue) => setUnit(itemValue)}
          style={styles.unitPicker}
        >
          <Picker.Item label="kg" value="kg" />
          <Picker.Item label="lbs" value="lbs" />
        </Picker>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Reps"
        value={reps}
        onChangeText={setReps}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Sets"
        value={sets}
        onChangeText={setSets}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Rest time (seconds)"
        value={rest}
        onChangeText={setRest}
        keyboardType="numeric"
      />
      <Button title="Add Workout" onPress={handleAddWorkout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  unitPicker: {
    width: 100,
  },
});

export default AddWorkoutScreen;