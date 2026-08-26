const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')
const SECRET = "Senha"

exports.login = async (req, res) => {

    const { login, senha } = req.body

    if (!login || login.trim() === "" || !senha || senha.trim() === "") {
        return res.status(400).json({ erro: 'Login e senha são obrigatórios.' })
    }
    try {
        const usuario = await Usuario.findOne({ where: { login, senha } })
        if (!usuario) {
            return res.status(401).json({ erro: 'Login ou senha inválidos' })
        }

        const token = jwt.sign({ id: usuario.id, login: usuario.login }, SECRET, { expiresIn: '1h' })

        res.json({ token })

    } catch (erro) {
        console.error(error);
        res.status(500).json({ erro: ' Erro ao autenticar usuário' })

    }
}