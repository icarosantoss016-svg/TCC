const { Sequelize } = require('sequelize')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE||'./tcc_banco.sqlite',
    logging: false
})

sequelize.authenticate()
    .then(()=>('Conectado ao SQLite com sucesso.'))
    .catch(error => console.error('[DB] Falha ao conectar no banco:', error))

module.exports = sequelize