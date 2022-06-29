<template>
    <div>
        <div v-if="statusSub === 'sub'" 
            class="sub-main px-4">
            <div class="sub-head"></div>
            <div class="sub-body" v-if="user">
                <div v-if="user.pro_last_datetime === null">
                    <div class="mt-6 sub-status">Статус подписки: стандарт</div>
                </div>

                <div v-else class="mt-6 sub-status">
                    Cтатус подписки: премиум (действителен до <b style="color:#9196FF">{{ proLastDatetime }}</b>)
                </div>

                <div class="my-6 pl-6 sub-text" >Ниже вы можете купить необходимое для вас количество дней Premium подписки на DO SPORTS. Оплата происходит разово, по истечении купленного количества дней необходимо повторно оплатить подписку.</div>

                <div class="pricelist pa-4">
                    <div v-for="(item, index) in pricelist" 
                        class="item"
                        :key="item.id">
                        <div class="d-flex justify-space-between align-center">
                            <div>
                                <div style="line-height:20px">
                                    DO SPORTS 
                                </div>
                                <div style="">({{ item.name }})
                            </div>
                            </div>
                            <div>
                                {{ item.cost }} руб.
                            </div>
                            <!--<form method="POST" action="https://yoomoney.ru/quickpay/confirm.xml">
                                <input type="hidden" name="receiver" value="4100117862329785"/>
                                <input type="hidden" name="formcomment"
                                        :value="`Оплата премиум-статуса на ${item.days} дней`"/>
                                <input type="hidden" name="short-dest"
                                        :value="`Оплата премиум-статуса на ${item.days} дней`"/>
                                <input type="hidden" name="label"
                                        :value="
                                            JSON.stringify(
                                            {
                                                    idUser: user.id,
                                                    days: item.days,
                                                    cost: item.cost,
                                                }
                                            )
                                        "/>
                                <input type="hidden" name="quickpay-form" value="shop"/>
                                <input type="hidden" name="targets" :value="`Оплата премиум-статуса на ${item.days} дней`"/>
                                <input type="hidden" name="sum" :value="item.cost" data-type="number"/>
                                <input type="hidden" name="paymentType" value="AC"/>
                                <input type="hidden" name="successURL"
                                        value="https://www.dosports.ru/profile/premium"/>
                                <input class="button submit" type="submit" value="Купить"/>
                            </form>-->
                            <div
                                @click="getPayLink(index, item.days, item.cost)"
                                style="background:#004BD7; border-radius: 5px; font-size: 16pt;"
                                class="px-3 py-1 my-4"
                            >+</div>
                        </div>
                    </div>
                </div>
                <v-dialog
                    v-model="dialog">
                    <alert-message :msg="msg" @clicked="dialog = false"></alert-message>
                </v-dialog>
            </div>
        </div>

        <div v-if="statusSub === 'load'"
            class="load">
            <v-progress-circular 
                :width="4"
                :size="40"
                indeterminate
                color="#004BD7"
            ></v-progress-circular>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import url from "@/services/url";
import AlertMessage from "./AlertMessage.vue";
import { mapActions, mapGetters } from 'vuex';
export default {
    components: {AlertMessage},
    data: () => ({
        statusSub: 'load',
        pricelist: [],
        user: {},
        ref: {},
        dialog: false,
        msg: {},
        selfClose: false,
    }),

    computed: {
        ...mapGetters(["getUser"]),

        proLastDatetime() {
            if (this.user) {
                if (this.user.pro_last_datetime != null) {
                    let date = new Date(this.user.pro_last_datetime);
                    let day = date.getDate();
                    let month = date.getMonth() + 1;
                    let year = date.getFullYear();
                    return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
                }
                return "";
            }
            return "";
        }
    },

    methods: {
        ...mapActions(["checkAccess"]),

        async getPricelist() {
            if (navigator.connection.type != "none") {
                await axios.get(`${url}/api/payment/get-pricelist`).then((res) => {
                    this.pricelist = Array.from(res.data);
                    this.updateSub();
                })
            }
            
        },

        async updateSub() {
            await this.checkAccess().then(()=> {
                this.user = JSON.parse(localStorage.getItem("user"));
                this.statusSub = 'sub';
            })
        },

        async getPayLink(id, days, cost) {
            if (navigator.connection.type != "none") {
                this.statusSub = 'load';
                this.$set(this.pricelist, id, {
                    id: this.pricelist[id].id,
                    name: this.pricelist[id].name,
                    cost: this.pricelist[id].cost,
                    days: this.pricelist[id].days,
                });
                let payData = {
                    days: days,
                    cost: cost,
                    user: this.user
                }
                await axios.post(`${url}/api/payment/get-pay-link`, payData).then((res) => {
                    if (res.data.name === "Success") {
                        this.openBrowser(res.data.link);
                    }
                })
            }
            
        },

        /*eslint-disable*/
        openBrowser(payLink) {
			this.ref = cordova.InAppBrowser.open(payLink, '_blank', 'location=no', 'hardwareback=no');
            this.ref.addEventListener('loadstart', (event)=>{
                this.loadstartCallback(event)
            });
            this.ref.addEventListener('exit', (event)=>{
                this.exitCallback(event)
            });
			this.ref.addEventListener('loadstop', loadstopCallback);
			this.ref.addEventListener('loaderror', loaderrorCallback);

			function loadstopCallback(event) {
				console.log('Loading finished: ' + event.url)
			}
			function loaderrorCallback(error) {
				this.ref.hide();
				console.log('Loading error: ' + error.message);
			}
            
		},

        exitCallback() {
            if (!this.selfClose) {
                this.statusSub = 'sub';
            }
            this.selfClose = false;
            
        },

        async loadstartCallback(event) {
            
            console.log('Loading started: '  + event.url);
            if (event.url === 'https://dosports.server.paykeeper.ru/success/') {
                this.selfClose = true;
                await this.ref.close();
                setTimeout(this.successPay, 2000);
            }
            else if (event.url.includes('fail')) {
                this.selfClose = true;
                this.ref.close();
                this.unsuccessPay();
            }
        },

        async successPay() {
            await this.checkAccess().then(()=> {
                this.user = JSON.parse(localStorage.getItem("user"));
                this.statusSub = 'sub';

                let date = this.proLastDatetime;
                this.msg = {title: 'Оплата прошла успешно!', text: `Подписка активна до ${date}`};
                this.dialog = true;
            })
        },

        unsuccessPay() {
            this.statusSub = 'sub';
            this.msg = {title: 'Не удалось совершить оплату', text: ``};
            this.dialog = true;
        },
    },
    
    mounted() {
        this.getPricelist();        
    }
}
</script>

<style lang="scss">
@import "../assets/main.css";
@import "../assets/forms.scss";

.sub-main {
    overflow: auto;
    height: 92vh;
    position: relative;
    font-family: "Inter-Regular", sans-serif;   
}
.sub-status {
    font-size: 13pt;
}
.sub-text {
    border-left: solid #9196FF;
}

.load {
    text-align: center;
    margin-top: 40vh;
}

.pricelist {
    background: #1A1A27;
    .item {
        border-bottom: 1px solid rgba(181, 181, 184, 0.5);
    }
    .item:last-child {
        border-bottom: none;
    }
}

</style>