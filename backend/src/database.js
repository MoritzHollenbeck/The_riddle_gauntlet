const sqlite3 = require("sqlite3").verbose()
const path = require("path")

const dbPath = path.join(__dirname, "..", "database.sqlite")


const db = new sqlite3.Database(dbPath)


db.serialize(() => {
    db.run(`
       CREATE TABLE IF NOT EXISTS flashcards (
            
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            correct_answers TEXT NOT NULL,
            wrong_answers TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP

       ) 
        
        `,
        console.log("table is ready"))
    

})

db.get("SELECT COUNT(*) as count FROM flashcards", (err, row) => {
    if (row.count === 0) {
        console.log("Adding test data...");
        
        const testCards = [
            {
                question: "What is yours but others use it more than you?",
                correct_answers: JSON.stringify(["Name"]),
                wrong_answers: JSON.stringify(["Phone", "Chocolate", "Age"])
            },
            {
                question: "Which are programming languages?",
                correct_answers: JSON.stringify(["JavaScript", "Python"]),
                wrong_answers: JSON.stringify(["HTML", "CSS"])
            },
            {
                question: "Which are programming languages?",
                correct_answers: JSON.stringify(["JavaScript", "Python"]),
                wrong_answers: JSON.stringify(["HTML", "CSS"])
            },
            {
                question: "Which are programming languages?",
                correct_answers: JSON.stringify(["JavaScript", "Python"]),
                wrong_answers: JSON.stringify(["HTML", "CSS"])
            },
            {
                question: "Which are programming languages?",
                correct_answers: JSON.stringify(["JavaScript", "Python"]),
                wrong_answers: JSON.stringify(["HTML", "CSS"])
            },
            {
                question: "Which are programming languages?",
                correct_answers: JSON.stringify(["JavaScript", "Python"]),
                wrong_answers: JSON.stringify(["HTML", "CSS"])
            },
            {
                question: "Which are programming c?",
                correct_answers: JSON.stringify(["JavaScript", "Python"]),
                wrong_answers: JSON.stringify(["HTML", "CSS"])
            },
            {
                question: "Which are programming b?",
                correct_answers: JSON.stringify(["JavaScript", "Python"]),
                wrong_answers: JSON.stringify(["HTML", "CSS"])
            },
            {
                question: "Which are programming a?",
                correct_answers: JSON.stringify(["JavaScript", "Python"]),
                wrong_answers: JSON.stringify(["HTML", "CSS"])
            },
            {
                question: "Which are programming languages?",
                correct_answers: JSON.stringify(["JavaScript", "Python"]),
                wrong_answers: JSON.stringify(["HTML", "CSS"])
            },
            {
                question: "Which are programming languages?",
                correct_answers: JSON.stringify(["JavaScript", "Python"]),
                wrong_answers: JSON.stringify(["HTML", "CSS"])
            },
            {
                question: "Which are programming languages?",
                correct_answers: JSON.stringify(["JavaScript", "Python"]),
                wrong_answers: JSON.stringify(["HTML", "CSS"])
            }
        ];
        
        testCards.forEach(card => {
            db.run(
                "INSERT INTO flashcards (question, correct_answers, wrong_answers) VALUES (?, ?, ?)",
                [card.question, card.correct_answers, card.wrong_answers]
            );
        });
    }
});

module.exports = db;