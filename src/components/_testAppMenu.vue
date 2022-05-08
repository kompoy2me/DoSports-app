<template>
	<v-card
      class=" overflow-hidden"
      height="100%"
    >
      <v-app-bar
        color="black"
        dark
      >
        <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
  
        <v-toolbar-title>Title</v-toolbar-title>
      </v-app-bar>
      <router-view/>
      <v-navigation-drawer
        v-model="drawer"
        absolute
        temporary
      >
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
          </v-list-item-avatar>
          <v-list-item-title>John Leider</v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>
        
        <v-list
          nav
          dense
        >
          <v-list-item-group
            v-model="group"
            active-class="black--text text--accent-1"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <router-link to="/">
                <v-list-item-title>Главная</v-list-item-title>
              </router-link>
            </v-list-item>
  
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <router-link to="/diary">
              <v-list-item-title>Дневник</v-list-item-title>
              </router-link>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
    </v-card>
</template>

<script>
export default {
  name: 'AppMenu',

  components: {

  },

  data: () => ({
    drawer: false,
    group: null,
  }),
};
</script>

<style>
	
</style>