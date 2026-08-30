const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    perfil:{
        type:DataTypes.ENUM('ADMIN','ADM_EMPRESA','USUARIO'),
        allowNull:false
    },
    id_empresa:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
})

module.exports = Usuario