import { M } from "vue-router/dist/index-DaOfZHXc.js"
import api from('@/service/api')

const state ={
    usuario:[],
    carregando:false,
    error:null
}

const getters= {
    usuario: (state)=>state.usuario,
    todosUsuarios:(state)=>state.usuario,
    estaCarregando:(state)=>state.carregando,
    error:(state)=>state.error
}

const mutations={
    SET_USUARIO(state,usuarioDaApi){
        state.usuario= usuarioDaApi
    },
    SET_CARREGANDO(state,status){
        state.carregando=status
    },
    SET_ERROR(state,error){
        state.error=error
    },
    ADD_USUARIO(state,usuario){
        state.usuario.push(usuario)
    },
    UPDATE_USUARIO(state,usuarioAtt){
        const index = state.usuario.findIndex((u)=>u.id_usuario===usuarioAtt.id_usuario)
        if(index!==-1){
            state.usuario.splice(index,1,usuarioAtt)
        }
    },
    DELETE_USUARIO(state,id_usuario){
        state.usuario=state.usuario.filter((u)=>u.id_usuario!==id_usuario)
    }

}

const actions={
    async listarUsuarios({commit}){
        commit('SET_CARREGANDO',true)
        commit('SET_ERROR',null)

        try {
            const resposta = await api.get('/api/listaUsuario')
            commit('SET_USUARIO', resposta.data)
        } catch (error) {
            console.error('Erro ao buscar usuarios:',error)
            commit('SET_ERROR','Não foi possível carregar os usuarios.')
        }finally{
            commit('SET_CARREGANDO',false)
        }
    },

    async criarUsuario({commit},usuario){
        commit('SET_CARREGANDO',true)
        commit('SET_ERROR', null)

        try {
            const resposta= await api.get('/api/criarusuario',{
                login:usuario.login,
                senha:usuario.senha,
                id_empresa:usuario.id_empresa,
                perfil:usuario.perfil
            })
            commit('ADD_USUARIO',resposta.data)
        } catch (error) {
            console.error('Erro ao cadastrar usuario:',error)
            commit('SET_ERROR','Não foi possível cadastrar usuario.')
        }finally{
            commit('SET_CARREGANDO',false)
        }
    },

    async alterarSenha({commit},usuario){
        commit('SET_CARREGANDO', true)
        commit('SET_ERRO', null)

        try {
            const resposta = await api.put(`/api/atualizarSenha/${usuario.id_usuario}`,{
                senha:usuario.senha
            })
            commit('UPDATE_USUARIO',resposta.data)
        } catch (error) {
            console.error('Erro ao atualizar senha:', error)
            commit('SET_ERROR','Não foi possível atualizar senha.')
        }finally{
            commit('SET_CARREGANDO',false)
        }
    },

    async deletarUsuario({commit},id_usuario){
        commit('SET_CARREGANDO', true)
        commit('SET_ERRO', null)

        try {
            await api.delete(`/api/deletarUsuario/${id_usuario}`)
            commit('DELETE_VITRINE', id_usuario)
        } catch (error) {
            console.error('Erro ao deletar usuario:', error)
            commit('SET_ERROR','Não foi possível deletar usuario.')
        }finally{
            commit('SET_CARREGANDO',false)
        }
    },

    async buscarUsuarioId({commit},usuario){
        commit('SET_CARREGANDO', true)
        commit('SET_ERRO', null)

        try {
            const resposta = await api.get(`/api/buscarUsuario/${usuario.id_usuario}`)
            commit('SET_USUARIO', resposta.data)
        } catch (error) {
            console.error('Erro ao buscar usuarior:', error)
            commit('SET_ERROR', 'Não foi possível buscar usuario.')
        }finally{
            commit('SET_CARREGANDO',false)
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