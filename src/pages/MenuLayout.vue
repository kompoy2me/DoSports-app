<template>
    <v-card
      :style="{background: $vuetify.theme.themes['dark'].background}"
      class="main-layout overflow-hidden"
      height="100%"
    >
    <div style="height:100vh; overflow: auto; ">
      <v-app-bar
        style="height:8%; z-index: 50;"
        color="#1A1A27"
        dark
      >
        <v-app-bar-nav-icon 
        @click="drawer = true"
        style="background-color: transparent !important"
        ></v-app-bar-nav-icon>
        <v-toolbar-title></v-toolbar-title>
      </v-app-bar>
      <div style="height:92%; overflow:auto;"><router-view ></router-view></div>
      
    </div>

      <v-navigation-drawer
        style="z-index: 100;"
        
        v-model="drawer"
        color="#1A1A27"
        overlay-color="#000"
        absolute
        temporary
      >
        <v-list-item-group>
        <v-list-item
          class="user-avatar pa-6 pt-10"
          @click="$router.push({ name: 'user'}).catch(err => {})" >
          <div class="flex-column ">
            <v-avatar 
              size="70"
              color="#1A1A27"
              class="my-2">
            </v-avatar>
            <div >{{user.fullname}}</div>
          </div>
        </v-list-item>
        </v-list-item-group>
        <v-list
          nav
          dense
        >
          <v-list-item-group
            v-model="group"
            class="px-2"
            
          >
          <v-list-item v-if="user.pro_last_datetime === null"
              class="my-3 premium-item"
              @click="$router.push({ name: 'sub'}).catch(err => {})"
            >
                    <v-icon class="mr-6">mdi-card-account-details-star-outline</v-icon>
                <v-list-item-title>Premium подписка</v-list-item-title>
            </v-list-item>
            <v-list-item v-else
              class="my-3"
              @click="$router.push({ name: 'sub'}).catch(err => {})"
            >
                    <v-icon class="mr-6">mdi-card-account-details-star-outline</v-icon>
                <v-list-item-title>Подписка</v-list-item-title>
            </v-list-item>
            <v-list-item
              class="my-3"
              @click="$router.push({ name: 'main'}).catch(err => {})"
            >
                    <v-icon class="mr-6">mdi-home-variant-outline</v-icon>
                <v-list-item-title>Главная</v-list-item-title>
            </v-list-item>
            <v-list-item
              class="my-3"
              @click="$router.push({ name: 'sport'}).catch(err => {})"
            >
                  <v-icon class="mr-6">mdi-chart-line</v-icon>
                <v-list-item-title>Основная информация</v-list-item-title>
            </v-list-item>
            <v-list-item
              class="my-3"
              @click="$router.push({ name: 'diary'}).catch(err => {})"
            >
                    <v-icon class="mr-6">mdi-silverware</v-icon>
                <v-list-item-title>Приемы пищи</v-list-item-title>
            </v-list-item>
            <v-list-item
              class="my-3"
              @click="$router.push({ name: 'trains'}).catch(err => {})"
            >
                    <v-icon class="mr-6">mdi-yoga</v-icon>
                <v-list-item-title>Тренировки</v-list-item-title>
            </v-list-item>

            <!--Premium доступ-->
            <v-list-item v-if="user.pro_last_datetime != null"
              class="my-3"
              @click="$router.push({ name: 'personal-food'}).catch(err => {})"
            >
                    <v-icon class="mr-6">mdi-food-apple-outline</v-icon>
                <v-list-item-title>Мои продукты</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="user.pro_last_datetime != null"
              class="my-3"
              @click="$router.push({ name: 'rations'}).catch(err => {})"
            >
                    <v-icon class="mr-6">mdi-bowl-mix-outline</v-icon>
                <v-list-item-title>Мои рационы</v-list-item-title>
            </v-list-item>

            <!--Без подписки-->
            <v-list-item v-if="user.pro_last_datetime === null"
              class="my-3"
              style="color: #51516C"
            >
                    <v-icon class="mr-6" color="#51516C">mdi-food-apple-outline</v-icon>
                <v-list-item-title>Мои продукты</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="user.pro_last_datetime === null"
              class="my-3"
              style="color: #51516C"
            >
                    <v-icon class="mr-6" color="#51516C">mdi-bowl-mix-outline</v-icon>
                <v-list-item-title>Мои рационы</v-list-item-title>
            </v-list-item>


            <!--<v-list-item
              class="my-3"
              @click="$router.push({ name: 'atlas'}).catch(err => {})"
            >
                    <v-icon class="mr-6">mdi-home</v-icon>
                <v-list-item-title>Атлас тела</v-list-item-title>
            </v-list-item>-->
            
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
    </v-card>
</template>

<script>

import { mapGetters } from 'vuex';
export default {
    data: () => ({
        drawer: false,
        group: null,
        user: null,
  }),
  watch: {
    getUser: function () {
      this.user = JSON.parse(localStorage.getItem("user"))
    },
  },
  computed: {
    ...mapGetters(["getUser"]),
  },
  created() {
    this.user = JSON.parse(localStorage.getItem("user"))
  }
}
</script>
	
<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";

.main-layout {
  
    font-family: "Inter-Regular", sans-serif;
}
.user-avatar {
  background-color: #090914;

}

.v-list-item-group .v-list-item--active{
  background-color: #1A1A27;
  color: #9196FF !important;
}
.premium-item {
  border: solid #9196FF;
}
</style>