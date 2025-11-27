const express = require('express')
const path = require('path')
const cors = require('cors')
const app = express()

const routes = require('./routes')
const config = require('./config')

app.enable('trust proxy')

app.use(cors({
    origin: "https://fe-videobelajar-react.vercel.app", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', routes)

app.listen(config.port, () => {
    console.log(`Server starting on http://localhost:${config.port}`)
})