const express = require('express');
const router = express.Router();
const setorController = require('../controllers/setorController');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/api/buscarSetor/:id',authMiddleware, setorController.buscarSetor)
router.get('/api/listarSetor', authMiddleware, setorController.listarSetor)
router.post('/api/criarSetor',authMiddleware,  setorController.criarSetor);
router.put('/api/atualizarSetor/:id',authMiddleware, setorController.atualizarSetor)
router.delete('/api/deletarSetor/:id',authMiddleware, setorController.deletarSetor)


module.exports = router;