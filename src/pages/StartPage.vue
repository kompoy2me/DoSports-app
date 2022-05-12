<template>
	<div>
		
		<v-img
			src="@/assets/img/png/start-img.png"
			height="100vh"
			gradient="to bottom, rgba(0, 75, 215, .1), rgba(0, 13, 130, 0.3)"
		></v-img>
		
		<div class="px-4 main">
			<!--<v-img
				src="@/assets/img/svg/logo.svg"
				width=15% 
				height=auto
				
			></v-img>-->

			<p
				class=" white--text"
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
	
<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";

.main {
	position: absolute;
	bottom: 60px;
}
p {
	font-size: 24pt;
	font-family: "Oswald-Bold", sans-serif !important;
}
.v-btn{
	margin-top: 10px !important;
}
</style>