import axios from "axios";
export default{
    state: {
        regions: []
    },
    actions: {
        async getRegionList(ctx) {
            await axios.get('https://dosports.ru/api/regions/get-regions').then((res) => {   
            ctx.commit('updateRegions', res.data)
            })
        }
    },
    mutations: {
        updateRegions(state, regions) {
            state.regions = regions
        }

    },
    getters: {
        getRegions(state) {
            return state.regions
        }
    }
    
}