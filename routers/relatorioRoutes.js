const express = require('express');
const router = express.Router();
const relatorioController = require('../controllers/relatorioController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.get('/api/relatorios/geral', authMiddleware, relatorioController.listarTodosOsLogs);
router.get('/api/relatorios/infracoes', authMiddleware, relatorioController.listarInfracoes);
router.get('/api/relatorios/ranking-epis', authMiddleware, relatorioController.listarEpisMaisEsquecidos)
router.get('/api/relatorios/ranking-setores', authMiddleware, relatorioController.listarSetorMaisInfracoes)

module.exports = router;