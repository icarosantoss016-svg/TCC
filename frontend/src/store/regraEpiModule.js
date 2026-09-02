import api from '@/service/api'

const state ={ 
    regraEpi:[],
    carregando:false,
    error:null
}

const getters={
    regraEpi:  (state) => state.regraEpi,
    todasRegrasEpi:(state)=> state.regraEpi,
    estaCarregando:(state)=>state.carregando,
    error:(state) =>state.error
}

const mutations={
    SET_REGRA(state, regraEpiDaApi){
        state.regraEpi=regraEpiDaApi
    },
    SET_CARREGANDO(state,status){
        state.carregando = status
    },
    SET_ERROR(state,error){
        state.error= error
    },
    

}