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
    ...mapGetters(["getUser", "programData", "getMessage","activeProgramStatus"])
  },
  methods: {
    ...mapActions(["unauthorized", "checkAccess", "showProgram", "checkActiveProgram"]),

    async updateLocalUser() {
      await this.checkAccess().then( () => {
        console.log(JSON.stringify( this.getUser));
        if (this.getUser) {
          localStorage.setItem("user", JSON.stringify(this.getUser));
          this.updateUserProgram();
        }
      }) 
    },

    async updateUserProgram() {
      await this.checkActiveProgram(this.getUser.id).then( () =>{
        if (!this.activeProgramStatus) {
              this.$router.push({ name: 'start-prog'});
        } else {
              //скачать программу пользователя
              this.showProgram(this.getUser).then( () => {
                  localStorage.setItem("program", JSON.stringify(this.programData));
              })
          }
      })
    },
  },

  mounted() {
    if (localStorage.getItem("user-auth")) {
      if (navigator.connection.type != "none") {
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
