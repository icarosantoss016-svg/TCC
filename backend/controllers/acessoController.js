const Setor = require('../models/setor')
const RegraEpi = require ('../models/regraEpi')
const Empresa = require ('../models/empresa')
const LogAcesso = require('../models/logAcesso')

exports.verificarAcesso = async (req, res) => {
    try {
        const { id_setor,id_empresa, itens_detectados } = req.body

        if(!id_setor|| !id_empresa|| !Array.isArray(itens_detectados)){
            return res.status(400).json({erro:'Dados incompletos enviados pela câmera.'})
        }


        const setor = await Setor.findOne({
            where:{id_setor:id_setor}, 
            include:RegraEpi})

        if (!setor) {
            return res.status(400).json({ erro: 'Setor não encontrado.' })
        }

        if(setor.id_empresa!==id_empresa){
            console.warn(`Câmera do setor ${id_setor} informou empresa ${id_empresa}, mas o setor pertence à empresa ${setor.id_empresa}`)

            return res.status(400).json({erro:'Setor não pertence a empresa informada.'})
            
        }

        const regrasDoSetor = setor.RegraEpis||[]

        let esquecidos = []

        for (const regra of regrasDoSetor){
            const epiExigido=regra.nome_Epi.toLowerCase()
            
            if(!itens_detectados.includes(epiExigido)){
                esquecidos.push(regra.nome_exibicao)
            }
        }
        const status = esquecidos.length === 0 ? 'PERMITIDO' : 'NEGADO'

        await LogAcesso.create({
            id_setor: id_setor,
            status_acesso: status,
            itens_esquecidos: esquecidos
        })

        return res.status(200).json({
            mensagem: "Processado com sucesso",
            acesso: status,
            esquecidos: esquecidos
        })
    } catch (erro) {
        console.error("Erro no processamento:", erro);
        return res.status(500).json({ erro: "Erro interno do servidor" })

    }
}