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

    exports.listarInfracoes = async (req, res) => {
    try {
        const infracoes = await LogAcesso.findAll({
            where: { status_acesso: 'NEGADO' },
            order: [['createdAt', 'DESC']]
        });

        const dicionarioTraducoes = {
            'helmet': 'Capacete',
            'vest': 'Colete',
            'gloves': 'Luvas'
        };
       
        const infracoesTraduzidas = infracoes.map(log => {
      
            const logPuro = log.toJSON() 
            
            let esquecidos = logPuro.itens_esquecidos;

            if (typeof esquecidos === 'string') {
                try { esquecidos = JSON.parse(esquecidos); } catch (e) { esquecidos = [] }
            }

            if (Array.isArray(esquecidos)) {
                logPuro.itens_esquecidos = esquecidos.map(item => {
                    const itemFormatado = item.toLowerCase().trim()
                    return dicionarioTraducoes[itemFormatado] || item
                });
            }

            return logPuro
        });
        return res.status(200).json(infracoesTraduzidas)

    } catch (erro) {
        console.error("Erro ao buscar infrações:", erro)
        return res.status(500).json({ erro: "Erro interno ao gerar relatório de infrações." })
    }
};

    exports.listarEpisMaisEsquecidos = async (req, res) => {
        try {
            const infracoes = await LogAcesso.findAll({
                where: { status_acesso: 'NEGADO' }
            });

            const contagem = {
                'Capacete': 0,
                'Colete': 0,
                'Luvas': 0
            };

            const dicionarioTraducoes = {
                'helmet': 'Capacete',
                'vest': 'Colete',
                'gloves': 'Luvas'
            };

            infracoes.forEach(log => {
                let esquecidos = log.itens_esquecidos;

                if (typeof esquecidos === 'string') {
                    try { esquecidos = JSON.parse(esquecidos); } catch (e) { esquecidos = []; }
                }

                if (Array.isArray(esquecidos)) {
                    esquecidos.forEach(item => {
                        const itemFormatado = item.toLowerCase().trim();
                        const nomeTraduzido = dicionarioTraducoes[itemFormatado];

                        if (nomeTraduzido) {
                            contagem[nomeTraduzido] += 1;
                        } else {
                            contagem[itemFormatado] = (contagem[itemFormatado] || 0) + 1;
                        }
                    });
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

                if (contagem[nomeDoSetor]) {
                    contagem[nomeDoSetor] += 1
                } else {
                    contagem[nomeDoSetor] = 1
                }

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

