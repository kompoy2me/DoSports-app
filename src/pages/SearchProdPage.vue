<template>
    <div>
        <product-list :meal="meal" :currDate="currDate"></product-list>
    </div>
</template>

<script>
import ProductList from '../components/ProductList.vue'
export default {
    props: {
        meal: {},
        currDate: {}
    },
    components: {ProductList}
}
</script>

<style>

</style>