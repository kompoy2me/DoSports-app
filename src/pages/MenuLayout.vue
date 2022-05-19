<template>
    <v-card
      :style="{background: $vuetify.theme.themes['dark'].background}"
      class=" overflow-hidden"
      height="100%"
    >
      <v-app-bar
        color="#1A1A27"
        dark
      >
        <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
        <v-toolbar-title>Title</v-toolbar-title>
      </v-app-bar>

      <router-view/>

      <v-navigation-drawer
        v-model="drawer"
        color="#1A1A27"
        absolute
        temporary
      >
        <v-list-item @click="$router.push({ name: 'user'}).catch(err => {})" class="pt-10 px-2">
          <v-list-item-avatar >
            <v-img 
              src="@/assets/img/svg/user-violet.svg"
              
            ></v-img>
          </v-list-item-avatar>
          <v-list-item-title>{{user.fullname}}</v-list-item-title>
        </v-list-item>

        
          
        <v-list
          nav
          dense
        >
          <v-list-item-group
            v-model="group"
            
          >
            <v-list-item
                @click="$router.push({ name: 'main'}).catch(err => {})"
            >
                <v-list-item-icon>
                    <v-icon>mdi-home</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Главная</v-list-item-title>
            </v-list-item>
            <v-list-item
                @click="$router.push({ name: 'sport'}).catch(err => {})"
            >
                <v-list-item-icon>
                    <v-icon>mdi-home</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Основная информация</v-list-item-title>
            </v-list-item>
            <v-list-item
                @click="$router.push({ name: 'diary'}).catch(err => {})"
            >
                <v-list-item-icon>
                    <v-icon>mdi-home</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Дневник</v-list-item-title>
            </v-list-item>
            <v-list-item
                @click="$router.push({ name: 'atlas'}).catch(err => {})"
            >
                <v-list-item-icon>
                    <v-icon>mdi-home</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Атлас тела</v-list-item-title>
            </v-list-item>
            
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
    </v-card>
</template>

<script>
export default {
    data: () => ({
        drawer: false,
        group: null,
        user: null,
  }),
  created() {
    this.user = JSON.parse(localStorage.getItem("user"))
  }
}
</script>
	
<style>

</style>