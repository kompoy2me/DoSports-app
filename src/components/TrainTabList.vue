<template>
  <div>
    <div>
       <template>
            <v-card
                class="px-4 py-2 my-4" 
                style="background-color: #1A1A27"
            >
                <v-card-actions class="d-flex justify-space-between">
                    <div style="font-size: 13pt">{{trainList.name}}</div>
                    <v-btn
                        class="ma-0 pa-1"
                        icon
                        @click="show = !show"
                        style="background-color: transparent !important;"
                    >
                        <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                    </v-btn>
                </v-card-actions>
                <v-expand-transition>
                    <div>
                        <div v-show="show">
                            <div v-for="train in trainList.description"
                                :key="train">{{train}}
                            </div>
                            <v-btn class="my-4" 
                                @click="addTrainProgram(trainList.id)"
                                width="100%">Добавить</v-btn>
                        </div>
                    </div>
                </v-expand-transition>
            </v-card>
</template>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        trainList: {},
    },
    data: () => ({
        show: false,
    }),
    methods: {
        addTrainProgram(id) {
            console.log('iddd', id)
            this.$emit('add-train', id);
        }
    }
}
</script>

<style>

</style>