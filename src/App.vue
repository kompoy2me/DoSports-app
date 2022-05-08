<template>
  <v-app>
    <v-main :style="{background: $vuetify.theme.themes['dark'].background}">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
/* eslint-disable */
export default {
  name: 'App',
  created() {
    function checkConnection() {
      var networkState = navigator.connection.type;
      
      var states = {};
      states[Connection.UNKNOWN]  = 'Unknown connection';
      states[Connection.ETHERNET] = 'Ethernet connection';
      states[Connection.WIFI]     = 'WiFi connection';
      states[Connection.CELL_2G]  = 'Cell 2G connection';
      states[Connection.CELL_3G]  = 'Cell 3G connection';
      states[Connection.CELL_4G]  = 'Cell 4G connection';
      states[Connection.CELL]     = 'Cell generic connection';
      states[Connection.NONE]     = 'No network connection';

      alert('Connection type: ' + states[networkState]);
    }

    checkConnection();
    if (localStorage.getItem("user-auth")) {
      this.$router.push({name: "main"})
    } else {
      this.$router.push({name: "start"})
    }
  }
};
</script>
