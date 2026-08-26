const Setor = require('../models/setor')

exports.criarSetor = async (req, res) => {
    try {
        const { nome_setor, capacete_obrigatorio, luvas_obrigatorio, colete_obrigatorio } = req.body

        if (!nome_setor || nome_setor.trim() === "") {
            return res.status(400).json({ erro: 'Nome do setor é obriatório' })
        }
        if (typeof capacete_obrigatorio !== 'boolean') {
            return res.status(400).json({ erro: 'O campo capacete_obrigatorio deve ser verdadeiro (true) ou falso (false).' })
        }

        if (typeof luvas_obrigatorio !== 'boolean') {
            return res.status(400).json({ erro: 'O campo luvas_obrigatorio deve ser verdadeiro (true) ou falso (false).' })
        }

        if (typeof colete_obrigatorio !== 'boolean') {
            return res.status(400).json({ erro: 'O campo colete_obrigatorio deve ser verdadeiro (true) ou falso (false).' })
        }
        const novoSetor = await Setor.create({ nome_setor, capacete_obrigatorio, luvas_obrigatorio, colete_obrigatorio })

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
        const { id_setor } = req.params
        const { nome_setor, capacete_obrigatorio, luvas_obrigatorio, colete_obrigatorio } = req.body

        const setor = await Setor.findByPk(id_setor)

        if (!nome_setor || nome_setor.trim() === "") {
            return res.status(400).json({ erro: 'Nome do setor é obriatório' })
        }

        if (typeof capacete_obrigatorio !== 'boolean') {
            return res.status(400).json({ erro: 'O campo capacete_obrigatorio deve ser verdadeiro (true) ou falso (false).' })
        }

        if (typeof luvas_obrigatorio !== 'boolean') {
            return res.status(400).json({ erro: 'O campo luvas_obrigatorio deve ser verdadeiro (true) ou falso (false).' })
        }

        if (typeof colete_obrigatorio !== 'boolean') {
            return res.status(400).json({ erro: 'O campo colete_obrigatorio deve ser verdadeiro (true) ou falso (false).' })
        }

        await setor.update({ nome_setor, capacete_obrigatorio, luvas_obrigatorio, colete_obrigatorio })

        res.status(200).json(setor)

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