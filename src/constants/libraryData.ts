
export interface LibraryExercise {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro';
  muscleGroup: string;
  equipment: string;
  image: string;
  instructions: string[];
  beginnerAdvice?: string;
}

export const EXERCISE_LIBRARY_DATA: LibraryExercise[] = [
  {
    id: '1',
    name: 'Incline Dumbbell Press',
    instructions: ["Brace your core and plant your feet firmly.","Lower the weight with control until your arms break 90 degrees.","Drive the weight back up forcefully to the starting position."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Incline Dumbbell Press.",
    level: 'Advanced',
    muscleGroup: 'Chest',
    equipment: 'Dumbbells',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Conventional Deadlift',
    instructions: ["Hinge at your hips while keeping your back flat.","Pull the weight towards your body, squeezing your lats.","Lower the weight under control to the start."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Conventional Deadlift.",
    level: 'Pro',
    muscleGroup: 'Back / Legs',
    equipment: 'Barbell',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Wide Grip Pull-up',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Wide Grip Pull-up.",
    level: 'Intermediate',
    muscleGroup: 'Back (Lats)',
    equipment: 'Bodyweight',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Barbell Back Squat',
    instructions: ["Keep your chest up and back straight.","Descend by pushing your hips back and bending your knees.","Drive through your mid-foot to return to the standing position."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Barbell Back Squat.",
    level: 'Pro',
    muscleGroup: 'Quads / Glutes',
    equipment: 'Barbell',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '5',
    name: 'Cable Lateral Raise',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Cable Lateral Raise.",
    level: 'Beginner',
    muscleGroup: 'Shoulders',
    equipment: 'Cables',
    image: 'https://images.unsplash.com/photo-1534367598741-94a984a4a515?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '6',
    name: 'Bulgarian Split Squat',
    instructions: ["Keep your chest up and back straight.","Descend by pushing your hips back and bending your knees.","Drive through your mid-foot to return to the standing position."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Bulgarian Split Squat.",
    level: 'Advanced',
    muscleGroup: 'Unilateral Legs',
    equipment: 'Dumbbells',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '7',
    name: 'Dumbbell Hammer Curl',
    instructions: ["Keep your elbows pinned to your sides.","Curl the weight upwards, contracting the biceps fully.","Slowly lower the weight until your arms are fully extended."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Dumbbell Hammer Curl.",
    level: 'Beginner',
    muscleGroup: 'Biceps',
    equipment: 'Dumbbells',
    image: 'https://images.unsplash.com/photo-1598971639058-aba3c72b9a73?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '8',
    name: 'Bench Press',
    instructions: ["Brace your core and plant your feet firmly.","Lower the weight with control until your arms break 90 degrees.","Drive the weight back up forcefully to the starting position."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Bench Press.",
    level: 'Intermediate',
    muscleGroup: 'Chest',
    equipment: 'Barbell',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '9',
    name: 'Military Press',
    instructions: ["Brace your core and plant your feet firmly.","Lower the weight with control until your arms break 90 degrees.","Drive the weight back up forcefully to the starting position."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Military Press.",
    level: 'Advanced',
    muscleGroup: 'Shoulders',
    equipment: 'Barbell',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99fa51c2a?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '10',
    name: 'Chin-ups',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Chin-ups.",
    level: 'Intermediate',
    muscleGroup: 'Back / Biceps',
    equipment: 'Bodyweight',
    image: 'https://images.unsplash.com/photo-15344383272d6-aba2ff7c058e?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '11',
    name: 'Leg Press',
    instructions: ["Brace your core and plant your feet firmly.","Lower the weight with control until your arms break 90 degrees.","Drive the weight back up forcefully to the starting position."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Leg Press.",
    level: 'Beginner',
    muscleGroup: 'Legs',
    equipment: 'Machine',
    image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '12',
    name: 'Romanian Deadlift',
    instructions: ["Hinge at your hips while keeping your back flat.","Pull the weight towards your body, squeezing your lats.","Lower the weight under control to the start."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Romanian Deadlift.",
    level: 'Advanced',
    muscleGroup: 'Hamstrings / Glutes',
    equipment: 'Barbell',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '13',
    name: 'Dips',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Dips.",
    level: 'Intermediate',
    muscleGroup: 'Chest / Triceps',
    equipment: 'Bodyweight',
    image: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '14',
    name: 'Arnold Press',
    instructions: ["Brace your core and plant your feet firmly.","Lower the weight with control until your arms break 90 degrees.","Drive the weight back up forcefully to the starting position."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Arnold Press.",
    level: 'Advanced',
    muscleGroup: 'Shoulders',
    equipment: 'Dumbbells',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '15',
    name: 'Face Pulls',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Face Pulls.",
    level: 'Beginner',
    muscleGroup: 'Rear Delts',
    equipment: 'Cables',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c64b5ca5?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '16',
    name: 'Seated Row',
    instructions: ["Hinge at your hips while keeping your back flat.","Pull the weight towards your body, squeezing your lats.","Lower the weight under control to the start."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Seated Row.",
    level: 'Beginner',
    muscleGroup: 'Back',
    equipment: 'Cables / Machine',
    image: 'https://images.unsplash.com/photo-1581009146145-b5fefec2c7e2?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '17',
    name: 'Skull Crushers',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Skull Crushers.",
    level: 'Intermediate',
    muscleGroup: 'Triceps',
    equipment: 'EZ Bar',
    image: 'https://images.unsplash.com/photo-1534367598741-94a984a4a515?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '18',
    name: 'Goblet Squat',
    instructions: ["Keep your chest up and back straight.","Descend by pushing your hips back and bending your knees.","Drive through your mid-foot to return to the standing position."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Goblet Squat.",
    level: 'Beginner',
    muscleGroup: 'Legs',
    equipment: 'Kettlebell / Dumbbell',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '19',
    name: 'Walking Lunges',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Walking Lunges.",
    level: 'Intermediate',
    muscleGroup: 'Legs',
    equipment: 'Dumbbells / Bodyweight',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '20',
    name: 'T-Bar Row',
    instructions: ["Hinge at your hips while keeping your back flat.","Pull the weight towards your body, squeezing your lats.","Lower the weight under control to the start."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of T-Bar Row.",
    level: 'Advanced',
    muscleGroup: 'Back',
    equipment: 'Barbell',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '21',
    name: 'Lat Pulldown',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Lat Pulldown.",
    level: 'Beginner',
    muscleGroup: 'Back',
    equipment: 'Cables',
    image: 'https://images.unsplash.com/photo-1598971639058-aba3c72b9a73?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '22',
    name: 'Cable Fly',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Cable Fly.",
    level: 'Intermediate',
    muscleGroup: 'Chest',
    equipment: 'Cables',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '23',
    name: 'Preacher Curl',
    instructions: ["Keep your elbows pinned to your sides.","Curl the weight upwards, contracting the biceps fully.","Slowly lower the weight until your arms are fully extended."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Preacher Curl.",
    level: 'Beginner',
    muscleGroup: 'Biceps',
    equipment: 'EZ Bar / Machine',
    image: 'https://images.unsplash.com/photo-15344383272d6-aba2ff7c058e?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '24',
    name: 'Box Squat',
    instructions: ["Keep your chest up and back straight.","Descend by pushing your hips back and bending your knees.","Drive through your mid-foot to return to the standing position."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Box Squat.",
    level: 'Advanced',
    muscleGroup: 'Legs',
    equipment: 'Barbell',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '25',
    name: 'Hip Thrusts',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Hip Thrusts.",
    level: 'Intermediate',
    muscleGroup: 'Glutes',
    equipment: 'Barbell',
    image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '26',
    name: 'Calf Raise',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Calf Raise.",
    level: 'Beginner',
    muscleGroup: 'Calves',
    equipment: 'Machine / Dumbbells',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99fa51c2a?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '27',
    name: 'Plank',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Plank.",
    level: 'Beginner',
    muscleGroup: 'Core',
    equipment: 'Bodyweight',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '28',
    name: 'Russian Twists',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Russian Twists.",
    level: 'Beginner',
    muscleGroup: 'Core',
    equipment: 'Bodyweight / Weight Plate',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '29',
    name: 'Hanging Leg Raise',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Hanging Leg Raise.",
    level: 'Advanced',
    muscleGroup: 'Core',
    equipment: 'Bodyweight',
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '30',
    name: 'Clean and Press',
    instructions: ["Brace your core and plant your feet firmly.","Lower the weight with control until your arms break 90 degrees.","Drive the weight back up forcefully to the starting position."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Clean and Press.",
    level: 'Pro',
    muscleGroup: 'Full Body',
    equipment: 'Barbell',
    image: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '31',
    name: 'Snatch',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Snatch.",
    level: 'Pro',
    muscleGroup: 'Full Body',
    equipment: 'Barbell',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '32',
    name: 'Front Squat',
    instructions: ["Keep your chest up and back straight.","Descend by pushing your hips back and bending your knees.","Drive through your mid-foot to return to the standing position."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Front Squat.",
    level: 'Advanced',
    muscleGroup: 'Legs / Quads',
    equipment: 'Barbell',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '33',
    name: 'Sumo Deadlift',
    instructions: ["Hinge at your hips while keeping your back flat.","Pull the weight towards your body, squeezing your lats.","Lower the weight under control to the start."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Sumo Deadlift.",
    level: 'Advanced',
    muscleGroup: 'Legs / Back',
    equipment: 'Barbell',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '34',
    name: 'Landmine Press',
    instructions: ["Brace your core and plant your feet firmly.","Lower the weight with control until your arms break 90 degrees.","Drive the weight back up forcefully to the starting position."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Landmine Press.",
    level: 'Intermediate',
    muscleGroup: 'Shoulders / Chest',
    equipment: 'Barbell',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '35',
    name: 'Reverse Fly',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Reverse Fly.",
    level: 'Beginner',
    muscleGroup: 'Rear Delts',
    equipment: 'Dumbbells',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c64b5ca5?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '36',
    name: 'Dumbbell Row',
    instructions: ["Hinge at your hips while keeping your back flat.","Pull the weight towards your body, squeezing your lats.","Lower the weight under control to the start."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Dumbbell Row.",
    level: 'Beginner',
    muscleGroup: 'Back',
    equipment: 'Dumbbells',
    image: 'https://images.unsplash.com/photo-1581009146145-b5fefec2c7e2?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '37',
    name: 'Step Ups',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Step Ups.",
    level: 'Beginner',
    muscleGroup: 'Legs',
    equipment: 'Dumbbells / Box',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '38',
    name: 'Concentration Curl',
    instructions: ["Keep your elbows pinned to your sides.","Curl the weight upwards, contracting the biceps fully.","Slowly lower the weight until your arms are fully extended."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Concentration Curl.",
    level: 'Beginner',
    muscleGroup: 'Biceps',
    equipment: 'Dumbbells',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '39',
    name: 'Dumbbell Shrugs',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Dumbbell Shrugs.",
    level: 'Beginner',
    muscleGroup: 'Traps',
    equipment: 'Dumbbells',
    image: 'https://images.unsplash.com/photo-1534367598741-94a984a4a515?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '40',
    name: 'Tricep Pushdown',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Tricep Pushdown.",
    level: 'Beginner',
    muscleGroup: 'Triceps',
    equipment: 'Cables',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '41',
    name: 'Kettlebell Swing',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Kettlebell Swing.",
    level: 'Intermediate',
    muscleGroup: 'Full Body / Hips',
    equipment: 'Kettlebell',
    image: 'https://images.unsplash.com/photo-1530549387074-d76f9643a6ec?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '42',
    name: 'Single Leg Deadlift',
    instructions: ["Hinge at your hips while keeping your back flat.","Pull the weight towards your body, squeezing your lats.","Lower the weight under control to the start."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Single Leg Deadlift.",
    level: 'Advanced',
    muscleGroup: 'Hamstrings / Balance',
    equipment: 'Dumbbells / Kettlebell',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '43',
    name: 'Turkish Get-Up',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Turkish Get-Up.",
    level: 'Pro',
    muscleGroup: 'Full Body / Stability',
    equipment: 'Kettlebell',
    image: 'https://images.unsplash.com/photo-1591940742878-13aba4b7a35e?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '44',
    name: 'Push Ups',
    instructions: ["Brace your core and plant your feet firmly.","Lower the weight with control until your arms break 90 degrees.","Drive the weight back up forcefully to the starting position."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Push Ups.",
    level: 'Beginner',
    muscleGroup: 'Chest / Triceps',
    equipment: 'Bodyweight',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99fa51c2a?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '45',
    name: 'Farmer\'s Walk',
    instructions: ["Stand tall with a heavy dumbbell or kettlebell in each hand, arms by your sides.","Keep your shoulders back, core braced, and head looking forward.","Walk with smooth, controlled steps for a set distance or time, maintaining a neutral spine."],
    level: 'Beginner',
    muscleGroup: 'Grip / Core / Traps',
    equipment: 'Dumbbells / Kettlebells',
    image: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '46',
    name: 'Medicine Ball Slam',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Medicine Ball Slam.",
    level: 'Beginner',
    muscleGroup: 'Full Body / Power',
    equipment: 'Medicine Ball',
    image: 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '47',
    name: 'GHD Sit-ups',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of GHD Sit-ups.",
    level: 'Advanced',
    muscleGroup: 'Core',
    equipment: 'GHD Machine',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c64b5ca5?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '48',
    name: 'Muscle Up',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Muscle Up.",
    level: 'Pro',
    muscleGroup: 'Upper Body',
    equipment: 'Rings / Pull-up Bar',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '49',
    name: 'Handstand Push Ups',
    instructions: ["Brace your core and plant your feet firmly.","Lower the weight with control until your arms break 90 degrees.","Drive the weight back up forcefully to the starting position."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Handstand Push Ups.",
    level: 'Pro',
    muscleGroup: 'Shoulders',
    equipment: 'Bodyweight',
    image: 'https://images.unsplash.com/photo-1534367598741-94a984a4a515?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '50',
    name: 'Overhead Squat',
    instructions: ["Keep your chest up and back straight.","Descend by pushing your hips back and bending your knees.","Drive through your mid-foot to return to the standing position."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Overhead Squat.",
    level: 'Advanced',
    muscleGroup: 'Full Body / Mobility',
    equipment: 'Barbell',
    image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '51',
    name: 'Thrusters',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Thrusters.",
    level: 'Intermediate',
    muscleGroup: 'Full Body',
    equipment: 'Barbell / Dumbbells',
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '52',
    name: 'Wall Balls',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Wall Balls.",
    level: 'Intermediate',
    muscleGroup: 'Full Body',
    equipment: 'Medicine Ball',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '53',
    name: 'Burpees',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Burpees.",
    level: 'Beginner',
    muscleGroup: 'Full Body',
    equipment: 'Bodyweight',
    image: 'https://images.unsplash.com/photo-1530549387074-d76f9643a6ec?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '54',
    name: 'Mountain Climbers',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Mountain Climbers.",
    level: 'Beginner',
    muscleGroup: 'Core / Cardio',
    equipment: 'Bodyweight',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '55',
    name: 'Box Jumps',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Box Jumps.",
    level: 'Intermediate',
    muscleGroup: 'Legs / Explosiveness',
    equipment: 'Box',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '56',
    name: 'Battle Ropes',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Battle Ropes.",
    level: 'Intermediate',
    muscleGroup: 'Upper Body / Cardio',
    equipment: 'Ropes',
    image: 'https://images.unsplash.com/photo-1591940742878-13aba4b7a35e?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '57',
    name: 'Jump Rope',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Jump Rope.",
    level: 'Beginner',
    muscleGroup: 'Cardio',
    equipment: 'Jump Rope',
    image: 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '58',
    name: 'Swimming',
    instructions: ["Engage your target muscles before moving the weight.","Perform the movement with a slow, controlled tempo.","Return to the starting position smoothly."],
    beginnerAdvice: "Start with an empty bar or very light weight to practice the primary form pattern of Swimming.",
    level: 'Intermediate',
    muscleGroup: 'Full Body',
    equipment: 'Pool',
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=400&auto=format&fit=crop'
  }

  ,
  {
    id: '101',
    name: 'Glute Kickback',
    level: 'Beginner',
    muscleGroup: 'Glutes',
    equipment: 'Machine / Cables',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop',
    instructions: [
      "Attach a cuff to your ankle and face the machine.",
      "Keep a slight bend in your supporting leg.",
      "Kick your cuffed leg straight back, squeezing the glute at the top.",
      "Slowly return the leg without dropping the tension."
    ],
    beginnerAdvice: "Don't swing your torso. Only move your leg to isolate the glute muscle effectively!"
  },
  {
    id: '102',
    name: 'Machine Chest Press',
    level: 'Beginner',
    muscleGroup: 'Chest',
    equipment: 'Machine',
    image: 'https://images.unsplash.com/photo-1598971639058-aba3c72b9a73?q=80&w=400&auto=format&fit=crop',
    instructions: [
      "Sit with your back flat against the pad.",
      "Grip the handles at mid-chest level.",
      "Press outward until your arms are straight but not locked out.",
      "Slowly let the handles return to the starting stretch."
    ],
    beginnerAdvice: "This is much safer than the standard bench press to start. Focus entirely on pushing with your chest muscles rather than your arms."
  },
  {
    id: '103',
    name: 'Seated Leg Extension',
    level: 'Beginner',
    muscleGroup: 'Quads',
    equipment: 'Machine',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=400&auto=format&fit=crop',
    instructions: [
      "Sit on the machine with your back against the pad.",
      "Align your knees with the machine's pivot point.",
      "Fully extend your legs forward, squeezing your quads hard.",
      "Lower the weight back down slowly."
    ],
    beginnerAdvice: "Grip the handles tightly to prevent your hips from lifting off the seat."
  },
  {
    id: '104',
    name: 'Cable Woodchopper',
    level: 'Intermediate',
    muscleGroup: 'Core',
    equipment: 'Cables',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop',
    instructions: [
      "Set the cable pulley to the highest position.",
      "Stand sideways to the machine, grabbing the handle with both hands.",
      "Pull the handle diagonally down across your body.",
      "Twist your torso, keeping your arms straight, then return slowly."
    ],
    beginnerAdvice: "Keep your hips relatively square; let your torso and core do the twisting work."
  }
];