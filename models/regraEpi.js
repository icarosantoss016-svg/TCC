const {DataTypes} =require('sequelize')
const sequelize = require('../config/database')

const RegraEpi =sequelize.define('RegraEpi',{
    id_regra:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },  
    id_setor:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    nome_Epi:{
        type:DataTypes.STRING,
        allowNull:false
    }
})

module.exports = RegraEpi