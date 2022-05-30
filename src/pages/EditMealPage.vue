<template>
  <div>
      <edit-meal :meal="meal" :currDate="currDate"></edit-meal>
  </div>
</template>

<script>
import EditMeal from '../components/EditMeal.vue'
export default {
      props: {
        meal: {},
        currDate: {}
    },
    components: {EditMeal}
}
</script>

<style>

</style>