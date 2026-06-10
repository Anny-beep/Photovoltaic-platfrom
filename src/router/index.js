import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: '首页', icon: 'HomeFilled' }
  },
  {
    path: '/suitability',
    name: 'Suitability',
    component: () => import('../views/SuitabilityView.vue'),
    meta: { title: '适宜性评估', icon: 'DataAnalysis' }
  },
  {
    path: '/benefit',
    name: 'Benefit',
    component: () => import('../views/BenefitView.vue'),
    meta: { title: '效益评估', icon: 'Money' }
  },
  {
    path: '/emission',
    name: 'Emission',
    component: () => import('../views/EmissionView.vue'),
    meta: { title: '碳减排评估', icon: 'Guide' }
  },
  {
    path: '/decision',
    name: 'Decision',
    component: () => import('../views/DecisionView.vue'),
    meta: { title: '决策支持', icon: 'Aim' }
  },
  {
    path: '/visual',
    name: 'Visual',
    component: () => import('../views/VisualView.vue'),
    meta: { title: '可视化分析', icon: 'DataLine' }
  },
  {
    path: '/operation',
    name: 'Operation',
    component: () => import('../views/OperationView.vue'),
    meta: { title: '运维管理', icon: 'Tools' }
  },
  {
    path: '/system',
    name: 'System',
    component: () => import('../views/SystemView.vue'),
    meta: { title: '系统管理', icon: 'Setting' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || '光伏平台'} - 兰州财经大学光伏潜力评估平台`
  next()
})

export default router
