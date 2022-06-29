<template>
  <v-app>
    <v-main :style="{background: $vuetify.theme.themes['dark'].background}">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  mounted() {
    this.$router.push({ name: 'load'});
  }
};
</script>

<style scoped>
</style>
