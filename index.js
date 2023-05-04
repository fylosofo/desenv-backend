const express = require('express')
const mysql = require('mysql')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')

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

servidor.listen(process.env.PORT, function() {
    console.log('ouvindo')
});

servidor.get('/', async function(req, res) {
    res.send('Olá Mundo!')
});

servidor.get('/usuario/:cpf', async function(req, res) {
    await pool.query("SELECT * FROM usuarios where cpf=?", [req.params.cpf], function (error, results, fields) {
        if (error) throw error;
 
        if (results.length > 0)  {// se achou usuário
            res.send(results)
        }
        else {
            res.send("Nenhum usuário encontrado!")
        }
        
      });
});

servidor.post('/usuario/', async function(req, res) {
    await pool.query("SELECT * FROM usuarios where cpf=?", [req.body.cpf], function (error, results, fields) {
        if (error) throw error;
 
        if (results.length > 0)  {
            res.send(results)
        }
        else {
            res.send("Nenhum usuário encontrado!!!")
        }
        
      });
});

