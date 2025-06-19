import express from 'express';
const db = require('../database.js');

const router = express.Router();

router.get('/', (req: any, res: any) => {
    db.all('SELECT * FROM flashcards ORDER BY created_at DESC', (err: any, rows: any) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        const flashcards = rows.map((row: any) => ({
            ...row,
            correct_answers: JSON.parse(row.correct_answers),
            wrong_answers: JSON.parse(row.wrong_answers)
        }));
        
        res.json(flashcards);
    });
});

router.get('/quiz', (req: any, res: any) => {
    db.all('SELECT * FROM flashcards', (err: any, rows: any) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (rows.length < 10) {
            return res.status(400).json({ error: 'Need at least 10 flashcards to start quiz' });
        }
        
        const shuffled = rows.sort(() => 0.5 - Math.random());
        const quizCards = shuffled.slice(0, 10);
        
        const questions = quizCards.map((card: any, index: number) => {
            const correctAnswers = JSON.parse(card.correct_answers);
            const wrongAnswers = JSON.parse(card.wrong_answers);
            const allAnswers = [...correctAnswers, ...wrongAnswers].sort(() => 0.5 - Math.random());
            
            return {
                id: card.id,
                questionNumber: index + 1,
                question: card.question,
                answers: allAnswers,
                correctAnswers: correctAnswers
            };
        });
        
        res.json({ questions });
    });
});

router.post('/', (req: any, res: any) => {
    const { question, correct_answers, wrong_answers } = req.body;
    
    if (!question || !correct_answers || !wrong_answers) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    db.run(
        'INSERT INTO flashcards (question, correct_answers, wrong_answers) VALUES (?, ?, ?)',
        [question, JSON.stringify(correct_answers), JSON.stringify(wrong_answers)],
        (err: any) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json({
                message: 'Flashcard created successfully'
            });
        }
    );
});

export default router;