<template>
  <v-app>
    <v-main :style="{background: $vuetify.theme.themes['dark'].background}">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapGetters} from 'vuex'
export default {
  name: 'App',
    methods: {
        ...mapActions(["unauthorized", "checkAccess"])
    },
    computed: {
        ...mapGetters(["getUser"])
    },
  created() {
  //this.unauthorized();
    if (localStorage.getItem("user-auth")) {
      this.checkAccess().then(() => {
        if (this.getUser) {
          localStorage.setItem("user", JSON.stringify(this.getUser));
          this.$router.push({name: "user"});
        }
      })    
    } else {
      this.$router.push({name: "start"})
    }
  }
};
</script>
