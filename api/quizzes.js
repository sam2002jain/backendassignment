// api/quizzes.js

let quizzes = [
  {
    "id": 1,
    "subject": "Operating Systems",
    "title": "Memory Management Quiz",
    "questions": [
      {
        "question": "What is paging in Operating Systems?",
        "options": ["Memory Allocation", "Process Scheduling", "I/O Management", "Disk Partitioning"],
        "correctAnswer": "Memory Allocation"
      },
      {
        "question": "Which of these is a memory management scheme?",
        "options": ["First Fit", "Round Robin", "Fair Share", "Preemption"],
        "correctAnswer": "First Fit"
      }
    ]
  },
  {
    "id": 2,
    "subject": "Data Structures",
    "title": "Stack and Queue Basics",
    "questions": [
      {
        "question": "What is a stack?",
        "options": ["FIFO", "LIFO", "Heap", "Queue"],
        "correctAnswer": "LIFO"
      },
      {
        "question": "What is a queue?",
        "options": ["FIFO", "LIFO", "Heap", "Stack"],
        "correctAnswer": "FIFO"
      }
    ]
  }
];


// In-memory storage for leaderboards
const leaderboards = {};

export default function handler(req, res) {
  switch (req.method) {
    case 'GET':
      res.status(200).json({ quizzes });
      break;

    case 'POST':
      const { subject, title, questions } = req.body;

      if (!subject || !title || !questions || !questions.length) {
        return res.status(400).json({ message: 'Invalid quiz data' });
      }

      const newQuiz = {
        id: quizzes.length + 1, // Auto-incremented ID
        subject,
        title,
        questions,
      };

      quizzes.push(newQuiz);
      res.status(201).json({ message: 'Quiz added successfully', quiz: newQuiz });
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}

// POST /quizzes/:id/submit: Submit answers and calculate the score
export const submitQuiz = (req, res) => {
  const quizId = parseInt(req.query.id);
  const { username, answers } = req.body;

  const quiz = quizzes.find((q) => q.id === quizId);
  if (!quiz) {
    return res.status(404).json({ message: 'Quiz not found' });
  }

  if (!answers || !answers.length) {
    return res.status(400).json({ message: 'Answers are required' });
  }

  let score = 0;
  quiz.questions.forEach((question, index) => {
    if (question.correctAnswer === answers[index]) {
      score += 1;
    }
  });

  // Calculate percentage score
  const percentage = (score / quiz.questions.length) * 100;

  // Save the score to the leaderboard
  if (!leaderboards[quizId]) {
    leaderboards[quizId] = [];
  }

  leaderboards[quizId].push({ username, score: percentage });
  leaderboards[quizId].sort((a, b) => b.score - a.score); // Sort leaderboard

  res.json({
    message: 'Quiz submitted successfully',
    score: percentage,
    correctAnswers: quiz.questions.map((q) => q.correctAnswer),
  });
};

// GET /quizzes/:id/leaderboard: Retrieve top scorers for a quiz
export const getLeaderboard = (req, res) => {
  const quizId = parseInt(req.query.id);

  if (!leaderboards[quizId]) {
    return res.status(404).json({ message: 'No leaderboard found for this quiz' });
  }

  res.json({
    leaderboard: leaderboards[quizId],
  });
};
