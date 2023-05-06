import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

async function hashPassword(plaintextPassword: string | Buffer) {
    const hash = await bcrypt.hash(plaintextPassword, 10);
    return hash
}

// compare password
async function comparePassword(plaintextPassword: string | Buffer, hash: string) {
    const result = await bcrypt.compare(plaintextPassword, hash)
    return result
}

async function validateUsuario(req: Request, res: Response, pool: any) {
    let { cpf, senha }: any = req.body
    if (cpf && senha) {
        try {
            pool.query("SELECT senha FROM usuarios where cpf=?", [cpf], async function (error: any, results: any, fields: any) {
                if (error) throw error;

                if (results.length > 0) {// se achou usuário
                    const token = generateAccessToken({ cpf: cpf })
                    console.log("token: Bearer", token)
                    const comparaSenha = await comparePassword(senha.toString(), results[0].senha)
                    res.send(comparaSenha ? 'Senha validada com sucesso!' : 'Senha inválida')
                }
                else {
                    res.send("Nenhum usuário encontrado!")
                }
            });
        } catch (err) {
            res.send("Erro ao validar usuário!")
            console.log(err)
        }
    }
    else {
        res.send("Informe CPF e senha!")
    }
}

async function addUsuario(req: Request, res: Response, pool: any) {
    let { nome, cpf, idade, email, senha }: any = req.body

    if (senha) {
        senha = await hashPassword(senha.toString())
    }

    try {
        pool.query("SELECT * FROM usuarios where cpf=?", [cpf], function (error: any, results: any, fields: any) {
            if (results.length > 0) {// se achou usuário
                res.send("Já existe usuário com este CPF!")
            }
            else {
                pool.query("INSERT INTO usuarios (nome, cpf, idade, email, senha) VALUES (?, ?, ?, ?, ?)",
                    [nome, cpf, idade, email, senha], function (error: any, results: any, fields: any) {
                        if (error) throw error

                        if (results) {
                            res.send("Usuário cadastrado com sucesso!")
                        }
                        else {
                            res.send("Erro ao inserir usuário!")
                        }
                    });
            }
        });
    } catch (err) {
        res.send("Erro ao inserir usuário!")
        console.log(err)
    }
}

async function updateUsuario(req: Request, res: Response, pool: any) {
    let { nome, cpf, idade, email, senha }: any = req.body

    if (senha) {
        senha = await hashPassword(senha.toString())
    }

    try {
        pool.query("UPDATE usuarios SET nome=?, idade=?, email=?, senha=? WHERE cpf=?",
            [nome, idade, email, senha, cpf], function (error: any, results: any, fields: any) {
                if (error) throw error

                if (results.affectedRows) {
                    res.send("Usuário atualizado com sucesso!")
                }
                else {
                    res.send("Nenhum usuário encontrado!")
                }
            });
    } catch (err) {
        res.send("Erro ao atualizar usuário!")
        console.log(err)
    }
}

async function deleteUsuario(req: Request, res: Response, pool: any) {
    let { cpf }: any = req.body

    try {
        pool.query("DELETE FROM usuarios WHERE cpf=?",
            [cpf], function (error: any, results: any, fields: any) {
                if (error) throw error;

                if (results.affectedRows) {
                    res.send("Usuário deletado com sucesso!")
                }
                else {
                    res.send("Nenhum usuário encontrado!")
                }
            });
    } catch (err) {
        res.send("Erro ao deletar usuário!")
        console.log(err)
    }
}

async function getUsuarioPorCpf(req: Request, res: Response, pool: any) {
    let { cpf }: any = req.params

    try {
        pool.query("SELECT * FROM usuarios where cpf=?", [cpf], function (error: any, results: any, fields: any) {
            if (error) throw error;

            if (results.length > 0) {// se achou usuário
                res.send(results)
            }
            else {
                res.send("Nenhum usuário encontrado!")
            }
        });
    } catch (err) {
        res.send("Erro ao encontrar usuário!")
        console.log(err)
    }
}

async function getTodosOsUsuarios(req: Request, res: Response, pool: any) {
    try {
        pool.query("SELECT * FROM usuarios", null, function (error: any, results: any, fields: any) {
            if (error) throw error;

            if (results.length > 0) {// se achou usuário
                res.send(results)
            }
            else {
                res.send("Nenhum usuário encontrado!")
            }
        });
    } catch (err) {
        res.send("Erro ao listar usuário!")
        console.log(err)
    }
}

function generateAccessToken(cpf: any) {
    let tokenSecret: any = process.env.TOKEN_SECRET
    return jwt.sign(cpf, tokenSecret, { expiresIn: '1800s' });
}

function authenticateToken(req: Request, res: Response, next: NextFunction, token: string | undefined) {
    if (token == null) return res.sendStatus(401)
    let tokenSecret: any = process.env.TOKEN_SECRET
    jwt.verify(token, tokenSecret, (err: any, user: any) => {
        //console.log(err)
        //if (err) return res.sendStatus(403)
        req.body.user = user
        next()
    })
}

async function verificarToken(req: Request, res: Response, pool: any, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token: string | undefined = authHeader && authHeader.split(' ')[1]
    authenticateToken(req, res, next, token)

    if (req.body.user) {
        res.send("Token válido")
    }
    else {
        res.send("Token inválido! Valide a senha novamente para gerar novo Token.")
    }
}

export default {
    addUsuario,
    updateUsuario,
    deleteUsuario,
    getUsuarioPorCpf,
    getTodosOsUsuarios,
    validateUsuario,
    verificarToken
} 
