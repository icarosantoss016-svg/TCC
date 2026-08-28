const express= require('express')
const router = express.Router()
const regraEpiController= require('../controllers/regraEpiController')
const authMiddleware = require('../middleware/authMiddleware')
const { route } = require('./usuarioRoutes')

router.post('/api/criarRegra',authMiddleware,regraEpiController.criarRegraEpi)
router.get('/api/listarRegra',authMiddleware,regraEpiController.listarRegrasEpi)
router.get('/api/buscarRegra/:id', authMiddleware, regraEpiController.buscarRegraEpiId)
router.put('/api/atulaizarRegra/:id',authMiddleware, regraEpiController.atualizarRegraEpi)
router.delete('/api/deletarRegra/:id',authMiddleware,regraEpiController.deletarRegraEpi)

module.exports= router