require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const notesRouter = require('./routes/notes');
const errorHandler = require('./middleware/errorHandler');


const app = express();


// middleware

app.use(
  cors({
    origin: ["https://quicknotes-frontend-yjfy.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());


// routes
app.use('/api/notes', notesRouter);


// health
app.get('/', (req, res) => res.send('Quick Notes API'));


// error handler (last)
app.use(errorHandler);


// start
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;


if (!MONGO_URI) {
console.error('MONGO_URI not set in environment');
process.exit(1);
}


connectDB(MONGO_URI).then(() => {
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
});