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

    pool.query("INSERT INTO usuarios (nome, cpf, idade, email, senha) VALUES (?, ?, ?, ?, ?)",
        [nome, cpf, idade, email, senha], function (error, results, fields) {
            if (error) throw error;

            if (results) {
                res.send("Usuário cadastrado com sucesso!")
            }
            else {
                res.send("Erro ao inserir usuário!")
            }

        });
}

async function getUsuarioPorCpf(req, res, pool) {
    pool.query("SELECT * FROM usuarios where cpf=?", [req.params.cpf], function (error, results, fields) {
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
    getUsuarioPorCpf,
    getTodosOsUsuarios,
    validateUsuario
}