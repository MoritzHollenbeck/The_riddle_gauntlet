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

module.exports = db;