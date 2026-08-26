const express = require('express')
const router = express.Router();
const usuarioController = require('../controllers/usuarioController')

router.post('/api/usuario', usuarioController.criarUsuario)

module.exports = router