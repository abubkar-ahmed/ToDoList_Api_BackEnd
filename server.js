require('dotenv').config();
const express = require('express');
const app = express() ;
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path')
const credintials = require('./middleware/credintials');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConn');
const verifyJWT = require('./middleware/verifyJWT') ;
const PORT = process.env.PORT || 3500 ;

connectDB();

app.use(credintials);

app.use(cors(corsOptions));

// Handle Form Data
app.use(express.urlencoded({ extended: false }));

// Handle Json Files
app.use(express.json());

app.use(cookieParser());

// Handle Files
app.use('/', express.static(path.join(__dirname, '/public')));

// User Auth
app.use('/register' , require('./routes/register'));
app.use('/login' , require('./routes/auth'));
app.use('/refresh' , require('./routes/refresh'));
app.use('/logout' , require('./routes/logout'));

app.use(verifyJWT);
app.use('/tasks' , require('./routes/api/task'));

mongoose.connection.once('open' , () => {
    console.log('connect to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})