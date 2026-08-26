const express = require ('express')
const router = express.Router()
const acessoController = require('../controllers/acessoController')

router.post('/api/acesso',acessoController.verificarAcesso)

module.exports = router