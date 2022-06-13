<template>
  <div>
    <v-card
        style="background-color: #1A1A27" class="px-4 pt-5 pb-6 ma-4">
        <div class="d-flex flex-row justify-space-between align-center">
            <div style="font-size: 13pt;">{{train.name}}</div>
            <div style="font-size: 10pt;">{{train.description.length}} упражнений</div>
        </div>
        <v-divider class="mb-5 mt-3" color="#fff"></v-divider>

            <div v-for="(ex, i) in train.description"
                :key="i">
                <v-list
                    class="ma-0 pa-0"
                    >
                    <v-list-item-group
                    style="background-color: #1A1A27"
                        multiple
                        active-class=""
                    >
                        <v-list-item >
                            <template 
                                v-slot:default="{ active }">
                                <div class="d-flex flex-row align-start">
                                    <v-list-item-action class="ma-0 pa-0 mr-2">
                                        <v-checkbox :input-value="active"></v-checkbox>
                                    </v-list-item-action>
                                    <div>{{ex}}</div>
                                </div>          
                            </template>
                        </v-list-item>
                    </v-list-item-group>
                    </v-list>               
            </div>
    </v-card>
    
    
  </div>
</template>

<script>
export default {
    props: {
        train: {},
    },
    data: () => ({
      selected: [],
    }),
    mounted() {
        this.selected = Array(this.train.description.length).fill(false);
    }
}
</script>

<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";
.main-train-tab {
    font-family: "Inter-Regular", sans-serif;
}
</style>