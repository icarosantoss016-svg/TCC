const express = require('express')
const router = express.Router();
const usuarioController = require('../controllers/usuarioController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/api/usuario', authMiddleware, usuarioController.criarUsuario)
router.get('/api', authMiddleware,usuarioController.listarUsuarios)
router.get('/api/buscarUsuario/:id_usuario', authMiddleware,usuarioController.buscarUsuarioId)
router.put('/api/atualizarSenha/:id_usuario',authMiddleware,usuarioController.atualizarSenha)
router.delete('/api/deletarUsuario/:id_usuario',authMiddleware,usuarioController.deletarUsuario)

module.exports = router