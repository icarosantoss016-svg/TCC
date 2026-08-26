const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')
require('dotenv').config()
const bcrypt = require('bcrypt')
const SECRET = process.env.SECRET

exports.login = async (req, res) => {
    try {
        const { login, senha } = req.body
        
        if (!login|| typeof login!=='string'|| !login.trim()){
                return res.status(400).json({ erro: 'Login e senha são obrigatórios.' })
            }

        if(!senha||typeof senha !=='string'||!senha.trim()){
            return res.status(400).json({error:'Senha é obrigatória.'})
        }    

        const usuario = await Usuario.findOne({ where: { login } })

        if (!usuario) {
            return res.status(401).json({ erro: 'Login ou senha inválidos' })
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
        
        if(!senhaCorreta){
            return res.status(401).json({error:'Login ou senha inválidos.'})
        }

        const token = jwt.sign({ id: usuario.id, login: usuario.login, perfil:usuario.perfil} , SECRET, { expiresIn: '1h' })

        res.json({ token })

    } catch (erro) {
        console.error(error);
        res.status(500).json({ erro: ' Erro ao autenticar usuário' })

    }
}