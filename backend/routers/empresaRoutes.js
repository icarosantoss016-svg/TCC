const express = require('express')
const router = express.Router()
const empresaController = require('../controllers/empresaContoller')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/api/buscarEmpresa/:id',authMiddleware,empresaController.buscarEmpresasId)
router.get('/api/listaEmpresa',authMiddleware,empresaController.listarEmpresas)
router.post('/api/criarEmpresa',authMiddleware,empresaController.criarEmpresa)
router.put('/api/atualizarEmpresa/:id',authMiddleware,empresaController.atualizarEmpresa)
router.delete('/api/deletarEmpresa/:id',authMiddleware, empresaController.deletarEmpresa)
router.get('/api/empresa/cnpj/:cnpj', authMiddleware, empresaController.buscarEmpresasPorCNPJ)

module.exports= router