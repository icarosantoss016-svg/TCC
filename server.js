const express = require('express');
const sequelize = require('./config/database');
const Setor = require('./models/Setor');
const Usuario = require('./models/usuario');
const LogAcesso = require('./models/LogAcesso');
const acessoRoutes = require('./routers/acessoRoutes')
const setorRoutes = require ('./routers/setorRoutes')
const usuarioRoutes = require ('./routers/usuarioRoutes')
const authRoutes = require ('./routers/authRoutes')
const relatoriosRoutes = require ('./routers/relatorioRoutes')
const viewsRoutes = require ('./routers/viewsRoutes')
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

app.use(express.json());
app.use(acessoRoutes)
app.use(setorRoutes)
app.use(usuarioRoutes)
app.use(authRoutes)
app.use(relatoriosRoutes)
app.use('/', viewsRoutes);



sequelize.sync({ force: false })
    .then(() => {
        console.log('Banco de dados conectado e tabelas sincronizadas com sucesso.');

        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
    })
    .catch((erro) => {
        console.error('Erro ao conectar com o banco de dados:', erro);
    });