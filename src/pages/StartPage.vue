<template>
	<div>
		
		<v-img
			src="@/assets/img/start.jpg"
			height="100vh"
			gradient="to bottom right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
		></v-img>
		
		<div class="px-4 main">
			<p
				class="font-weight-bold white--text text-h4 mb-6"
			>Добро пожаловать в DO SPORTS</p>
			<div class="d-flex flex-column">
				<v-btn
					class="mb-4"
					color="primary"
					large
					@click="$router.push({ name: 'registration' })"
				>Зарегистрироваться
				</v-btn>
				<v-btn
					color="primary"
					large
					@click="$router.push({ name: 'authorization'})"
				>Войти
				</v-btn>
				<!--<v-btn
					color="primary"
					large
					@click="$router.push({ name: 'main'})"
				>Гость
				</v-btn>-->
			</div>
		</div>


		
	</div>
</template>

<script>
export default {

}
</script>
	
<style>

.main {
	position: absolute;
	bottom: 60px;
}
</style>