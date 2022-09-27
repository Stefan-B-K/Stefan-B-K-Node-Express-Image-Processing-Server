const express = require('express')
const path = require('path')
const router = require('./src/router')

const app = express()

app.set('views', 'client')
app.set('view engine', 'ejs')

app.use(express.static(path.resolve(__dirname, '../api/uploads/')))
app.use('/', router)
app.get('/*', (request, response) => response.render('index'))

app.listen(3004, () => console.log('App running on port: 3004'))