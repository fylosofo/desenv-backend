"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mysql_1 = __importDefault(require("mysql"));
const body_parser_1 = __importDefault(require("body-parser"));
const funcoes_1 = __importDefault(require("./funcoes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
const pool = mysql_1.default.createPool({
    connectionLimit: 100,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database: process.env.MYSQL_DB,
    debug: false
});
// middleware
app.use((req, res, next) => {
    console.log('Time:', Date.now());
    next();
});
app.listen(process.env.PORT, function () {
    console.log('ouvindo na porta: ' + process.env.PORT);
});
app.get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.send('Olá Mundo!');
    });
});
app.get('/usuarios/listar', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield funcoes_1.default.getTodosOsUsuarios(req, res, pool);
    });
});
app.get('/usuario/cpf/:cpf', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield funcoes_1.default.getUsuarioPorCpf(req, res, pool);
    });
});
app.post('/usuario/cadastrar', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield funcoes_1.default.addUsuario(req, res, pool);
    });
});
app.put('/usuario/atualizar', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield funcoes_1.default.updateUsuario(req, res, pool);
    });
});
app.delete('/usuario/deletar', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield funcoes_1.default.deleteUsuario(req, res, pool);
    });
});
app.post('/usuario/validar', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield funcoes_1.default.validateUsuario(req, res, pool);
    });
});
app.post('/usuario/login', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield funcoes_1.default.verificarToken(req, res, pool, next);
    });
});
