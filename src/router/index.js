import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
	{
		path: '/start',
		name: 'start',
		component: () => import('@/pages/StartPage')
	},
	{
		path: '/registration',
		name: 'registration',
		component: () => import('@/pages/RegistrationPage')
	},
	{
		path: '/authorization',
		name: 'authorization',
		component: () => import('@/pages/AuthorizationPage')
	},
	{
		path: '/app',
		name: 'menuLayout',
		component: () => import('@/pages/MenuLayout'),
		children: [
			{
				path: '',
				name: 'main',
				component: () => import('@/pages/MainPage')
			},
			{
				path: '/diary',
				name: 'diary',
				component: () => import('@/pages/DiaryPage')
			},
			{
				path: '/atlas',
				name: 'atlas',
				component: () => import('@/pages/BodyAtlas')
			},
			{
				path: '/sport',
				name: 'sport',
				component: () => import('@/pages/SportProgramPage')
			},
			{
				path: '/start-prog',
				name: 'start-prog',
				component: () => import('@/pages/StartProgramPage')
			},
			{
				path: '/user',
				name: 'user',
				component: () => import('@/pages/UserPage')
			}
		]
	},
];


export default new VueRouter({
  routes
});

