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
  computed: {
    ...mapGetters(["getUser", "getConnState", "programData", "getMessage","activeProgramStatus"])
  },
  methods: {
    ...mapActions(["unauthorized", "checkAccess", "showProgram", "checkActiveProgram"]),

    updateLocalUser() {
      this.checkAccess().then(() => {
        if (this.getUser) {
          localStorage.setItem("user", JSON.stringify(this.getUser));
          this.updateUserProgram();
        } else {
          alert(this.getMessage);
          this.$router.push({name: "start"})
        }
      }) 
    },

    updateUserProgram() {
      this.checkActiveProgram(this.getUser.id).then(() =>{
        if (!this.activeProgramStatus) {
              this.$router.push({ name: 'start-prog'});
        } else {
              //скачать программу пользователя
              this.showProgram(this.getUser).then(() => {
                  localStorage.setItem("program", JSON.stringify(this.programData));
              })
          }
      })
    },
  },

  created() {
    if (localStorage.getItem("user-auth")) {
      if (this.getConnState != "none") {
        this.updateLocalUser();
      }
      if (!localStorage.getItem("program")) {
        this.$router.push({name: "start-prog"}); 
      }
      else {
        this.$router.push({name: "main"}); 
      }
      
    } else {
      this.$router.push({name: "start"})
    }
  }
};
</script>
<style scoped>

</style>
