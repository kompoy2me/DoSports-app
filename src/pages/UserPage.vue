<template>
	<div>
        <div>{{ `welcome, ${this.getUser.login}` }}</div>
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
import { mapActions, mapGetters } from 'vuex'
export default {
    methods: {
        ...mapActions(["unauthorized", "checkAccess"]),
        logOut() {
            this.unauthorized().then(() => {
                this.$router.push({name: "start"})
            })
        },
    },
    computed: {
        ...mapGetters(["getUser"])
    },
    created() {
        this.checkAccess();
    }
}
</script>

<style>
	
</style>