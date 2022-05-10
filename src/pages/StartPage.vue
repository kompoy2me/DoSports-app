<template>
	<div>
		
		<v-img
			src="@/assets/img/png/start.jpg"
			height="100vh"
			gradient="to bottom right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
		></v-img>
		
		<div class="px-4 main">
			<v-img
				src="@/assets/img/svg/logo.svg"
				width=15% 
				height=auto
			></v-img>

			<p
				class=" white--text mb-6"
			>ТВОЙ ПУТЬ К ЗДОРОВОМУ ТЕЛУ ВМЕСТЕ С DO SPORTS</p>
			<div class="d-flex flex-column">
				<v-btn
					
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
p {
	font-size: 28pt;
	font-family: "Oswald-Bold", sans-serif !important;
}
</style>