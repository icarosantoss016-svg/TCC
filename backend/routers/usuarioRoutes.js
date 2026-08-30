const express = require('express')
const router = express.Router();
const usuarioController = require('../controllers/usuarioController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/api/criarusuario', authMiddleware, usuarioController.criarUsuario)
router.get('/api/listaUsuario', authMiddleware,usuarioController.listarUsuarios)
router.get('/api/buscarUsuario/:id', authMiddleware,usuarioController.buscarUsuarioId)
router.put('/api/atualizarSenha/:id',authMiddleware,usuarioController.atualizarSenha)
router.delete('/api/deletarUsuario/:id',authMiddleware,usuarioController.deletarUsuario)

module.exports = router