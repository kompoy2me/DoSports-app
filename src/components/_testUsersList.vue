
<template>
	
	<div>
		<div>All Users</div>
		<button @click="getUser">GET</button>
		<div v-for="user in users" :key="user">
			<div>{{ user }}</div>
		</div>

	</div>
	
</template>

<script>
export default {
	data: () => ({
		users: []
	}),
	mounted() {
		this.getUser()
	},
	methods: {
		async getUser() {
			try {
				const response = await this.axios.get('https://dosports.ru/api/users/get-logins');
				
				this.users = response.data;
				console.log(this.users);
			} catch (error) {
				console.error(error);
			}
		}
	}
}
</script>
	
<style>
	
</style>