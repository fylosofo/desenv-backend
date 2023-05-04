const express = require('express')
const mysql = require('mysql')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const funcoes = require('./funcoes')

dotenv.config()
const servidor = express()
servidor.use (bodyParser.json())
servidor.use (bodyParser.urlencoded({extended:true}))

const pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : process.env.MYSQL_HOST,
    user     : process.env.MYSQL_USER,
    password : process.env.MYSQL_PWD,
    database : process.env.MYSQL_DB,
    debug    :  false
});



//import funcoes from './funcoes.js'

servidor.listen(process.env.PORT, function() {
    console.log('ouvindo')
});

servidor.get('/', async function(req, res) {
    res.send('Olá Mundo!')
});

servidor.get('/usuario/:cpf', function(req, res) {
    funcoes.getUsuarioPorCpf(req, res, pool)
});

servidor.get('/usuario/listar', function(req, res) {
    funcoes.getTodosOsUsuarios(req, res, pool)
});

servidor.post('/usuario/cadastrar', function (req, res) {
    funcoes.addUsuario(req, res, pool)
});

