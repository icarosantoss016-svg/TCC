const express = require('express')
const router = express.Router()
const empresaController = require('../controllers/empresaContoller')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/api/buscarEmpresa/:id_empresa',authMiddleware,empresaController.buscarEmpresasId)
router.get('/api/listaEmpresa',authMiddleware,empresaController.listarEmpresas)
router.post('/api/criarEmpresa',authMiddleware,empresaController.criarEmpresa)
router.put('/api/atualizarEmpresa/:id_empresa',authMiddleware,empresaController.atualizarEmpresa)
router.delete('/api/deletarEmpresa/:id_empresa',authMiddleware, empresaController.deletarEmpresa)

module.exports= router