const { json } = require('sequelize')
const RegraEpi = require('../models/regraEpi')
const Setor = require ('../models/setor')

exports.criarRegraEpi = async (req,res)=>{
    try {
        const {id_setor, nome_Epi} = req.body

        if(!nome_Epi||typeof nome_Epi!== 'string'|| !nome_Epi.trim()){
            return res.status(400).json({error:'Nome do Epi é obrigatório.'})
        }

        if (!id_setor||isNaN(id_setor)){
            return res.status(400).json({error:'Id do setor é obrigatório e deve ser um número.'})
        }

        const setor = await Setor.findOne({where:{id_setor:id_setor}})
        if(!setor|| setor===null|| setor===undefined){
            return res.status(404).json({error:'Setor não encontrado, regra não criada.'})
        }

        const novaRegra = await RegraEpi.create({
            id_setor:setor.id_setor,
            nome_Epi:nome_Epi
        })

        return res.status(201).json({mensagem:'Regra de EPI criada:', novaRegra})
    } catch (error) {
        console.error('Erro ao criar regra de Epi:', error)
        return res.status(500).json({error:'Erro interno ao criar regra de EPI'})
    }
}

exports.listarRegrasEpi = async (req, res) =>{
    try {
        const regras = await RegraEpi.findAll()
        return res.status(200).json(regras)
    } catch (error) {
        console.error('Erro ao listar regras de EPI:', error)
        return res.status(500).json({error:'Erro interno ao listar regras de EPI.'})
    }
}

exports.buscarRegraEpiId= async (req,res) =>{
    try {
        const regra = await RegraEpi.findByPk(req.params.id)

        if(!regra){
            return res.status(404).json({error:'Regra de EPI não localizada.'})
        }
        return res.status(200).json(regra)
    } catch (error) {
        console.error('Erro ao buscar regra de EPI:', error)
        return res.status(500).json({error:'Erro interno ao buscar regra EPI'})
        
    }
}

exports.deletarRegraEpi = async (req, res) =>{
    try {
        const linhasDeletadas = await RegraEpi.destroy({
            where:{id_regra:req.params.id}
        })
    
        if (linhasDeletadas === 0){
            return res.status(404).json({error:'Regra de EPI não localizada.'})
        }
        
        return res.status(200).json({mensagem:'Regrra de EPI deletada com sucesso.'})
    } catch (error) {
        console.error('Errp ao deletar regra de EPI:', error)
        return res.status(500).json({error:'Erro interno ao deletar regra de EPI.'})        
    }
}

exports.atualizarRegraEpi = async (req, res)=>{
    const regra = await RegraEpi.findByPk(req.params.id)
    const {nome_Epi} = req.body

    if(!regra){
        return res.status(404).json({error:'Regra de EPI não localizada.'})
    }

    if(!nome_Epi||typeof nome_Epi!=='string'||!nome_Epi.trim()){
        return res.status(400).json({error:'Nome do Epi é obrigatório.'})
    }

    await regra.update({
        nome_Epi:nome_Epi
    })

    return res.status(201).json({mensagem:'Regra de EPI ataulizada com sucesso.',regra})
}