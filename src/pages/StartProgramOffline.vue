<template>
	<div class="pa-4">
        <div class="headline">Начните свою программу прямо сейчас >>></div>
        <div >Чтобы продолжить, подключите устройство к сети</div>
        <v-btn
            @click="checkNetwork"
            color="primary"
            large
            block
            class="mt-4"
        >Начать</v-btn>
    </div>
</template>

<script>
import { mapGetters} from 'vuex'
export default {
    computed: {
        ...mapGetters(["getConnState"])
    },
    methods: {
        checkNetwork() {
            alert(this.getConnState)
            if (this.getConnState === "none") {
                alert('Проверьте подключение к сети');
            }
            else {
                this.$router.push({ name: 'start-prog'})
            }
        }
    }
}
</script>

<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";

</style>