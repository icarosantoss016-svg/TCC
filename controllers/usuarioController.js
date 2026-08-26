const Usuario = require('../models/usuario')

exports.criarUsuario = async (req, res) => {
    try {
        const { login, senha } = req.body

        if (!login || login.trim() === "" || login === null || login === undefined) {
            return res.status(400).json({ erro: 'Login é obrigatório.' })
        }

        if (!senha || senha.trim() === '' || senha === null || senha === undefined) {
            return res.status(400).json({ erro: 'Senha é obrigatória.' })
        }

        const novoUsuario = await Usuario.create({ login, senha });

        return res.status(201).json({ mensagem: 'Usuário criado com sucesso.'});
    } catch (erro) {
        console.error("Erro ao criar usuário:", erro);
        return res.status(500).json({ erro: "Erro interno ao criar usuário." });

    }
}