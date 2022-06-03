<template>
    <div>
        <v-card 
            style="background-color:#1A1A27"
            class="alert-main px-4 py-6"
            width="96vw">
            <div class="mb-4" style="font-size: 18pt">{{msg.title}}</div>
            <div class="mb-4">{{msg.text}}</div>
            <v-btn
                @click="clicked"
                width="100%">Понятно</v-btn>
        </v-card>
    </div>
</template>

<script>
export default {
    props: ['msg'],
    methods: {
        clicked() {
            this.$emit('clicked');
        }
    }
}
</script>

<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";

.alert-main {
    font-family: "Inter-Regular", sans-serif;
}

</style>