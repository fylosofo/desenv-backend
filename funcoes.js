const bcrypt = require('bcrypt')

async function hashPassword(plaintextPassword) {
    const hash = await bcrypt.hash(plaintextPassword, 10);
    return hash
}

// compare password
async function comparePassword(plaintextPassword, hash) {
    const result = await bcrypt.compare(plaintextPassword, hash)
    return result
}

async function validateUsuario(req, res, pool) {
    if (req.body.cpf && req.body.senha) {
        pool.query("SELECT senha FROM usuarios where cpf=?", [req.body.cpf], async function (error, results, fields) {
            if (error) throw error;

            if (results.length > 0) {// se achou usuário
                const comparaSenha = await comparePassword(req.body.senha.toString(), results[0].senha)
                res.send(comparaSenha ? 'Senha validada com sucesso!' : 'Senha inválida')
            }
            else {
                res.send("Nenhum usuário encontrado!")
            }

        });
    }
    else {
        res.send("Informe CPF e senha!")
    }
}

async function addUsuario(req, res, pool) {
    let { nome, cpf, idade, email, senha } = req.body

    if (senha) {
        senha = await hashPassword(senha.toString())
    }

    try {
        pool.query("SELECT * FROM usuarios where cpf=?", [cpf], function (error, results, fields) {
            if (results.length > 0) {// se achou usuário
                res.send("Já existe usuário com este CPF!")
            }
            else {
                pool.query("INSERT INTO usuarios (nome, cpf, idade, email, senha) VALUES (?, ?, ?, ?, ?)",
                    [nome, cpf, idade, email, senha], function (error, results, fields) {
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

async function updateUsuario(req, res, pool) {
    let { nome, cpf, idade, email, senha } = req.body

    if (senha) {
        senha = await hashPassword(senha.toString())
    }

    pool.query("UPDATE usuarios SET nome=?, idade=?, email=?, senha=? WHERE cpf=?",
        [nome, idade, email, senha, cpf], function (error, results, fields) {
            if (error) throw error

            if (results.affectedRows) {
                res.send("Usuário atualizado com sucesso!")
            }
            else {
                res.send("Nenhum usuário encontrado!")
            }
        });
}

async function deleteUsuario(req, res, pool) {
    let { cpf } = req.body

    pool.query("DELETE FROM usuarios WHERE cpf=?",
        [cpf], function (error, results, fields) {
            if (error) throw error;

            if (results.affectedRows) {
                res.send("Usuário deletado com sucesso!")
            }
            else {
                res.send("Nenhum usuário encontrado!")
            }
        });
}

async function getUsuarioPorCpf(req, res, pool) {
    let cpf = (req.body) ? req.body.cpf : req.params.cpf

    pool.query("SELECT * FROM usuarios where cpf=?", [cpf], function (error, results, fields) {
        if (error) throw error;

        if (results.length > 0) {// se achou usuário
            res.send(results)
        }
        else {
            res.send("Nenhum usuário encontrado!")
        }

    });
}

async function getTodosOsUsuarios(req, res, pool) {
    pool.query("SELECT * FROM usuarios", null, function (error, results, fields) {
        if (error) throw error;

        if (results.length > 0) {// se achou usuário
            res.send(results)
        }
        else {
            res.send("Nenhum usuário encontrado!")
        }

    });
}

module.exports = {
    addUsuario,
    updateUsuario,
    deleteUsuario,
    getUsuarioPorCpf,
    getTodosOsUsuarios,
    validateUsuario
}