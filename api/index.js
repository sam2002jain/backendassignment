import { promises as fs } from 'fs';
import path from 'path';

// Read quizzes from quizzes.json file
const quizzesFilePath = path.join(process.cwd(), 'data', 'quizzes.json');

const loadQuizzes = async () => {
  try {
    const data = await fs.readFile(quizzesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading quizzes file:', err);
    return [];
  }
};

export default async function handler(req, res) {
  const quizzes = await loadQuizzes();

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
      await fs.writeFile(quizzesFilePath, JSON.stringify(quizzes, null, 2)); // Save updated quizzes
      res.status(201).json({ message: 'Quiz added successfully', quiz: newQuiz });
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
