const express = require('express')
const mysql = require('mysql')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const funcoes = require('./funcoes')


dotenv.config()
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const pool = mysql.createPool({
    connectionLimit: 100, //important
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database: process.env.MYSQL_DB,
    debug: false
});

// middleware
app.use((req, res, next) => {
    console.log('Time:', Date.now())
    next()
})

app.listen(process.env.PORT, function () {
    console.log('ouvindo na porta: ' + process.env.PORT)
});

app.get('/', async function (req, res) {
    res.send('Olá Mundo!')
});

app.get('/usuarios/listar', async function (req, res) {
    await funcoes.getTodosOsUsuarios(req, res, pool)
});

app.get('/usuario/cpf/:cpf', async function (req, res) {
    await funcoes.getUsuarioPorCpf(req, res, pool)
});

app.post('/usuario/cadastrar', async function (req, res) {
    await funcoes.addUsuario(req, res, pool)
});

app.put('/usuario/atualizar', async function (req, res) {
    await funcoes.updateUsuario(req, res, pool)
});

app.delete('/usuario/deletar', async function (req, res) {
    await funcoes.deleteUsuario(req, res, pool)
});

app.post('/usuario/validar', async function (req, res) {
    await funcoes.validateUsuario(req, res, pool)
});

app.post('/usuario/login', async function (req, res, next) {
    await funcoes.verificarToken(req, res, pool, next)
});


