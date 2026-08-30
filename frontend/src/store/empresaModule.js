import api from '@/service/api'

const state ={
    empresa:[],
    carregando:false,
    error:null
}

const getters={
    empresa: (state) =>state.empresa,
    todasEmpresas:(state) => state.empresa,
    estaCarregando: (state) => state.carregando,
    error:(state) => state.error
}

const mutations={
    SET_EMPRESA(state, empresaDaApi){
        state.empresa = empresaDaApi
    },
    SET_CARREGANDO(state,status){
        state.carregando=status
    },
    SET_ERROR(state,error){
        state.error=error
    },
    ADD_EMPRESA(state,empresa){
        state.empresa.push(empresa)
    },
    UPDATE_EMPRESA(state,empresaAtt){
        const index = state.empresa.findIndex((e)=>e.id_empresa ===empresaAtt.id_empresa)

        if(index!==-1){
            state.empresa.splice(index, 1, empresaAtt)
        }
    },
    DELETE_EMPRESA(state, id_empresa){
        state.empresa= state.empresa.filter((e)=>e.id_empresa!==id_empresa)
    }
}

const actions={
    async fetchEmpresa({commit}){
        commit('SET_CARREGANDO', true)
        commit ('SET_ERRO', null)
        try {
            const resposta = await api.get('/api/listaEmpresa')
            commit ('SET_EMPRESA', resposta.data)
        } catch (error) {
            console.error('Erro ao buscar empresas:', error)
            commit('SET_ERROR', 'Não foi possível carregar as empresas.')
            
        }finally{
            commit('SET_CARREGANDO', false)
        }
    },

    async criarEmpresa({commit},empresa){
        commit('SET_CARREGANDO',true)
        commit('SET_ERROR', null)
        try {
            const resposta= await api.post('/api/criarEmpresa',{
                nome:empresa.nome,
                cnpj:empresa.cnpj,
                ramo:empresa.ramo
            })
            commit('ADD_EMPRESA0', resposta.data)
        } catch (error) {
            console.error('Erro ao cadastrar empresa:', error)
            commit('SET_ERROR','Não foi possível cadastrar a empresa.')            
        }finally{
            commit('SET_CARREGANDO', false)
        }
    }
}