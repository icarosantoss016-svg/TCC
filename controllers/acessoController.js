const Setor = require('../models/setor')
const LogAcesso = require('../models/logAcesso')

exports.verificarAcesso = async (req, res) => {
    try {
        const { id_camera, itens_detectados } = req.body
        const setor = await Setor.findByPk(id_camera)

        if (!setor) {
            return res.status(400).json({ erro: 'Sertor e/ou câmera não encontrados.' })
        }

        let esquecidos = []
        if (setor.capacete_obrigatorio && !itens_detectados.includes('helmet')) {
            esquecidos.push('helmet')
        }

        if (setor.colete_obrigatorio && !itens_detectados.includes('vest')) {
            esquecidos.push('vest')
        }

        if (setor.luvas_obrigatorio && !itens_detectados.includes('gloves')) {
            esquecidos.push('gloves')
        }

        const status = esquecidos.length === 0 ? 'PERMITIDO' : 'NEGADO'

        const novoLog = await LogAcesso.create({
            id_setor: id_camera,
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