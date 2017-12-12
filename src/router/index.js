import 'babel-polyfill'
import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import LineChart from '@/components/LineChart'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/LineChart',
      name: 'LineChart',
      component: LineChart
    }
  ]
})
