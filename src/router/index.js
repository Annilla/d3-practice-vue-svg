import 'babel-polyfill'
import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import LineChart from '@/components/LineChart'
import BarPChart from '@/components/BarPChart'
import DonutChart from '@/components/DonutChart'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: `${ROOT_FOLDER}/`,
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: `${ROOT_FOLDER}/LineChart`,
      name: 'LineChart',
      component: LineChart
    },
    {
      path: `${ROOT_FOLDER}/BarPChart`,
      name: 'BarPChart',
      component: BarPChart
    },
    {
      path: `${ROOT_FOLDER}/DonutChart`,
      name: 'DonutChart',
      component: DonutChart
    }
  ]
})
