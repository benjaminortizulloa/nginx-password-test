const dotenv = require('dotenv')
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const bcrypt = require('bcrypt')

dotenv.config()
app.use(express.json())

app.all("*", function (req, resp, next) {
    console.log('req', req); // do anything you want here
    next();
});

// USER STORE - use DB or OAuth

let users = [];

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

app.get('/test/:token', (req, res) => {
    console.log('params', req.params)
    res.send(req.params)
})

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