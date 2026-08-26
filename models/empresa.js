const {DataTypes} = require ('sequelize')
const sequelize= require('../config/database')

const Empresa = sequelize.define('Empresa',{
    id_empresa:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    nome:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    cnpj:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    }
})

module.exports = Empresa