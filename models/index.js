const  Empresa = require('./empresa')
const Setor = require ('./setor')
const Usuario = require('./usuario')
const RegraEpi = require ('./regraEpi')
const LogAcesso = require ('./logAcesso')

Empresa.hasMany(Setor, {foreignKey:'id_empresa'})
Setor.belongsTo(Empresa, {foreignKey:'id_empresa'})


Empresa.hasMany(Usuario,{foreignKey:'id_empresa'})
Usuario.belongsTo(Empresa,{foreignKey:'id_empresa'})

Setor.hasMany(RegraEpi,{foreignKey:'id_setor'})
RegraEpi.belongsTo(Setor,{foreignKey:'id_setor'})

Setor.hasMany(LogAcesso,{foreignKey:'id_setor'})
LogAcesso.belongsTo(Setor,{foreignKey:'id_setor'})

module.exports = { Empresa, Setor, Usuario, RegraEpi, LogAcesso }