const { DataTypes, ENUM } = require('sequelize')
const sequelize = require('../config/database')
const Setor = require('./setor')

const LogAcesso = sequelize.define('LogAcesso', {
    id_log: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status_acesso: {
        type: DataTypes.ENUM('PERMITIDO', 'NEGADO')
    },
    itens_esquecidos: {
        type: DataTypes.JSON,
        allowNull: true
    },
    data_hora: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }

})


LogAcesso.belongsTo(Setor, {
    foreignKey: 'id_setor',
    allowNull: false
})

module.exports = LogAcesso