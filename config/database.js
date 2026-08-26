const { Sequelize } = require('sequelize')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './tcc_banco.sqlite',
    logging: false
})

module.exports = sequelize