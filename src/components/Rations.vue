<template>
  <div class="rations-main">

    <div v-if="statusRations === 'rations'">
        <div class="rations-head"></div>
        <div class="rations-body px-4">
            <div v-if="personRations.length === 0"
            class="px-4 py-6">
                <div>Здесь будет отображаться информация о ваших рационах. <p></p>Создать рацион можно при формировании приемов пищи.</div>
            </div>
            <div v-else>
                <!--<div style="text-align: center; font-size: 10pt; color:#B5B5B8" class="px-10 py-6">Вы можете отредактировать рацион, нажав на его название</div>-->
                <div class="my-3" v-for="ration in personRations"
                    :key="ration.id"
                >
                    <ration-tab
                        :ration="ration"
                        :edit="true"
                        @edit-ration="openRation"
                        @del-ration="deleteRation"
                    ></ration-tab>
                </div>
            </div>
        </div>
    </div>

    <div v-if="statusRations === 'load'"
        class="load">
        <v-progress-circular 
            :width="4"
            :size="40"
            indeterminate
            color="#004BD7"
        ></v-progress-circular>
    </div>

    <div v-if="statusRations === 'edit-ration'">
        
    </div>
      
  </div>
</template>

<script>
import axios from "axios";
import url from "@/services/url";
import { mapGetters, mapActions } from 'vuex';
import RationTab from './RationTab.vue'
export default {
    components: {RationTab},
    data: () => ({
        statusRations: 'load',
        personRations: [],
    }),
    computed: {
        ...mapGetters(["rations"]) 
    },
    methods: {
        ...mapActions(["showRations",]),

        updateRations() {
            this.personRations = JSON.parse( localStorage.getItem('rations'));
            this.statusRations = 'rations'
        },
        
        async deleteRation(ration) {
            if (navigator.connection.type != "none") {
                this.statusRations = 'load';
                let input_ration = {
                    id: ration.id
                };
                await axios.post(`${url}/api/programs/delete-ration`, input_ration).then(() => {
                    this.showPersonRations();
                })
            }
            
        },

        openRation(ration) {
            console.log('open', ration.id)
        },

        async showPersonRations() {
            if (navigator.connection.type != "none") {
                let id = JSON.parse(localStorage.getItem('user')).id;
                await this.showRations(id).then(async () => {
                    let emptyRations = this.rations.filter((obj) => !obj.foods.length);
                    if (emptyRations.length) {
                        for (let i = 0; i < emptyRations.length; i++) {
                            let ration = {
                                id: emptyRations[i].id,
                            }
                            await axios.post(`${url}/api/programs/delete-ration`, ration).then(async () => {
                                if (i === emptyRations.length - 1) {
                                    await this.showRations(id).then(() => {
                                        this.updateRations();
                                    })
                                }
                            });
                        }
                    } else this.updateRations();
                });
            }
        },
    },
    mounted() {
        this.showPersonRations();
    }
}
</script>

<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";

.rations-main {
    font-family: "Inter-Regular", sans-serif;
    overflow: auto;
    height: 92vh;
    position: relative;
}
.load {
    text-align: center;
    margin-top: 20vh;
}
</style>