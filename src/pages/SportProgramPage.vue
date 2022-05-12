<template>
	<div>SPORT PROGRAM</div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
export default {
	data: () => ({
        user: null
    }),
	methods: {
        ...mapActions(["checkActiveProgram"])
    },
	computed: {
        ...mapGetters(["activeProgramStatus"]),
    },
	mounted() {
        this.checkActiveProgram(this.user.id).then(() =>{
            if (!this.activeProgramStatus) {
				this.$router.push({ name: 'start-prog'})
            } else {
                this.$router.push({ name: 'start-prog'})
				
                //
            }
        })
        
        
    },
	created() {
        this.user = JSON.parse(localStorage.getItem("user"))
    }
}
</script>

<style>
	
</style>