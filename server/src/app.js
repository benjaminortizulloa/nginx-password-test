const dotenv = require('dotenv');
const express = require('express');
var cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const bcrypt = require('bcrypt');

dotenv.config()
app.use(express.json())
app.use(cors())

let logger = (req, res, next) => {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log('fullurl', fullUrl)
    next()

}

app.use(logger);

// USER STORE - use DB or OAuth

let users = [{
    "name": "ben",
    "password": "$2b$10$DKz5KDkg/VVUMkP4F21LJuxySV2dJhYEjOqY1GsMHpMY6qFIfnHlu"
}];

app.post('/users', async (req, res) => {
    console.log('users', req.body)

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const user = {
            name: req.body.name,
            password: hashedPassword
        }

        users.push(user)
        res.status(201).send();
    } catch {
        res.status(500).send();
    }
})


app.get('/users', (req, res) => {
    res.json({
        users: users
    })
})

// Authentication: Makeshift JWT service, use AWS cognito or similar


app.post('/jwt', async (req, res) => {
    console.log('jwt')
    console.log('body', req.body)
    let nm = req.body.name
    let pw = Buffer.from(req.body.password, 'base64').toString();

    let user = users.find(user => user.name == nm)

    try {
        if (await bcrypt.compare(pw, user.password)) {

            const token = jwt.sign({
                user: user.name
            }, "secret");

            res.header('authorization', token);
            res.json({
                id: process.env.APP_ID,
                message: "you are logged in with a jwt",
                token: token
            })
        } else {
            res.status(401).send()
        }
    } catch {
        res.status(500).send()
    }


})

app.get("/auth", (req, res) => {
    const token = req.get('authorization');
    const decodedToken = jwt.decode(token) || {};

    if (Object.keys(decodedToken).length) {

        res.json({
            id: process.env.APP_ID,
            jwt: decodedToken
        })
    } else {
        res.status(401).send()
    }
})


module.exports = app;