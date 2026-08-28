const express= require('express')
const router = express.Router()
const regraEpiController= require('../controllers/regraEpiController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/api/criarRegra',authMiddleware,regraEpiController.criarRegraEpi)
router.get('/api/listarRegra',authMiddleware,regraEpiController.listarRegrasEpi)
router.get('/api/buscarRegra/id_regra', authMiddleware, regraEpiController.buscarRegraEpiId)
router.put('/api/atulaizarRegra',authMiddleware, regraEpiController.atualizarRegraEpi)
