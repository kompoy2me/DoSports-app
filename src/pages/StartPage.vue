<template>
	<div>
		<div v-if="load" class="load">
            <v-progress-circular 
                :width="4"
                :size="40"
                indeterminate
                color="#004BD7"
            ></v-progress-circular>
        </div>

		<div v-if="!load">
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
							:loading="logProgress"
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
		
		<v-dialog
			v-model="dialog"
        >
            <alert-message :msg='msg' @clicked="dialog = false"></alert-message>
        </v-dialog>
		
	</div>
</template>

<script>
import AlertMessage from "@/components/AlertMessage.vue";
import {mapActions, mapGetters} from "vuex";
export default {
	components: {AlertMessage},
	data: () => ({
		ref: {},
		token: "",
		load: false,
		dialog: false,
        msg: {title: '', text: ''},
		logProgress: false,
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
					this.checkUserVkInDb(this.getUserVkData.id).then(() => {
						if (this.getMatchVK === null) {
							this.logProgress = false;
                            this.msg = {title: 'Ошибка входа', text: 'Повторите попытку позднее'},
                            this.dialog = true;
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
                    this.checkUserProgram();
                }
                else {
					this.logProgress = false;
					this.msg = {title: 'Ошибка входа', text: this.getMessage},
					this.dialog = true;
					//alert(this.getMessage);
                }
            })
        },

        checkUserProgram() {
            this.checkActiveProgram(this.getUser.id).then(() =>{
                if (!this.activeProgramStatus) {
                    this.$router.push({ name: 'start-prog'})
                }
                else {
                    //скачать программу пользователя
                    this.showProgram(this.getUser).then(() => {
                        this.load = true;
                        this.initSchedule().then(() => {
                            this.$router.push({name: "main"});
                        })
                    });
                }
            })
        },

        /*eslint-disable*/
        openBrowser() {
			this.ref = cordova.InAppBrowser.open('https://dosports.ru/api/vk-auth', '_blank', 'location=no');
            this.ref.addEventListener('loadstart', (event)=>{
                this.loadstartCallback(event)
            });
			this.ref.addEventListener('loaderror', (error)=>{
                this.loaderrorCallback(error)
            });
			this.ref.addEventListener('loadstop', loadstopCallback);
			function loadstopCallback(event) {
				console.log('Loading finished: ' + event.url)
			}
		},

		loaderrorCallback(error) {
			console.log('Loading error: ' + error.message);
			this.ref.close();
		},

		loadstartCallback(event) {
            console.log('Loading started: '  + event.url);
            if (event.url.includes('registration-vk')) {
				this.logProgress = true;
				this.ref.hide();
                let urlSplitted = event.url.split('/');
                this.token = urlSplitted[urlSplitted.length-1];
                this.ref.close();
				this.authUser();
            }
			if (event.url.includes('description=User+denied+your+request')) {
				this.ref.close();
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
.load {
    text-align: center;
    margin-top: 40vh !important;
}
</style>