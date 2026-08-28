const express = require('express');
const sequelize = require('./config/database');
require('./models')

const acessoRoutes = require('./routers/acessoRoutes')
const setorRoutes = require('./routers/setorRoutes')
const usuarioRoutes = require('./routers/usuarioRoutes')
const authRoutes = require('./routers/authRoutes')
const relatoriosRoutes = require('./routers/relatorioRoutes')
const viewsRoutes = require('./routers/viewsRoutes')
const empresaRoutes = require('./routers/empresaRoutes')

const { criarEmpresaAdmin } = require('./controllers/empresaContoller')
const { criarAdminPadrao} = require('./controllers/usuarioController')

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

app.use(express.json());
app.use(acessoRoutes)
app.use(setorRoutes)
app.use(usuarioRoutes)
app.use(authRoutes)
app.use(relatoriosRoutes)
app.use(empresaRoutes)
app.use('/', viewsRoutes);



sequelize.sync({ force: false })
    .then(async() => {
        console.log('Banco de dados conectado e tabelas sincronizadas com sucesso.');
        await criarEmpresaAdmin()   
        await criarAdminPadrao()
        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
    })
    .catch((erro) => {
        console.error('Erro ao conectar com o banco de dados:', erro);
    });