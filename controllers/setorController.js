const Setor = require('../models/setor')
const Empresa = require ('../models/empresa')


exports.criarSetor = async (req, res) => {
    try {
        const { nome_setor, id_empresa } = req.body

        if (!nome_setor || nome_setor.trim() === "") {
            return res.status(400).json({ erro: 'Nome do setor é obriatório' })
        }

        if(!id_empresa|| isNaN(id_empresa)){
            return res.status(400).json({error:'Id da empresa é obrigatório e deve ser um número.'})
        }

        const empresa = await Empresa.findOne({
            where:{id_empresa:id_empresa}
        })
        if(!empresa|| empresa===null|| empresa===undefined){
            return res.status(404).json({error:'Empresa não localizada através do ID, nenhum setor foi cadastrado.'})
        }

        const novoSetor = await Setor.create({ nome_setor, id_empresa:empresa.id_empresa})

        return res.status(201).json({ menssagem: 'Setor criado com sucesso.', setor: novoSetor })
    } catch (erro) {
        console.error("Erro ao criar setor:", erro);
        return res.status(500).json({ erro: "Erro interno ao criar setor" });
    }
}

exports.listarSetor = async (req, res) => {
    try {
        const setor = await Setor.findAll()
        res.status(200).json({ setor })
    } catch (erro) {
        console.error("Erro ao listar setores:", erro);
        return res.status(500).json({ erro: 'Erro interno ao listar os setores.' })
    }
}

exports.buscarSetor = async (req, res) => {
    try {
        const { id_setor } = req.params
        const setor = await Setor.findByPk(id_setor)

        if (!setor) {
            return res.status(404).json({ erro: 'Setor não encontrado.' })
        }
        return res.status(200).json(setor)
    } catch (erro) {
        console.error("Erro ao buscar o setor:", erro);
        return res.status(500).json({ erro: 'Erro interno ao buscar o setor.' })
    }
}

exports.atualizarSetor = async (req, res) => {
    try {
        
        const setor = await Setor.findByPk(req.params.id)
        const { nome_setor} = req.body

        if (!nome_setor || nome_setor.trim() === "") {
            return res.status(400).json({ erro: 'Nome do setor é obriatório' })
        }

        if(!setor){
            return res.status(404).json({error:'Setor não localizado.'})
        }

        await setor.update({ nome_setor:nome_setor })

        res.status(200).json({mensagem:'Setor atualizado com sucesso.',setor})

    } catch (erro) {
        console.error("Erro ao editar setor:", erro);
        return res.status(500).json({ erro: "Erro interno ao editar setor" });

    }
}

exports.deletarSetor = async (req,res) =>{
    try {
        const { id_setor } = req.params
        const setor = await Setor.findByPk(id_setor)

        if(!setor){
            return res.status(404).json({erro: 'Setor não encontrado.'})
        }

        await setor.destroy()
        res.status(200).json({mensagem: 'Setor deletado com sucesso.'})
    } catch (erro) {
        console.error("Erro ao deletar setor:", erro);
        return res.status(500).json({ erro: "Erro interno ao deletar setor" });
        
    }
}