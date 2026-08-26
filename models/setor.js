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
    capacete_obrigatorio: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    luvas_obrigatorio: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    colete_obrigatorio: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

module.exports = Setor