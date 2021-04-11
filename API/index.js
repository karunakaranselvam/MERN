// Third party
const express = require('express')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const app = express()
const cors = require('cors');
const morgan = require('morgan')
const Employee = require('./route/Employee');
require('dotenv/config')

// body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// environment path
const PORT = process.env.PORT;
const logger = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// Middleware
app.use(morgan('combined', { stream: logger }))

// ROUTING
app.get('/test', (req, res) => {
    res.status(200).json('Hello World')
})

app.use('/', Employee)

app.listen(PORT, () => {
    console.log(`Server Starting on ${PORT}`);
})

// DATABASE CONNECTION
try {
    mongoose.set('useNewUrlParser', true)
    mongoose.set('useUnifiedTopology', true)

    mongoose.connect(process.env.CONNECTION, () => {
        console.log('Database Connected Successfully');
    })
} catch (error) {
    console.log(error);
}