const express = require('express');
const router = express.Router();
const relatorioController = require('../controllers/relatorioController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.get('/api/relatorios/geral', authMiddleware, relatorioController.listarLogsFiltrados);
router.get('/api/relatorios/ranking-epis', authMiddleware, relatorioController.listarEpisMaisEsquecidos)
router.get('/api/relatorios/ranking-setores', authMiddleware, relatorioController.listarSetorMaisInfracoes)
router.get('/api/relatorios/ciclo', authMiddleware, relatorioController.relatorioPorCiclo)
module.exports = router;