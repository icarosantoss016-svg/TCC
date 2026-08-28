const Empresa = require ('../models/empresa')

exports.criarEmpresa= async(req,res)=>{
    try {
        const {nome,cnpj} = req.body

        if(!nome|| typeof nome!=='string'|| !nome.trim()){
            return res.status(400).json({error:'Nome é obrigatorio.'})
        }
        if(!cnpj|| typeof cnpj!=='string'|| !cnpj.trim()){
            return res.status(400).json({error:'CNPJ é obrigatorio.'})

        }

        const novaEmpresa = await Empresa.create({
            nome,
            cnpj
        })

        return res.status(201).json({
            mensage:'Empresa criada com sucesso',
            Empresa: novaEmpresa
        })
    } catch (error) {
        console.error('Erro ao criar empresa:', error)
        return res.status(500).json({error:'Erro interno do servidor ao criar empresa..'})
    }
}

exports.listarEmpresas = async(req,res)=>{
    try {
        const empresas = await Empresa.findAll()

        return res.status(200).json(empresas)
    } catch (error) {
        console.error('Erro ao listar empresas', error)
        return res. status(500).json({error:'Erro interno ao listar empresas.'})
        
    }
}

exports.buscarEmpresasId = async (req,res) =>{
    try {
        const empresa = await Empresa.findByPk(req.params.id)

        if(!empresa){
            return res.status(404).json({error:'Empresa não encotrada.'})
        }

        return res.status(200).json(empresa)
    } catch (error) {
        console.error('Erro ao buscar empresa', error)
        return res. status(500).json({error:'Erro interno ao buscar empresa.'})
    }
}

exports.deletarEmpresa = async (req,res)=>{
    try {
        const linhasDeletadas = await Empresa.destroy({
            where:{id_empresa:req.params.id}
        })

        if(linhasDeletadas===0){
            return res.status(404).json({error:'Empresa não encotrada.'})
        }

        return res.status(200).json({mensagem:'Empresa deletada com sucesso.'})
    } catch (error) {
        console.error("Erro ao deletar a empresa:", error);
        return res.status(500).json({ error: "Erro interno ao deletar empresa." })
    }
}

exports.atualizarEmpresa = async (req, res) => {
      try {
        const empresa = await Empresa.findByPk(req.params.id)
        const {nome,cnpj} = req.body

        if(!nome|| typeof nome!=='string'|| !nome.trim()){
            return res.status(400).json({error:'Nome é obrigatorio.'})
        }
        if(!cnpj|| typeof cnpj!=='string'|| !cnpj.trim()){
            return res.status(400).json({error:'CNPJ é obrigatorio.'})

        }
        if (!empresa) {
          return res.status(404).json({ error: 'Empresa não encontrada.' })
        }
        await empresa.update({
            nome:nome,
            cnpj:cnpj
        })

        return res.status(201).json({
            mensage:'Empresa atualizada com sucesso',
            Empresa:empresa
        })
    } catch (error) {
        console.error('Erro ao atualizar empresa:', error)
        return res.status(500).json({error:'Erro interno do servidor ao atualizar.'})
    }    
}

exports.criarEmpresaAdmin = async()=>{
    try {
        const empresaAdminExiste = await Empresa.findOne({
            where:{cnpj:'00000000000000'}
        })
        
        if(!empresaAdminExiste){
            await Empresa.create({
                nome:'SafeZone',
                cnpj:'00000000000000'
            })
        }

        console.log('Empresa admin padrão criada (Nome:SafeZone, cnpj:00000000000000  )')
    } catch (error) {
        console.error( 'Erro ao criar empresa padrão:', error)    

    }
}

exports.buscarEmpresasPorCNPJ = async function (req,res) {
    try {
        const {cnpj} = req.params
        const empresa = await Empresa.findOne({
            where:{cnpj}
        })

        if(!empresa){
            return res.status(404).json({error:'Nenhuma empresa encontrada com esse CNPJ.'})
        }

        return res.status(200).json(empresa)
    } catch (error) {
        console.error('Erro ao buscar empresa por CNPJ:', error)
        return res.status(500).json({ error: 'Erro interno ao buscar empresa.' })
    }
}