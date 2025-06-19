import express from "express";
import cors from "cors";
import './database.js';

const app = express()
const PORT = process.env.PORT || 3001;

app.use(cors())

app.use(express.json())


app.get("/", (req, res) => {
    res.json({ message: "The gameserver is running :)"});

});

app.listen(PORT, () => 
    {
        console.log(`Server is running on ${PORT} `)
       }
)

