<template>
	<div>
		
		<v-img
			src="@/assets/img/png/start-img.png"
			height="100vh"
			gradient="to bottom, rgba(0, 75, 215, .1), rgba(0, 13, 130, 0.3)"
		></v-img>
		<div class="logotype">
				<v-img
					style="display:inline-block"
					src="@/assets/img/svg/logo-white.svg"
					width=8% 
					height=auto
				></v-img>
				<v-img
					style="display:inline-block; margin-left: 4px;"
					src="@/assets/img/svg/DO_SPORTS-small.svg"
					width=26% 
					height=auto
				></v-img>
			</div>
		<div class="main">
			
			
			<p
			>ТВОЙ ПУТЬ К ЗДОРОВОМУ ТЕЛУ ВМЕСТЕ С DO SPORTS</p>
			<div>
				<v-btn
					width="100%"
					color="primary"
					large
					@click="$router.push({ name: 'registration' })"
				>Зарегистрироваться
				</v-btn>
				<div class="btn-holder">
					<v-btn
						color="primary"
						large
						@click="$router.push({ name: 'authorization'})"
					>Войти
					</v-btn>
					<v-btn
						color="#0077FF !important"
						large
						@click="openBrowser"
					>
					<v-img
						src="@/assets/img/png/vk-logo.png"
						height="14px"
						width="26px"
						class="mr-1"
					></v-img>
					Войти через VK
					</v-btn>
				</div>
				
			</div>
		</div>


		
	</div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
export default {
	data: () => ({
			ref: {},
			token: "",
	}),
	
	watch: {
		token () {
			console.log('CHANGED', this.token)
		}
	},
    methods: {
		...mapActions(["checkUserVk", "checkUserVkInDb","checkActiveProgram","authRequest", "checkAccess", "showProgram", "initSchedule"]),


		
		authUser() {
			this.checkUserVk(this.token).then(() => {
				if (this.getUserVkData) {
					console.log('USER VK ID ', this.getUserVkData.id);
					this.checkUserVkInDb(this.getUserVkData.id).then(() => {
						console.log('MATCH VK ', this.getMatchVK);
						if (this.getMatchVK === null) {
							alert('Ошибка авторизации')
						}
						else {
							if (this.getMatchVK) {
								this.checktUserData();
							}
							else {
								this.$router.push({ name: 'registrationVK' });
							}
						}
					})
				}
			})
		},

		checktUserData(){
            this.checkAccess().then(() => {
                if (this.getUser) {
                    localStorage.setItem("user", JSON.stringify(this.getUser));
                    this.checkUserProgram();
                }
                else {
                    alert(this.getMessage);
                }
            })
        },

        checkUserProgram() {
            this.checkActiveProgram(this.getUser.id).then(() =>{
                console.log(this.getUser.id, this.activeProgramStatus);
                if (!this.activeProgramStatus) {
                    this.$router.push({ name: 'start-prog'})
					
                }
                else {
                    //скачать программу пользователя
                    this.showProgram(this.getUser).then(() => {
                        localStorage.setItem("program", JSON.stringify(this.programData));
						this.createScedule();
                    });
                    this.$router.push({name: "main"});
                }
            })
        },

		createScedule() {
            this.initSchedule();
        },

        /*eslint-disable*/
        openBrowser() {
			this.ref = cordova.InAppBrowser.open('https://dosports.ru/api/vk-auth', '_blank', 'location=no');
            this.ref.addEventListener('loadstart', (event)=>{
                this.loadstartCallback(event)
            });
			this.ref.addEventListener('loaderror', (event)=>{
                this.loaderrorCallback(event)
            });
			this.ref.addEventListener('loadstop', loadstopCallback);
			function loadstopCallback(event) {
				console.log('Loading finished: ' + event.url)
			}
		},

		loaderrorCallback() {
			console.log('Loading error: ' + error.message);
			this.ref.close();
		},

		loadstartCallback(event) {
			console.log('REF ',JSON.stringify(this.ref));
            console.log('Loading started: '  + event.url);
            if (event.url.includes('registration-vk')) {
				this.ref.hide();
                let urlSplitted = event.url.split('/');
                this.token = urlSplitted[urlSplitted.length-1];
                this.ref.close();
				this.authUser();
            }
			if (event.url.includes('description=User+denied+your+request')) {
				this.ref.hide();
            }
        
		},
	},
	computed: {
        ...mapGetters(["getUserVkData", "getMatchVK","activeProgramStatus","getMessage", "getUser", "programData"]),
    },
		
}

</script>
	
<style  lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";

.main {
	position: absolute;
	bottom: 50px;
	padding: 16px;
}
p {
	font-size: 24pt;
	font-family: "Oswald-Bold", sans-serif;
}
.btn-holder {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-top: 16px;
}
.logotype {
	position: absolute;
	top: 0px;
	margin: 20px 16px;
}
</style>