import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const HomeScreen = ({ navigation }) => {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, 'workouts'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const workoutList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWorkouts(workoutList);
    }
  };

  const renderWorkoutItem = ({ item }) => (
    <View style={styles.workoutItem}>
      <Text>{item.exercise}</Text>
      <Text>Weight: {item.weight} {item.unit}</Text>
      <Text>Reps: {item.reps}</Text>
      <Text>Sets: {item.sets}</Text>
      <Text>Rest: {item.rest} seconds</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Add Workout" onPress={() => navigation.navigate('AddWorkout')} />
      <FlatList
        data={workouts}
        renderItem={renderWorkoutItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  workoutItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});

export default HomeScreen;