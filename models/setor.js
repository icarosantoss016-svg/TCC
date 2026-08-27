const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Setor = sequelize.define('Setor', {
    id_setor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nome_setor: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    id_empresa:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
})

module.exports = Setor