<template>
	<div >
        <div v-if="userProg.is_active">
            
            <!--<product-list></product-list>-->
            <program-base ></program-base>
        </div>
        
    </div>
</template>

<script>
/*eslint-disable*/
import ProgramBase from '../components/ProgramBase.vue';

import ProductList from '../components/ProductList.vue';
import {mapActions, mapGetters} from "vuex";

export default {
    components: { ProgramBase, ProductList},
	data: () => ({
        user: null,
        userProg: null,
        foods: []
    }),
	methods: {
        ...mapActions(["checkActiveProgram", "showFoods"]),
    },
	computed: {
        ...mapGetters(["activeProgramStatus", "getFoods"]),
    },
	mounted() {
        
        //проверка программы в LS
        //проверка сети + обновление LS
        if (!navigator.connection.type === "none") {
            this.checkActiveProgram(this.user.id).then(() =>{
                if (!this.activeProgramStatus) {
                    this.$router.push({ name: 'start-prog'})
                } 
            })
        } 
        
        
    
    },
	created() {
        this.userProg = JSON.parse(localStorage.getItem("program"))
        this.user = JSON.parse(localStorage.getItem("user"))
    }
}
</script>

<style>
	
</style>