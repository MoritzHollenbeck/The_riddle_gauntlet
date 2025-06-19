import express from "express";
import cors from "cors";
import './database.js';
import flashcardRoutes from './routes/flashcards';

const app = express()
const PORT = process.env.PORT || 3001;

app.use(cors())

app.use(express.json())

app.use('/api/flashcards', flashcardRoutes);


app.get("/", (req, res) => {
    res.json({ message: "The gameserver is running :)"});

});

app.listen(PORT, () => 
    {
        console.log(`Server is running on ${PORT} `)
       }
)

