const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Read quizzes from quizzes.json file
let quizzes = [];
const quizzesFilePath = path.join(__dirname, 'data', 'quizes.json');

const loadQuizzes = () => {
  try {
    const data = fs.readFileSync(quizzesFilePath, 'utf8');
    quizzes = JSON.parse(data);
    console.log('Quizzes loaded successfully');
  } catch (err) {
    console.error('Error reading quizzes file:', err);
  }
};

// Load quizzes when the server starts
loadQuizzes();

// In-memory storage for leaderboards
const leaderboards = {};

// 1. POST /quizzes: Add a new quiz (if you still want to support adding quizzes via API)
app.post('/quizzes', (req, res) => {
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
});

// 2. GET /quizzes: Retrieve a list of available quizzes
app.get('/quizzes', (req, res) => {
  res.json({ quizzes });
});

// 3. POST /quizzes/:id/submit: Submit answers and calculate the score
app.post('/quizzes/:id/submit', (req, res) => {
  const quizId = parseInt(req.params.id);
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
});

// 4. GET /quizzes/:id/leaderboard: Retrieve top scorers for a quiz
app.get('/quizzes/:id/leaderboard', (req, res) => {
  const quizId = parseInt(req.params.id);

  if (!leaderboards[quizId]) {
    return res.status(404).json({ message: 'No leaderboard found for this quiz' });
  }

  res.json({
    leaderboard: leaderboards[quizId],
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Quiz API server is running on http://localhost:${port}`);
});
