<template>
  <div style="height:100%; width:100%; background-color: #1A1A27">
    <v-img
        src="@/assets/img/png/app-logo-white.png"
        width="24vh"
        style="top:50%; left: 50%; transform: translate(-50%, -50%)"
    ></v-img>
  </div>
</template>

<script>
/*eslint-disable*/
import { mapActions, mapGetters} from 'vuex'
export default {
  name: 'App',
  computed: {
    ...mapGetters(["getUser", "activeProgramStatus"]),
  },
  watch: {
    getUser: function () {
      this.updateUserProg()
    }
  },
  methods: {
    ...mapActions(["checkAccess", "showProgram", "checkActiveProgram"]),

    updateLocalUser() {
      if (localStorage.getItem("user-auth")) {
        if (navigator.connection.type != "none") {
          this.checkAccess();
        }
      } else {
          this.$router.push({name: "start"});
      }
    },

    updateUserProg() {
      this.checkActiveProgram(this.getUser.id).then( () =>{
        if (!this.activeProgramStatus) {
              this.$router.push({ name: 'start-prog'});
        } else {
            //скачать программу пользователя
            this.showProgram(this.getUser).then( () =>{
              this.$router.push({ name: 'main'});
            })
          }
      })
    },
  },

  mounted() {
    this.updateLocalUser()
  }
}
</script>

<style scoped>
</style>
