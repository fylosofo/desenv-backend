function addUsuario(req, res, pool) {
    pool.query("INSERT INTO usuarios (nome, cpf) VALUES (?, ?)", [req.body.nome, req.body.cpf], function (error, results, fields) {
        if (error) throw error;
 
        if (results)  {
            res.send("Usuário cadastrado com sucesso!")
        }
        else {
            res.send("Erro ao inserir usuário!")
        }
        
      });
}

function getUsuarioPorCpf(req, res, pool){
    pool.query("SELECT * FROM usuarios where cpf=?", [req.params.cpf], function (error, results, fields) {
        if (error) throw error;
 
        if (results.length > 0)  {// se achou usuário
            res.send(results)
        }
        else {
            res.send("Nenhum usuário encontrado!")
        }
        
      });
}

function getTodosOsUsuarios(req, res, pool){
    pool.query("SELECT * FROM usuarios", [], function (error, results, fields) {
        if (error) throw error;
 
        if (results.length > 0)  {// se achou usuário
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
    getTodosOsUsuarios
}