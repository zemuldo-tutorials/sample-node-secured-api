const express = require('express')
const jwt = require('jsonwebtoken');
const app = express()
const port = 3000

const db = []
const accessTokenSecret = "some-very-private-and-long-secret";
const refreshTokenSecret = "some-other-private-and-long-secret";

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/register', (req, res) => {
    const { username, password } = req.body

    if (!username) return res.status(400).send('Missing username')
    if (!password) return res.status(400).send('Missing password')

    const exists = db.find(user => user.username === username)

    if (exists) return res.status(400).send('User already exists')

    db.push({ username, password })

    res.send('User created')
})

app.post('/login', (req, res) => {
    const { username, password } = req.body

    const user = db.find(user => user.username === username)

    if (!user) return res.status(404).send('User does not exist')

    if (user.password === password) {
        return res.send({
            accessToken: jwt.sign({ username, exp: Math.floor(Date.now() / 1000) + 20 }, accessTokenSecret),
            refreshToken: jwt.sign({ username, exp: Math.floor(Date.now() / 1000) + 90 }, refreshTokenSecret)
        })
    }
    return res.status(401).send('Password is incorrect')
})

app.get("/user_profile", (req, res) => {
    const token = req.headers['authorization']

    if (!token) return res.status(401).send('Access denied')

    try {
        const { username } = jwt.verify(token, accessTokenSecret)
        return res.send({ username })

    } catch (err) {
        return res.status(401).send('Access denied')
    }
})

app.post('/renew_access_token', (req, res) => {
    const {refreshToken} = req.body
    try {
        const details = jwt.verify(refreshToken, refreshTokenSecret)
        return res.send({
            accessToken: jwt.sign({ ...details, exp: Math.floor(Date.now() / 1000) + 20 }, accessTokenSecret),
            refreshToken: jwt.sign({ username: details.username, exp: Math.floor(Date.now() / 1000) + 90 }, refreshTokenSecret)
        })
    } catch (err) {
        return res.status(403).send('Access denied')
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})