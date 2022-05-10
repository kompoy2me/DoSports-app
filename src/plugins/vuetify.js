import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: true,
        themes: {
            dark: {
                primary: '#004bd7',
                background: '#090914',

                secondary: '#424242',
                accent: '#82B1FF',
                error: '#FF5B5B',
                info: '#2196F3',
                success: '#4CAF50',
                warning: '#FFC107',
              } 
        }
    }
});