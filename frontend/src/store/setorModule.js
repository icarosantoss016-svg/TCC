import api from '@/service/api'


const state={
    setor:[],
    carregando:false,
    error:null
}

const getters= {
    setor:(state) => state.setor,
    todosSetores:(state) =>state.setor,
    estaCarregando:(state) =>state.carregando,
    error:(state)=> state.error
}

const mutations={
    SET_SETOR(state, setorDaApi){
        state.setor = setorDaApi
    },
    SET_CARREGANDO(state,status){
        state.carregando=status
    },
    SET_ERROR(state,error){
        state.error= error
    },
    ADD_SETOR(state,setor){
        state.setor.push(setor)
    },
    UDATE_SETOR(state,setorAtt){
        const index = state.setor.findIdex((s)=>s.id_setor ===setorAtt.id_setor)
        if(index !== -1){
            state.setor.splice(index,1,setorAtt)
        }
    },
    DELETE_SETOR(state,id_setor){
        state.setor = state.setor.filter((s)=>s.id_setor!==id_setor)
    }
}

const actions={
    async listaSetores({commit}){
        commit('SET_CARREGANDO',true)
        commit('SET_ERROR',null)

        try {
            const resposta = await api.get('/api/listarSetor')
            commit('SET_SETOR',resposta.data)
        } catch (error) {
            console.error('Erro ao buscar setores:',error)
            commit('SET_ERROR','Não foi possível carregar os setores.')
        }finally{
            commit('SET_CARREGANDO',false)
        }
    },

    async criarSetor({commit}, setor){
        commit('SET_CARREGANDO',true)
        commit('SET_ERROR', null)

        try {
            const resposta = await api.post ('/api/criarSetor',{
                nome_setor:setor.nome_setor,
                id_empresa:setor.id_empresa
            })
            commit('ADD_SETOR',resposta.data)
        } catch (error) {
            console.error('Erro ao cadastrar setor:',error)
            commit('SET_ERROR','Não foi possível cadastrar setor.')
        }finally{
            commit('SET_CARREGANDO',false)
        }
    },

    async altualizarSetor({commit},id_setor){
        commit('SET_CARREGANDO',true)
        commit('SET_ERROR', null)

        try {
            const resposta = await api.put(`/api/atualizarSetor/${id_setor}`,{
                nome_setor:setor.nome_setor,
                id_empresa:setor.id_empresa
            })
            commit('UDATE_SETOR', resposta.data)
        } catch (error) {
            console.error('Erro ao atualizar os dados do setor:',error)
            commit('SET_ERROR','Não foi possível atualizar os dados do setor.')
            
        }finally{
            commit('SET_CARREGANDO', false)
        }
    },

    async deletarSetor ({commit}, id_setor){
        commit('SET_CARREGANDO', true)
        commit('SET_ERROR', null)

        try {
            await api.delete(`/api/deletarSetor/${id_setor}`)
            commit('DELETE_SETOR', id_setor)
        } catch (error) {
            console.error('Erro ao deletar setor:',error)
            commit('SET_ERRO', 'Não foi possível deletar setor.')
                        
        }finally{
            commit('SET_CARREGANDO',false)
        }
    },
    async buscarSetorId({commit}, setor){
        commit('SET_CARREGANDO',true)
        commit('SET_ERROR', null)

        try {
            const resposta =await api.get(`/api/buscarSetor/${setor.id_setor}`)
            commit('SET_SETOR', resposta.data)
        } catch (error) {
            console.error('Erro ao buscar setor:', error)
            commit('SET_ERROR', 'Não foi possível buscar setor.')
        }
    }


}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}