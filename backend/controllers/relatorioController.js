    const {Op} = require ('sequelize')
    const LogAcesso = require('../models/logAcesso')
    const Setor = require('../models/setor')

    exports.listarLogsFiltrados = async (req,res)=>{ 
        try {
            const {status} = req.query
            const filtro = {}
            
            if (status ==='PERMITDO'||status === 'NEGADO'){
                filtro.status_acesso=status
                }

            const logs = await LogAcesso.findAll({
                where:filtro,
                order:[['createdAt','DESC']]
            })

            return res.status(200).json(logs)
        } catch (error) {
            console.error("Erro ao buscar logs:", error)
            return res.status(500).json({ error: "Erro interno ao gerar relatório." })
        }
    }   

    exports.listarEpisMaisEsquecidos = async (req, res) => {
        try {
            const infracoes = await LogAcesso.findAll({
                where: { status_acesso: 'NEGADO' }
            });

            const contagem = {}

            infracoes.forEach(log => {
                let esquecidos = log.itens_esquecidos;

                if (typeof esquecidos === 'string') {
                    try { esquecidos = JSON.parse(esquecidos); } catch (e) { esquecidos = []; }
                }

                if (Array.isArray(esquecidos)) {
                    esquecidos.forEach(nomeEpi => {
                        contagem[nomeEpi] = (contagem[nomeEpi]||0) +1
                    })
                }
            });

            const ranking = Object.keys(contagem)
                .map(nomeEpi => {
                    return { epi: nomeEpi, quantidade: contagem[nomeEpi] };
                })
                .sort((a, b) => b.quantidade - a.quantidade);

            return res.status(200).json(ranking);

        } catch (erro) {
            console.error("Erro ao buscar EPIs mais esquecidos:", erro);
            return res.status(500).json({ erro: "Erro interno ao gerar ranking de EPIs." });
        }
    };

    exports.listarSetorMaisInfracoes = async (req, res) => {
        try {
            const infracoes = await LogAcesso.findAll({
                where: { status_acesso: 'NEGADO' },
                include: [{ model: Setor, attributes: ['nome_setor'] }]
            })

            const contagem = {}

            infracoes.forEach(Log => {
                const nomeDoSetor = Log.Setor ? Log.Setor.nome_setor : 'Setor Deletado / Desconhecido.'
                contagem[nomeDoSetor] = (contagem[nomeDoSetor]|| 0) +1

            })

            const raking = Object.keys(contagem).map(nome => {
                return {setor:nome, quantidade: contagem[nome]}
            })

            return res.status(200).json(raking)

        } catch (erro) {
            console.error("Erro ao buscar setores com mais infrações:", erro);
            return res.status(500).json({ erro: "Erro interno ao gerar lista de setores." });
        }   
    }


    exports.relatorioPorCiclo = async (req, res) => {
    try {
        const { inicio, fim } = req.query

        if (!inicio || !fim) {
            return res.status(400).json({ error: 'Informe as datas de início e fim (inicio, fim).' })
        }

        const logs = await LogAcesso.findAll({
            where: {
                createdAt: {
                    [Op.between]: [new Date(inicio), new Date(fim)]
                }
            },
            include: [{ model: Setor, attributes: ['nome_setor'] }],
            order: [['createdAt', 'ASC']]
        })

        const agrupadoPorDia = {}
        const episMaisEsquecidos = {}
        const setoresComMaisInfracoes = {}

        logs.forEach(log => {
            const dia = log.createdAt.toISOString().split('T')[0]

            if (!agrupadoPorDia[dia]) {
                agrupadoPorDia[dia] = { permitido: 0, negado: 0 }
            }

            if (log.status_acesso === 'PERMITIDO') {
                agrupadoPorDia[dia].permitido += 1
                return
            }

            agrupadoPorDia[dia].negado += 1

            let esquecidos = log.itens_esquecidos
            if (typeof esquecidos === 'string') {
                try { esquecidos = JSON.parse(esquecidos) } catch (e) { esquecidos = [] }
            }
            if (Array.isArray(esquecidos)) {
                esquecidos.forEach(nomeEpi => {
                    episMaisEsquecidos[nomeEpi] = (episMaisEsquecidos[nomeEpi] || 0) + 1
                })
            }

            const nomeDoSetor = log.Setor ? log.Setor.nome_setor : 'Setor não localizado'
            setoresComMaisInfracoes[nomeDoSetor] = (setoresComMaisInfracoes[nomeDoSetor] || 0) + 1
        })

        const rankingEpis = Object.keys(episMaisEsquecidos)
            .map(epi => ({ epi, quantidade: episMaisEsquecidos[epi] }))
            .sort((a, b) => b.quantidade - a.quantidade)

        const rankingSetores = Object.keys(setoresComMaisInfracoes)
            .map(setor => ({ setor, quantidade: setoresComMaisInfracoes[setor] }))
            .sort((a, b) => b.quantidade - a.quantidade)

        return res.status(200).json({ agrupadoPorDia, rankingEpis, rankingSetores })

    } catch (error) {
        console.error('Erro ao gerar relatório de ciclo:', error)
        return res.status(500).json({ error: 'Erro interno ao gerar relatório de ciclo.' })
    }
}