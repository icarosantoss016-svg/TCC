const {DataTypes} =require('sequelize')
const sequelize = require('../config/database')

const RegraEpi =sequelize.define('RegraEpid',{
    id_setor:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:false
    },
    nome_Epi:{
        type:DataTypes.STRING,
        allowNull:false
    }
})