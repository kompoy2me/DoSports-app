<template>
	<div>
        <div>{{ `welcome, ${user.login}` }}</div>
        <v-btn
            @click="logOut"
            color="primary"
            large
            block
            class="mt-4"
            >Выйти
            </v-btn>
    </div>
</template>

<script>
import { mapActions} from 'vuex'
export default {
    data: () => ({
        user: JSON.parse(localStorage.getItem("user"))
    }),
    methods: {
        ...mapActions(["unauthorized"]),
        logOut() {
            this.unauthorized().then(() => {
                this.$router.push({name: "start"})
            })
        }
    },
    created() {
        this.user = JSON.parse(localStorage.getItem("user"))
    }
}
</script>

<style>
	
</style>