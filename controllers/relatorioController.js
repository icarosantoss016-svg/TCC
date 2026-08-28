    const {Op} = require ('sequelize')
    const LogAcesso = require('../models/logAcesso')
    const Setor = require('../models/setor')

    exports.listarTodosOsLogs = async (req, res) => {
        try {
            const logs = await LogAcesso.findAll({ order: [['createdAt', 'DESC']] });

            return res.status(200).json(logs);

        } catch (erro) {
            console.error("Erro ao buscar logs:", erro);
            return res.status(500).json({ erro: "Erro interno ao gerar relatório geral." });
        }
    };

    exports.listarLogsFiltrados = async (req,res)=>{ 
        try {
            const {status} = req.query

            const filtro = {}

            const logs = await LogAcesso.findAll({
                where:filtro,
                order:[['createdAt','DESC']]
            })
        } catch (error) {
            console.error("Erro ao buscar logs:", erro)
            return res.status(500).json({ erro: "Erro interno ao gerar relatório." })
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

exports.relatorioPorCiclo = async (req,res)=>{
    try {
        const {inicio, fim} = req.query
    } catch (error) {
        
    }
}