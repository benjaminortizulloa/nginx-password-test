const dotenv = require('dotenv');
const express = require('express');
var cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const bcrypt = require('bcrypt');

dotenv.config()
app.use(express.json())
app.use(cors())


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


app.get('/jwt', async (req, res) => {
    console.log('jwt')
    console.log('name', req.param('name'))
    console.log('password', req.param('password'))
    let user = users.find(user => user.name == req.param('name'))

    try {
        if (await bcrypt.compare(req.param('password'), user.password)) {

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

    res.json({
        id: process.env.APP_ID,
        jwt: decodedToken
    })
})




module.exports = app;