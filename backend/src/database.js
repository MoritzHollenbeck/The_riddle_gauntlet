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
                question: "Which of the following are programming languages?",
                correct_answers: JSON.stringify(["JavaScript", "Python"]),
                wrong_answers: JSON.stringify(["HTML", "CSS"])
            },
            {
                question: "What is the favourite color of Moritz?",
                correct_answers: JSON.stringify(["Green"]),
                wrong_answers: JSON.stringify(["Red", "Blue", "Yellow", "Purple"])
            },
            {
                question: "Which famous MMA Fighter uttered the phrase *I AM NOT SURPRISED, MOTHERFUCKERS* after his fight against Connor Mc Gregor?",
                correct_answers: JSON.stringify(["Nate Diaz"]),
                wrong_answers: JSON.stringify(["Khabib Nurmagomedov", "Mike Tyson", "Eddie Hall"])
            },
            {
                question: "What is the time complexity of the Smith Waterman algorithm?",
                correct_answers: JSON.stringify(["O(m*n)"]),
                wrong_answers: JSON.stringify(["O(n)", "O(1)", "O(n log n)"])
            },
            {
                question: "What is the time complexity of searching in a balanced binary search tree?",
                correct_answers: JSON.stringify(["O(log n)"]),
                wrong_answers: JSON.stringify(["O(n)", "O(1)", "O(n log n)"])
            },
             {
                question: "In Git, which commands can rewrite commit history?",
                correct_answers: JSON.stringify(["git rebase", "git reset --hard", "git commit --amend"]),
                wrong_answers: JSON.stringify(["git merge", "git pull"])
            },
            {
                question: "Which are valid HTTP status codes for client errors?",
                correct_answers: JSON.stringify(["400", "401", "403", "404"]),
                wrong_answers: JSON.stringify(["200", "500"])
            },
            {
                question: "Which are benefits of using TypeScript over JavaScript?",
                correct_answers: JSON.stringify(["Type safety", "Compile-time error checking"]),
                wrong_answers: JSON.stringify(["Faster runtime", "Smaller bundle size"])
            },
            {
                question: "In REST APIs, which HTTP methods are idempotent?",
                correct_answers: JSON.stringify(["GET", "PUT", "DELETE"]),
                wrong_answers: JSON.stringify(["POST", "PATCH"])
            },
           {
    question: "Three people check into a hotel room that costs $30. They each pay $10. Later, the manager realizes the room only costs $25 and gives the bellboy $5 to return. The bellboy keeps $2 and gives each person $1 back. Now each person paid $9 (totaling $27) and the bellboy has $2. Where did the missing dollar go?",
    correct_answers: JSON.stringify(["There is no missing dollar - the $27 includes the bellboy's $2"]),
    wrong_answers: JSON.stringify(["The bellboy stole it", "The manager kept it", "It's a mathematical impossibility"])
},
{
    question: "A father and son are in a car crash. The father dies instantly. The son is rushed to hospital for emergency surgery. The surgeon says 'I cannot operate on this boy - he is my son!' How is this possible?",
    correct_answers: JSON.stringify(["The surgeon is the boy's mother"]),
    wrong_answers: JSON.stringify(["The boy has two fathers", "The surgeon is lying", "It's the boy's stepfather"])
},
{
    question: "You have 12 balls that look identical. 11 weigh exactly the same, but one weighs slightly different (either heavier or lighter). Using a balance scale only 3 times, how can you identify the different ball AND determine if it's heavier or lighter?",
    correct_answers: JSON.stringify(["Divide into groups of 4, weigh 4 vs 4, then subdivide based on results"]),
    wrong_answers: JSON.stringify(["Weigh 6 vs 6 first", "Test each ball individually", "It's impossible with only 3 weighings"])
},
{
    question: "A prisoner is told: 'If you tell a lie, you will be hanged. If you tell the truth, you will be shot.' What can the prisoner say to avoid both punishments?",
    correct_answers: JSON.stringify(["You will hang me", "I will be hanged"]),
    wrong_answers: JSON.stringify(["I am innocent", "I don't know", "Nothing"])
},
{
    question: "Three switches control three light bulbs in another room. You can flip the switches as many times as you want, but can only check the room with the bulbs once. How do you determine which switch controls which bulb?",
    correct_answers: JSON.stringify(["Turn first switch on for several minutes, then off. Turn second switch on. Check room: hot bulb = first switch, on bulb = second switch, cool off bulb = third switch"]),
    wrong_answers: JSON.stringify(["It's impossible", "You need to check twice", "Label the switches first"])
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