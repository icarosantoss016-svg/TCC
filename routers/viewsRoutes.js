const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('login');
});

router.get('/dashboard', (req,res) => {
    res.render('dashboard')
})

router.get('/setores',(req,res)=>{
    res.render('setores')
})

module.exports = router;