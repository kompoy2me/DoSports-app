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
		path: '/registration-vk/:token',
		name: 'registrationVK',
		component: () => import('@/pages/RegistrationPageVK')
	},
	{
		path: '/authorization',
		name: 'authorization',
		component: () => import('@/pages/AuthorizationPage')
	},
	{
		path: '/start-offline',
		name: 'start-offline',
		component: () => import('@/pages/StartProgramOffline')
	},
	{
		path: '/start-prog',
		name: 'start-prog',
		component: () => import('@/pages/StartProgramPage')
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
				path: '/user',
				name: 'user',
				component: () => import('@/pages/UserPage')
			},
			{
				path: '/edit-user',
				name: 'edit-user',
				component: () => import('@/pages/EditProfilePage')
			},
			{
				path: '/edit-meal',
				name: 'edit-meal',
				props: true,
				component: () => import('@/pages/EditMealPage')
			},
			{
				path: '/search-prod',
				name: 'search-prod',
				props: true,
				component: () => import('@/pages/SearchProdPage')
			},
			{
				path: '/personal-food',
				name: 'personal-food',
				component: () => import('@/pages/PersonalFoodPage')
			},
			{
				path: '/rations',
				name: 'rations',
				component: () => import('@/pages/PersonalRationPage')
			},
			{
				path: '/sub',
				name: 'sub',
				component: () => import('@/pages/SubscriptionPage')
			},
			{
				path: '/trains',
				name: 'trains',
				component: () => import('@/pages/TrainsPage')
			},
			

		]
	},
];


export default new VueRouter({
  routes
});

