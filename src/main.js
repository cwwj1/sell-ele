// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import GoodsPage from './components/goods/goods.vue'
import SellerPage from './components/seller/seller.vue'
import PatingsPage from './components/ratings/ratings.vue'
Vue.use(VueRouter)
Vue.use(VueResource)

let router = new VueRouter({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      component: GoodsPage
    },
    {
      path: '/goods',
      component: GoodsPage
    },
    {
      path: '/seller',
      component: SellerPage
    },
    {
      path: '/ratings',
      component: PatingsPage
    }
  ]
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
