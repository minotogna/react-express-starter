const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const apiRouter = require('./apiRouter')

const app = express()

app.use(morgan('common'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', express.static(path.resolve(__dirname, '..', 'dist')))
app.use('/api', apiRouter)

module.exports = app
