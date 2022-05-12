<template>
	<div>
        <v-img class="banner"
			src="@/assets/img/png/banner.png"
			weight="10wh"
		></v-img>
        <div class="userAvatar">
            <v-avatar
                color="primary"
                size="128">
            </v-avatar>
            <div>{{ user.fullname }}</div>
            <div>{{ user.email }}</div>
        </div>
        <div class="personData">
            <div>Дата рождения: {{ user.birthday }}</div>
            <div>Регион проживания: {{ this.getRegions[user.id_region].name }}</div>
        </div>
        
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
import { mapActions, mapGetters} from 'vuex'
export default {
    data: () => ({
        user: JSON.parse(localStorage.getItem("user"))
    }),
    methods: {
        ...mapActions(["getRegionList","unauthorized"]),
        logOut() {
            this.unauthorized().then(() => {
                this.$router.push({name: "start"})
            })
        }
    },
    computed: {
        ...mapGetters(["getRegions"])
    },
    mounted() {
        this.getRegionList();
    },
    created() {
        this.user = JSON.parse(localStorage.getItem("user"))
    }
}
</script>

<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";

.userAvatar {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.banner {
    margin-bottom: 20px;
}
.personData {
    border-top: solid white;
}
</style>