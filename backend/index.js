const express = require('express')
const bodyParser = require('body-parser')

const routes = require('./routes/rotas')

const app = express()
const port = 5000

app.use(bodyParser.json())

routes(app)

app.get('/', (req, res) => res.send('Olá mundo pelo Express!'))

app.listen(port, () => console.log('Api rodando na porta 5000'))
