import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import funcoes from './funcoes';

dotenv.config()
const app: Express = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const pool: any = mysql.createPool({
    connectionLimit: 100, //important
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database: process.env.MYSQL_DB,
    debug: false
});

// middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('Time:', Date.now())
    next()
})

app.listen(process.env.PORT, function () {
    console.log('ouvindo na porta: ' + process.env.PORT)
});

app.get('/', async function (req: Request, res: Response) {
    res.send('Olá Mundo!')
});

app.get('/usuarios/listar', async function (req: Request, res: Response) {
    await funcoes.getTodosOsUsuarios(req, res, pool)
});

app.get('/usuario/cpf/:cpf', async function (req: Request, res: Response) {
    await funcoes.getUsuarioPorCpf(req, res, pool)
});

app.post('/usuario/cadastrar', async function (req: Request, res: Response) {
    await funcoes.addUsuario(req, res, pool)
});

app.put('/usuario/atualizar', async function (req: Request, res: Response) {
    await funcoes.updateUsuario(req, res, pool)
});

app.delete('/usuario/deletar', async function (req: Request, res: Response) {
    await funcoes.deleteUsuario(req, res, pool)
});

app.post('/usuario/validar', async function (req: Request, res: Response) {
    await funcoes.validateUsuario(req, res, pool)
});

app.post('/usuario/login', async function (req: Request, res: Response, next: NextFunction) {
    await funcoes.verificarToken(req, res, pool, next)
});
