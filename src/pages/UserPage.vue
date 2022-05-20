<template>
    <div>
        <v-img class="banner"
			src="@/assets/img/png/banner.png"
			weight="10wh"
		></v-img>
        <div class="pa-4">
            
            <profile></profile>
        </div>
    </div>
	
</template>

<script>
import Profile from "../components/Profile.vue"
export default {
	components: { Profile }
}
</script>

<style>
</style>