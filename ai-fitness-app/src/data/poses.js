const poses = [
  {
    id: 1,
    name: "Squat",
    image: "/assets/poses/squat.jpg",
    video: "/assets/poses/squat.mp4",
    instruction: [
      "Stand with your feet shoulder-width apart",
      "Keep your back straight",
      "Lower your body by bending your knees",
      "Keep your knees aligned with your toes",
      "Go down until your thighs are parallel to the ground",
      "Push through your heels to return to the starting position",
    ],
    evaluation: {
      keyPoints: [
        "Knee angle should be 90° at the bottom position",
        "Back should remain straight throughout the movement",
        "Heels should stay on the ground",
        "Knees should track over toes, not collapse inward",
      ],
      standardAngles: {
        "knee-joint": 90,
        "hip-joint": 45,
        "ankle-joint": 70,
      },
    },
  },
  {
    id: 2,
    name: "Plank",
    image: "/assets/poses/plank.jpg",
    video: "/assets/poses/plank.mp4",
    instruction: [
      "Start in push-up position with your forearms on the ground",
      "Keep your elbows directly beneath your shoulders",
      "Maintain a straight line from head to heels",
      "Engage your core and glutes",
      "Avoid sagging or arching your lower back",
      "Hold the position for the recommended time",
    ],
    evaluation: {
      keyPoints: [
        "Body should form a straight line from head to heels",
        "No sagging in the middle or raising of the hips",
        "Shoulders should be relaxed, not hunched",
        "Core should remain engaged throughout",
      ],
      standardAngles: {
        "elbow-joint": 90,
        "shoulder-joint": 180,
        "hip-joint": 180,
      },
    },
  },
  {
    id: 3,
    name: "Lunge",
    image: "/assets/poses/lunge.jpg",
    video: "/assets/poses/lunge.mp4",
    instruction: [
      "Stand with your feet hip-width apart",
      "Take a big step forward with one leg",
      "Lower your body until both knees are bent at 90°",
      "Keep your front knee above your ankle",
      "Keep your back knee hovering just above the floor",
      "Push through your front heel to return to the starting position",
    ],
    evaluation: {
      keyPoints: [
        "Front knee should be at 90° and aligned with ankle",
        "Back knee should hover just above the floor",
        "Torso should remain upright",
        "Hips should be square and facing forward",
      ],
      standardAngles: {
        "front-knee-joint": 90,
        "back-knee-joint": 90,
        "hip-joint": 120,
      },
    },
  },
  {
    id: 4,
    name: "Push-up",
    image: "/assets/poses/pushup.jpg",
    video: "/assets/poses/pushup.mp4",
    instruction: [
      "Start in plank position with hands slightly wider than shoulder-width",
      "Keep your body in a straight line from head to heels",
      "Lower your body until your chest nearly touches the floor",
      "Keep your elbows close to your body at about a 45° angle",
      "Push back up to the starting position",
    ],
    evaluation: {
      keyPoints: [
        "Body should maintain a straight line throughout",
        "Elbows should bend at approximately 45° to your body",
        "Chest should nearly touch the floor at the bottom",
        "Core should remain engaged to avoid sagging",
      ],
      standardAngles: {
        "elbow-joint": 90,
        "shoulder-joint": 45,
        "hip-joint": 180,
      },
    },
  },
  {
    id: 5,
    name: "Shoulder Press",
    image: "/assets/poses/shoulderpress.jpg",
    video: "/assets/poses/shoulderpress.mp4",
    instruction: [
      "Stand with feet shoulder-width apart",
      "Hold weights at shoulder height with palms facing forward",
      "Press the weights overhead until your arms are fully extended",
      "Lower the weights back to shoulder height with control",
    ],
    evaluation: {
      keyPoints: [
        "Elbows should be fully extended at the top",
        "Avoid arching your lower back",
        "Keep your core engaged throughout",
        "Movement should be controlled both up and down",
      ],
      standardAngles: {
        "elbow-joint": 180,
        "shoulder-joint": 180,
        "wrist-joint": 180,
      },
    },
  },
];

export default poses;
