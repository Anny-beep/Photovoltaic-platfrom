import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 状态定义
  const isCollapsed = ref(false)
  const isDarkMode = ref(true)
  const isLoading = ref(false)
  const activeMenu = ref('home')
  const breadcrumbs = ref([
    { path: '/home', name: '首页', icon: 'HomeFilled' }
  ])

  // 用户信息
  const userInfo = ref({
    id: '1',
    name: '管理员',
    role: 'admin',
    avatar: '',
    email: 'admin@lzufe.edu.cn',
    department: '信息管理与人工智能学院'
  })

  // 模拟建筑数据
  const buildings = ref([
    {
      id: '1',
      name: '体育馆',
      type: '体育馆',
      location: { lat: 36.106, lng: 103.732, address: '兰州财经大学校区北侧' },
      roofArea: 8500,
      usableArea: 6800,
      orientation: 180,
      tilt: 15,
      structure: '钢结构',
      suitability: { score: 92, level: '非常适宜', factors: { area: 95, orientation: 90, obstruction: 88, structure: 95 } },
      potential: { installCapacity: 680, annualGeneration: 952, carbonReduction: 3347, investment: 408, paybackPeriod: 5.2 }
    },
    {
      id: '2',
      name: '图书馆',
      type: '图书馆',
      location: { lat: 36.105, lng: 103.731, address: '兰州财经大学校区中心' },
      roofArea: 6200,
      usableArea: 4960,
      orientation: 90,
      tilt: 10,
      structure: '框架结构',
      suitability: { score: 87, level: '较适宜', factors: { area: 88, orientation: 85, obstruction: 92, structure: 82 } },
      potential: { installCapacity: 496, annualGeneration: 694.4, carbonReduction: 2439, investment: 297.6, paybackPeriod: 5.5 }
    },
    {
      id: '3',
      name: '教学楼A区',
      type: '教学楼',
      location: { lat: 36.104, lng: 103.730, address: '兰州财经大学校区东侧' },
      roofArea: 4800,
      usableArea: 3840,
      orientation: 135,
      tilt: 12,
      structure: '框架结构',
      suitability: { score: 82, level: '较适宜', factors: { area: 82, orientation: 80, obstruction: 85, structure: 80 } },
      potential: { installCapacity: 384, annualGeneration: 537.6, carbonReduction: 1888.6, investment: 230.4, paybackPeriod: 5.8 }
    },
    {
      id: '4',
      name: '学生活动中心',
      type: '活动中心',
      location: { lat: 36.103, lng: 103.729, address: '兰州财经大学校区西侧' },
      roofArea: 3500,
      usableArea: 2800,
      orientation: 270,
      tilt: 8,
      structure: '框架结构',
      suitability: { score: 78, level: '一般', factors: { area: 75, orientation: 78, obstruction: 82, structure: 78 } },
      potential: { installCapacity: 280, annualGeneration: 392, carbonReduction: 1376.9, investment: 168, paybackPeriod: 6.0 }
    },
    {
      id: '5',
      name: '实验楼群',
      type: '实验楼',
      location: { lat: 36.102, lng: 103.728, address: '兰州财经大学校区南侧' },
      roofArea: 4200,
      usableArea: 3360,
      orientation: 45,
      tilt: 18,
      structure: '框架结构',
      suitability: { score: 85, level: '较适宜', factors: { area: 85, orientation: 82, obstruction: 88, structure: 85 } },
      potential: { installCapacity: 336, annualGeneration: 470.4, carbonReduction: 1652.2, investment: 201.6, paybackPeriod: 5.6 }
    }
  ])

  // 系统统计数据
  const statistics = ref({
    totalBuildings: 1258,
    totalArea: 67.28,
    usableArea: 42.61,
    installCapacity: 32.75,
    annualGeneration: 3186.76,
    carbonReduction: 11204.35,
    investment: 19850.65,
    annualRevenue: 3186.76,
    paybackPeriod: 6.35
  })

  // 计算属性
  const isAdmin = computed(() => userInfo.value.role === 'admin')
  const isOperator = computed(() => ['admin', 'operator'].includes(userInfo.value.role))

  // 方法
  const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
  }

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
  }

  const setActiveMenu = (menu) => {
    activeMenu.value = menu
    updateBreadcrumbs(menu)
  }

  const updateBreadcrumbs = (menu) => {
    const menuMap = {
      home: { path: '/home', name: '首页', icon: 'HomeFilled' },
      suitability: { path: '/suitability', name: '适宜性评估', icon: 'DataAnalysis' },
      benefit: { path: '/benefit', name: '效益评估', icon: 'Money' },
      emission: { path: '/emission', name: '碳减排评估', icon: 'Guide' },
      decision: { path: '/decision', name: '决策支持', icon: 'Aim' },
      visual: { path: '/visual', name: '可视化分析', icon: 'DataLine' },
      operation: { path: '/operation', name: '运维管理', icon: 'Tools' },
      system: { path: '/system', name: '系统管理', icon: 'Setting' }
    }
    breadcrumbs.value = [{ path: '/home', name: '首页', icon: 'HomeFilled' }]
    if (menu !== 'home' && menuMap[menu]) {
      breadcrumbs.value.push(menuMap[menu])
    }
  }

  const setLoading = (loading) => {
    isLoading.value = loading
  }

  const getBuildingById = (id) => {
    return buildings.value.find(b => b.id === id)
  }

  const getBuildingsBySuitability = (level) => {
    return buildings.value.filter(b => b.suitability.level === level)
  }

  const getTopBuildings = (metric, limit = 5) => {
    return [...buildings.value]
      .sort((a, b) => b.potential[metric] - a.potential[metric])
      .slice(0, limit)
  }

  return {
    // 状态
    isCollapsed,
    isDarkMode,
    isLoading,
    activeMenu,
    breadcrumbs,
    userInfo,
    buildings,
    statistics,
    // 计算属性
    isAdmin,
    isOperator,
    // 方法
    toggleCollapse,
    toggleDarkMode,
    setActiveMenu,
    setLoading,
    getBuildingById,
    getBuildingsBySuitability,
    getTopBuildings
  }
})
