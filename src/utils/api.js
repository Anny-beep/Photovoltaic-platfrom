import axios from 'axios'
import { ElMessage } from 'element-plus'

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

const instance = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    const { data, status, message } = response.data
    if (status === 200 || status === 0) {
      return data
    } else {
      ElMessage.error(message || '请求失败')
      return Promise.reject(new Error(message))
    }
  },
  error => {
    if (error.response) {
      const { status, data } = error.response
      switch (status) {
        case 401:
          ElMessage.error('登录已过期，请重新登录')
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          ElMessage.error('没有权限访问该资源')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器错误，请稍后重试')
          break
        default:
          ElMessage.error(data.message || '请求失败')
      }
    } else if (error.request) {
      ElMessage.error('网络连接失败，请检查网络')
    } else {
      ElMessage.error('请求配置错误')
    }
    return Promise.reject(error)
  }
)

// API 方法
export const api = {
  // 建筑接口
  buildings: {
    getList: (params) => instance.get('/buildings', { params }),
    getById: (id) => instance.get(`/buildings/${id}`),
    create: (data) => instance.post('/buildings', data),
    update: (id, data) => instance.put(`/buildings/${id}`, data),
    delete: (id) => instance.delete(`/buildings/${id}`),
    evaluate: (ids) => instance.post('/buildings/evaluate', { ids })
  },

  // 评估接口
  evaluations: {
    suitability: (data) => instance.post('/evaluations/suitability', data),
    benefit: (data) => instance.post('/evaluations/benefit', data),
    emission: (data) => instance.post('/evaluations/emission', data),
    getHistory: (params) => instance.get('/evaluations', { params })
  },

  // 统计接口
  stats: {
    overview: () => instance.get('/stats/overview'),
    trends: (params) => instance.get('/stats/trends', { params }),
    buildingsByType: () => instance.get('/stats/buildings/by-type'),
    emissionsTop: (limit) => instance.get('/stats/emissions/top', { params: { limit } })
  },

  // 报告接口
  reports: {
    generate: (data) => instance.post('/reports/generate', data),
    download: (id) => instance.get(`/reports/${id}/download`, { responseType: 'blob' }),
    list: (params) => instance.get('/reports', { params })
  },

  // 系统接口
  system: {
    getUsers: (params) => instance.get('/system/users', { params }),
    createUser: (data) => instance.post('/system/users', data),
    updateUser: (id, data) => instance.put(`/system/users/${id}`, data),
    deleteUser: (id) => instance.delete(`/system/users/${id}`),
    getLogs: (params) => instance.get('/system/logs', { params }),
    getConfig: () => instance.get('/system/config'),
    updateConfig: (data) => instance.put('/system/config', data)
  },

  // 登录接口
  auth: {
    login: (data) => instance.post('/auth/login', data),
    logout: () => instance.post('/auth/logout'),
    getUserInfo: () => instance.get('/auth/userinfo')
  }
}

// Mock API（用于开发阶段）
export const mockApi = {
  buildings: {
    getList: () => Promise.resolve({
      data: [
        {
          id: '1',
          name: '体育馆',
          type: '体育馆',
          roofArea: 8500,
          usableArea: 6800,
          suitability: { score: 92, level: '非常适宜' },
          potential: { installCapacity: 680, annualGeneration: 952, carbonReduction: 3347 }
        }
      ]
    }),
    getById: (id) => Promise.resolve({ data: { id, name: '体育馆' } }),
    create: (data) => Promise.resolve({ data }),
    update: (id, data) => Promise.resolve({ data: { id, ...data } }),
    delete: (id) => Promise.resolve({ message: '删除成功' }),
    evaluate: (ids) => Promise.resolve({ message: '评估完成' })
  },
  evaluations: {
    suitability: (data) => Promise.resolve({ data: { score: 85, level: '较适宜' } }),
    benefit: (data) => Promise.resolve({ data: { annualGeneration: 1000, paybackPeriod: 6.5 } }),
    emission: (data) => Promise.resolve({ data: { carbonReduction: 3500 } })
  },
  stats: {
    overview: () => Promise.resolve({
      data: {
        totalBuildings: 1258,
        totalArea: 67.28,
        usableArea: 42.61,
        installCapacity: 32.75,
        annualGeneration: 3186.76,
        carbonReduction: 11204.35
      }
    }),
    trends: () => Promise.resolve({ data: [180, 220, 280, 320, 380, 420, 450, 430, 380, 300, 240, 180] }),
    buildingsByType: () => Promise.resolve({ data: [
      { name: '体育馆', value: 22.6 },
      { name: '图书馆', value: 18.7 },
      { name: '教学楼', value: 24.5 },
      { name: '学生公寓', value: 14.9 },
      { name: '实验楼', value: 12.4 },
      { name: '其他', value: 6.9 }
    ]}),
    emissionsTop: (limit) => Promise.resolve({ data: [
      { name: '体育馆', value: 3347 },
      { name: '图书馆', value: 2439 },
      { name: '教学楼A区', value: 1889 },
      { name: '学生活动中心', value: 1377 },
      { name: '实验楼群', value: 1652 }
    ]})
  }
}

export default instance
