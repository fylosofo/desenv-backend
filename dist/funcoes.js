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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function hashPassword(plaintextPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash = yield bcrypt_1.default.hash(plaintextPassword, 10);
        return hash;
    });
}
// compare password
function comparePassword(plaintextPassword, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield bcrypt_1.default.compare(plaintextPassword, hash);
        return result;
    });
}
function validateUsuario(req, res, pool) {
    return __awaiter(this, void 0, void 0, function* () {
        let { cpf, senha } = req.body;
        if (cpf && senha) {
            try {
                pool.query("SELECT senha FROM usuarios where cpf=?", [cpf], function (error, results, fields) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (error)
                            throw error;
                        if (results.length > 0) { // se achou usuário
                            const token = generateAccessToken({ cpf: cpf });
                            console.log("token: Bearer", token);
                            const comparaSenha = yield comparePassword(senha.toString(), results[0].senha);
                            res.send(comparaSenha ? 'Senha validada com sucesso!' : 'Senha inválida');
                        }
                        else {
                            res.send("Nenhum usuário encontrado!");
                        }
                    });
                });
            }
            catch (err) {
                res.send("Erro ao validar usuário!");
                console.log(err);
            }
        }
        else {
            res.send("Informe CPF e senha!");
        }
    });
}
function addUsuario(req, res, pool) {
    return __awaiter(this, void 0, void 0, function* () {
        let { nome, cpf, idade, email, senha } = req.body;
        if (senha) {
            senha = yield hashPassword(senha.toString());
        }
        try {
            pool.query("SELECT * FROM usuarios where cpf=?", [cpf], function (error, results, fields) {
                if (results.length > 0) { // se achou usuário
                    res.send("Já existe usuário com este CPF!");
                }
                else {
                    pool.query("INSERT INTO usuarios (nome, cpf, idade, email, senha) VALUES (?, ?, ?, ?, ?)", [nome, cpf, idade, email, senha], function (error, results, fields) {
                        if (error)
                            throw error;
                        if (results) {
                            res.send("Usuário cadastrado com sucesso!");
                        }
                        else {
                            res.send("Erro ao inserir usuário!");
                        }
                    });
                }
            });
        }
        catch (err) {
            res.send("Erro ao inserir usuário!");
            console.log(err);
        }
    });
}
function updateUsuario(req, res, pool) {
    return __awaiter(this, void 0, void 0, function* () {
        let { nome, cpf, idade, email, senha } = req.body;
        if (senha) {
            senha = yield hashPassword(senha.toString());
        }
        try {
            pool.query("UPDATE usuarios SET nome=?, idade=?, email=?, senha=? WHERE cpf=?", [nome, idade, email, senha, cpf], function (error, results, fields) {
                if (error)
                    throw error;
                if (results.affectedRows) {
                    res.send("Usuário atualizado com sucesso!");
                }
                else {
                    res.send("Nenhum usuário encontrado!");
                }
            });
        }
        catch (err) {
            res.send("Erro ao atualizar usuário!");
            console.log(err);
        }
    });
}
function deleteUsuario(req, res, pool) {
    return __awaiter(this, void 0, void 0, function* () {
        let { cpf } = req.body;
        try {
            pool.query("DELETE FROM usuarios WHERE cpf=?", [cpf], function (error, results, fields) {
                if (error)
                    throw error;
                if (results.affectedRows) {
                    res.send("Usuário deletado com sucesso!");
                }
                else {
                    res.send("Nenhum usuário encontrado!");
                }
            });
        }
        catch (err) {
            res.send("Erro ao deletar usuário!");
            console.log(err);
        }
    });
}
function getUsuarioPorCpf(req, res, pool) {
    return __awaiter(this, void 0, void 0, function* () {
        let { cpf } = req.params;
        try {
            pool.query("SELECT * FROM usuarios where cpf=?", [cpf], function (error, results, fields) {
                if (error)
                    throw error;
                if (results.length > 0) { // se achou usuário
                    res.send(results);
                }
                else {
                    res.send("Nenhum usuário encontrado!");
                }
            });
        }
        catch (err) {
            res.send("Erro ao encontrar usuário!");
            console.log(err);
        }
    });
}
function getTodosOsUsuarios(req, res, pool) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            pool.query("SELECT * FROM usuarios", null, function (error, results, fields) {
                if (error)
                    throw error;
                if (results.length > 0) { // se achou usuário
                    res.send(results);
                }
                else {
                    res.send("Nenhum usuário encontrado!");
                }
            });
        }
        catch (err) {
            res.send("Erro ao listar usuário!");
            console.log(err);
        }
    });
}
function generateAccessToken(cpf) {
    let tokenSecret = process.env.TOKEN_SECRET;
    return jsonwebtoken_1.default.sign(cpf, tokenSecret, { expiresIn: '1800s' });
}
function authenticateToken(req, res, next, token) {
    if (token == null)
        return res.sendStatus(401);
    let tokenSecret = process.env.TOKEN_SECRET;
    jsonwebtoken_1.default.verify(token, tokenSecret, (err, user) => {
        //console.log(err)
        //if (err) return res.sendStatus(403)
        req.body.user = user;
        next();
    });
}
function verificarToken(req, res, pool, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        authenticateToken(req, res, next, token);
        if (req.body.user) {
            res.send("Token válido");
        }
        else {
            res.send("Token inválido! Valide a senha novamente para gerar novo Token.");
        }
    });
}
exports.default = {
    addUsuario,
    updateUsuario,
    deleteUsuario,
    getUsuarioPorCpf,
    getTodosOsUsuarios,
    validateUsuario,
    verificarToken
};
