// api/quizzes.js

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Path to quizzes.json file
const quizzesFilePath = path.join(__dirname, '../data/quizzes.json');

// Function to load quizzes from the JSON file
const loadQuizzes = () => {
  try {
    const data = fs.readFileSync(quizzesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading quizzes file:', err);
    return [];
  }
};

// In-memory storage for leaderboards
const leaderboards = {};

// 1. GET /quizzes: Retrieve a list of available quizzes
app.get('/quizzes', (req, res) => {
  const quizzes = loadQuizzes();
  res.json({ quizzes });
});

// 2. POST /quizzes: Add a new quiz (if you still want to support adding quizzes via API)
app.post('/quizzes', (req, res) => {
  const quizzes = loadQuizzes();
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

  // Write the updated quizzes back to the JSON file
  fs.writeFileSync(quizzesFilePath, JSON.stringify(quizzes, null, 2));

  res.status(201).json({ message: 'Quiz added successfully', quiz: newQuiz });
});

// 3. POST /quizzes/:id/submit: Submit answers and calculate the score
app.post('/quizzes/:id/submit', (req, res) => {
  const quizzes = loadQuizzes();
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
app.listen(3000, () => {
  console.log('Quiz API server is running on http://localhost:3000');
});
