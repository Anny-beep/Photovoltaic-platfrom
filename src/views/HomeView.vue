<template>
  <div class="home-view">
    <!-- 搜索和工具栏 -->
    <div class="toolbar">
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="搜索建筑名称或地址..."
          :prefix-icon="Search"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        />
      </div>
      <div class="tool-buttons">
        <el-button type="primary" :icon="Refresh" @click="handleRefresh">
          刷新数据
        </el-button>
        <el-button :icon="Download" @click="handleExport">
          导出报告
        </el-button>
        <el-button :icon="FullScreen" @click="handleFullScreen">
          全屏模式
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div v-for="stat in statCards" :key="stat.title" class="stat-card">
        <div class="stat-icon" :style="{ background: stat.bgColor }">
          <el-icon :size="24" :color="stat.color">
            <component :is="stat.icon" />
          </el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">
            <span class="value">{{ stat.value }}</span>
            <span class="unit">{{ stat.unit }}</span>
          </div>
          <div class="stat-title">{{ stat.title }}</div>
          <div class="stat-desc">{{ stat.desc }}</div>
        </div>
        <div class="stat-trend" :class="stat.trend > 0 ? 'up' : 'down'">
          <el-icon v-if="stat.trend > 0"><Top /></el-icon>
          <el-icon v-else><Bottom /></el-icon>
          <span>{{ Math.abs(stat.trend) }}%</span>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 左侧大区域 -->
      <div class="left-section">
        <!-- 地图区域 -->
        <div class="map-card">
          <div class="card-header">
            <span class="card-title">光伏潜力分布</span>
            <div class="card-tools">
              <el-radio-group v-model="mapType" size="small">
                <el-radio-button label="3d">三维场景</el-radio-button>
                <el-radio-button label="image">影像底图</el-radio-button>
                <el-radio-button label="heat">热力图</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="map-container">
            <img
              src="https://neeko-copilot.bytedance.net/api/text_to_image?prompt=aerial%20view%20of%20university%20campus%20buildings%20with%20solar%20panels%20on%20roofs%203d%20visualization%20blue%20sky&image_size=landscape_16_9"
              alt="地图"
              class="map-image"
            />
            <div class="map-markers">
              <div
                v-for="marker in mapMarkers"
                :key="marker.id"
                class="map-marker"
                :style="{ left: marker.x + '%', top: marker.y + '%' }"
                :class="{ active: marker.active }"
                @click="handleMarkerClick(marker)"
              >
                <span class="marker-dot"></span>
                <span class="marker-label">{{ marker.name }}</span>
              </div>
            </div>
            <div class="map-legend">
              <div class="legend-item">
                <span class="legend-color" style="background: #66bb6a;"></span>
                <span>非常适宜</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: #81c784;"></span>
                <span>较适宜</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: #aed581;"></span>
                <span>一般</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: #ffb74d;"></span>
                <span>较不适宜</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 评估流程 -->
        <div class="process-card">
          <div class="card-header">
            <span class="card-title">评估流程</span>
          </div>
          <div class="process-steps">
            <div
              v-for="(step, index) in processSteps"
              :key="step.title"
              class="process-step"
              :class="{ active: index <= currentStep }"
            >
              <div class="step-icon">
                <el-icon :size="24">
                  <component :is="step.icon" />
                </el-icon>
              </div>
              <div class="step-info">
                <span class="step-number">{{ index + 1 }}</span>
                <span class="step-title">{{ step.title }}</span>
                <span class="step-desc">{{ step.desc }}</span>
              </div>
              <div v-if="index < processSteps.length - 1" class="step-arrow">
                <el-icon><ArrowRight /></el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧图表区 -->
      <div class="right-section">
        <!-- 发电量趋势 -->
        <div class="chart-card">
          <div class="card-header">
            <span class="card-title">发电量趋势分析</span>
            <el-select v-model="trendPeriod" size="small" style="width: 100px;">
              <el-option label="近一年" value="year" />
              <el-option label="近三年" value="3year" />
              <el-option label="近五年" value="5year" />
            </el-select>
          </div>
          <div ref="energyChartRef" class="chart-container"></div>
        </div>

        <!-- 适宜性分布 -->
        <div class="chart-card">
          <div class="card-header">
            <span class="card-title">适宜性分级统计</span>
          </div>
          <div ref="suitabilityChartRef" class="chart-container"></div>
        </div>

        <!-- 碳减排排名 -->
        <div class="chart-card">
          <div class="card-header">
            <span class="card-title">碳减排贡献TOP5</span>
            <span class="card-unit">tCO₂/年</span>
          </div>
          <div ref="emissionChartRef" class="chart-container"></div>
        </div>
      </div>
    </div>

    <!-- 底部潜力概览 -->
    <div class="potential-section">
      <div class="section-header">
        <span class="section-title">光伏潜力概览</span>
        <el-button text type="primary" :icon="View">查看详情</el-button>
      </div>
      <div class="potential-grid">
        <div v-for="item in potentialItems" :key="item.title" class="potential-item">
          <div class="potential-icon">
            <el-icon :size="28">
              <component :is="item.icon" />
            </el-icon>
          </div>
          <div class="potential-content">
            <div class="potential-value">
              <span class="value">{{ item.value }}</span>
              <span class="unit">{{ item.unit }}</span>
            </div>
            <div class="potential-title">{{ item.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import * as echarts from 'echarts'
import {
  Search, Refresh, Download, FullScreen, Top, Bottom,
  ArrowRight, View, HomeFilled, OfficeBuilding, Sunny,
  Lightning, Cherry, Money, Clock, Location, TrendCharts
} from '@element-plus/icons-vue'

const router = useRouter()
const appStore = useAppStore()

// 响应式数据
const searchQuery = ref('')
const mapType = ref('3d')
const trendPeriod = ref('year')
const currentStep = ref(2)

// 地图标记
const mapMarkers = ref([
  { id: 1, name: '甘肃农业大学', x: 35, y: 20, active: false },
  { id: 2, name: '安宁区', x: 25, y: 30, active: false },
  { id: 3, name: '兰州财经大学', x: 50, y: 35, active: true },
  { id: 4, name: '西北师范大学', x: 70, y: 45, active: false }
])

// 统计卡片数据
const statCards = computed(() => [
  {
    icon: OfficeBuilding,
    value: appStore.statistics.totalBuildings.toLocaleString(),
    unit: '栋',
    title: '建筑总数',
    desc: '公共建筑总数',
    color: '#4fc3f7',
    bgColor: 'rgba(79, 195, 247, 0.15)',
    trend: 5.2
  },
  {
    icon: Location,
    value: appStore.statistics.totalArea,
    unit: '万m²',
    title: '研究范围',
    desc: '周边3km区域',
    color: '#29b6f6',
    bgColor: 'rgba(41, 182, 246, 0.15)',
    trend: 0
  },
  {
    icon: Sunny,
    value: appStore.statistics.usableArea,
    unit: '万m²',
    title: '可安装面积',
    desc: '屋顶可利用面积',
    color: '#ffb74d',
    bgColor: 'rgba(255, 183, 77, 0.15)',
    trend: 3.8
  },
  {
    icon: Lightning,
    value: appStore.statistics.annualGeneration.toLocaleString(),
    unit: '万kWh',
    title: '年发电量潜力',
    desc: '预计年发电量',
    color: '#66bb6a',
    bgColor: 'rgba(102, 187, 106, 0.15)',
    trend: 8.5
  },
  {
    icon: Cherry,
    value: (appStore.statistics.carbonReduction / 1000).toFixed(1),
    unit: '万t',
    title: '年减碳量',
    desc: '二氧化碳减排量',
    color: '#81c784',
    bgColor: 'rgba(129, 199, 132, 0.15)',
    trend: 12.3
  },
  {
    icon: Money,
    value: appStore.statistics.paybackPeriod,
    unit: '年',
    title: '投资回收期',
    desc: '平均投资回收期',
    color: '#ef5350',
    bgColor: 'rgba(239, 83, 80, 0.15)',
    trend: -2.1
  }
])

// 评估流程
const processSteps = [
  { icon: 'Folder', title: '数据准备', desc: '数据收集与处理' },
  { icon: 'DataAnalysis', title: '适宜性分析', desc: '多因子空间分析' },
  { icon: 'TrendCharts', title: '效益评估', desc: '发电量与经济效益' },
  { icon: 'Guide', title: '碳减排评估', desc: '碳减排量核算' },
  { icon: 'Aim', title: '决策支持', desc: '综合评价与优化' },
  { icon: 'Upload', title: '结果输出', desc: '可视化与报告生成' }
]

// 潜力概览
const potentialItems = [
  { icon: 'Grid', value: '42.61', unit: '万m²', title: '适宜面积' },
  { icon: 'Lightning', value: '32.75', unit: 'MW', title: '装机容量潜力' },
  { icon: 'TrendCharts', value: '3,186.76', unit: '万kWh', title: '年发电量潜力' },
  { icon: 'Leaf', value: '11,204.35', unit: 'tCO₂', title: '年减碳量' },
  { icon: 'Money', value: '19,850.65', unit: '万元', title: '投资估算' },
  { icon: 'Wallet', value: '3,186.76', unit: '万元', title: '年收益' }
]

// 图表引用
const energyChartRef = ref(null)
const suitabilityChartRef = ref(null)
const emissionChartRef = ref(null)

let energyChart = null
let suitabilityChart = null
let emissionChart = null

// 方法
const handleSearch = () => {
  console.log('搜索:', searchQuery.value)
}

const handleRefresh = () => {
  appStore.setLoading(true)
  setTimeout(() => {
    appStore.setLoading(false)
    initCharts()
  }, 1000)
}

const handleExport = () => {
  console.log('导出报告')
}

const handleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const handleMarkerClick = (marker) => {
  mapMarkers.value.forEach(m => m.active = false)
  marker.active = true
}

// 初始化图表
const initCharts = () => {
  initEnergyChart()
  initSuitabilityChart()
  initEmissionChart()
}

const initEnergyChart = () => {
  if (!energyChartRef.value) return

  if (energyChart) {
    energyChart.dispose()
  }

  energyChart = echarts.init(energyChartRef.value)
  energyChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['预测发电量', '实际发电量'],
      textStyle: { color: '#fff' },
      top: 0
    },
    grid: { top: 40, right: 20, bottom: 30, left: 50 },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      axisLabel: { color: '#fff' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      axisLabel: { color: '#fff' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
    },
    series: [
      {
        name: '预测发电量',
        type: 'line',
        smooth: true,
        data: [180, 220, 280, 320, 380, 420, 450, 430, 380, 300, 240, 180],
        lineStyle: { color: '#4fc3f7', width: 3 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(79, 195, 247, 0.4)' },
            { offset: 1, color: 'rgba(79, 195, 247, 0.05)' }
          ])
        },
        itemStyle: { color: '#4fc3f7' }
      },
      {
        name: '实际发电量',
        type: 'line',
        smooth: true,
        data: [160, 200, 260, 300, 360, 400, 430, 410, 360, 280, 220, 160],
        lineStyle: { color: '#81c784', width: 3, type: 'dashed' },
        itemStyle: { color: '#81c784' }
      }
    ]
  })
}

const initSuitabilityChart = () => {
  if (!suitabilityChartRef.value) return

  if (suitabilityChart) {
    suitabilityChart.dispose()
  }

  suitabilityChart = echarts.init(suitabilityChartRef.value)
  suitabilityChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c}万m² ({d}%)' },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: { color: '#fff' }
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#0d1f35',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'inside',
          color: '#fff',
          fontSize: 12,
          fontWeight: 'bold',
          formatter: '{c}'
        },
        labelLine: { show: false },
        data: [
          { value: 15.37, name: '非常适宜', itemStyle: { color: '#66bb6a' } },
          { value: 15.37, name: '较适宜', itemStyle: { color: '#81c784' } },
          { value: 24.61, name: '一般', itemStyle: { color: '#aed581' } },
          { value: 18.92, name: '较不适宜', itemStyle: { color: '#ffb74d' } },
          { value: 6.07, name: '不适宜', itemStyle: { color: '#ff8a65' } }
        ]
      }
    ]
  })
}

const initEmissionChart = () => {
  if (!emissionChartRef.value) return

  if (emissionChart) {
    emissionChart.dispose()
  }

  emissionChart = echarts.init(emissionChartRef.value)
  emissionChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { top: 10, right: 80, bottom: 20, left: 100 },
    xAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      axisLabel: { color: '#fff' },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
    },
    yAxis: {
      type: 'category',
      data: ['实验楼群', '学生活动中心', '教学楼A区', '图书馆', '体育馆'],
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      axisLabel: { color: '#fff' }
    },
    series: [
      {
        type: 'bar',
        data: [
          { value: 1652, itemStyle: { color: '#81c784' } },
          { value: 1377, itemStyle: { color: '#aed581' } },
          { value: 1889, itemStyle: { color: '#aed581' } },
          { value: 2439, itemStyle: { color: '#4fc3f7' } },
          { value: 3347, itemStyle: { color: '#66bb6a' } }
        ],
        barWidth: '50%',
        label: {
          show: true,
          position: 'right',
          color: '#fff',
          formatter: '{c}'
        }
      }
    ]
  })
}

// 生命周期
onMounted(() => {
  nextTick(() => {
    initCharts()
  })

  window.addEventListener('resize', initCharts)
})

onUnmounted(() => {
  window.removeEventListener('resize', initCharts)

  if (energyChart) energyChart.dispose()
  if (suitabilityChart) suitabilityChart.dispose()
  if (emissionChart) emissionChart.dispose()
})
</script>

<style lang="scss" scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: transparent;
  min-height: calc(100vh - 110px);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: rgba(13, 31, 53, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(100, 200, 255, 0.2);

  .search-box {
    width: 320px;
  }

  .tool-buttons {
    display: flex;
    gap: 10px;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 15px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: rgba(13, 31, 53, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(100, 200, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(79, 195, 247, 0.15);
  }

  .stat-icon {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stat-content {
    flex: 1;

    .stat-value {
      display: flex;
      align-items: baseline;
      gap: 4px;

      .value {
        font-size: 26px;
        font-weight: bold;
        color: #4fc3f7;
      }

      .unit {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
      }
    }

    .stat-title {
      font-size: 14px;
      font-weight: 600;
      color: #fff;
      margin-top: 4px;
    }

    .stat-desc {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      margin-top: 2px;
    }
  }

  .stat-trend {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    padding: 4px 8px;
    border-radius: 12px;

    &.up {
      color: #66bb6a;
      background: rgba(102, 187, 106, 0.15);
    }

    &.down {
      color: #ef5350;
      background: rgba(239, 83, 80, 0.15);
    }
  }
}

.main-content {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;
}

.left-section,
.right-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.map-card,
.chart-card,
.process-card,
.potential-section {
  background: rgba(13, 31, 53, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(100, 200, 255, 0.2);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(100, 200, 255, 0.1);

  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
  }

  .card-unit {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
  }
}

.map-container {
  position: relative;
  height: 350px;
  padding: 15px;

  .map-image {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    object-fit: cover;
  }

  .map-markers {
    position: absolute;
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
  }

  .map-marker {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: rgba(13, 31, 53, 0.9);
    border: 1px solid rgba(100, 200, 255, 0.3);
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    transform: translate(-50%, -50%);

    &:hover,
    &.active {
      background: rgba(79, 195, 247, 0.3);
      border-color: #4fc3f7;

      .marker-dot {
        background: #66bb6a;
        box-shadow: 0 0 10px #66bb6a;
      }
    }

    .marker-dot {
      width: 10px;
      height: 10px;
      background: #4fc3f7;
      border-radius: 50%;
      box-shadow: 0 0 10px #4fc3f7;
    }

    .marker-label {
      font-size: 12px;
      color: #fff;
      white-space: nowrap;
    }
  }

  .map-legend {
    position: absolute;
    bottom: 25px;
    right: 25px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    background: rgba(13, 31, 53, 0.9);
    border-radius: 8px;
    border: 1px solid rgba(100, 200, 255, 0.2);

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #fff;

      .legend-color {
        width: 14px;
        height: 14px;
        border-radius: 3px;
      }
    }
  }
}

.process-card {
  .process-steps {
    display: flex;
    justify-content: space-between;
    padding: 25px 30px;
  }

  .process-step {
    display: flex;
    align-items: center;
    gap: 15px;
    position: relative;

    .step-icon {
      width: 50px;
      height: 50px;
      background: rgba(255, 255, 255, 0.05);
      border: 2px solid rgba(100, 200, 255, 0.3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.6);
      transition: all 0.3s ease;
    }

    &.active .step-icon {
      background: linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%);
      border-color: #4fc3f7;
      box-shadow: 0 0 20px rgba(79, 195, 247, 0.5);
      color: #fff;
    }

    .step-info {
      display: flex;
      flex-direction: column;

      .step-number {
        width: 22px;
        height: 22px;
        background: rgba(79, 195, 247, 0.2);
        border: 2px solid #4fc3f7;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: bold;
        color: #4fc3f7;
      }

      &.active .step-number {
        background: #4fc3f7;
        color: #0d1f35;
      }

      .step-title {
        font-size: 13px;
        font-weight: 600;
        color: #fff;
        margin-top: 6px;
      }

      .step-desc {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.5);
        margin-top: 2px;
      }
    }

    .step-arrow {
      position: absolute;
      right: -35px;
      color: rgba(100, 200, 255, 0.4);
    }
  }
}

.chart-container {
  height: 220px;
  padding: 15px;
}

.potential-section {
  padding: 20px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
    }
  }

  .potential-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 15px;
  }

  .potential-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 10px;
    border: 1px solid rgba(100, 200, 255, 0.1);

    .potential-icon {
      width: 45px;
      height: 45px;
      background: linear-gradient(135deg, rgba(79, 195, 247, 0.2) 0%, rgba(41, 182, 246, 0.1) 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4fc3f7;
    }

    .potential-content {
      .potential-value {
        display: flex;
        align-items: baseline;
        gap: 3px;

        .value {
          font-size: 20px;
          font-weight: bold;
          color: #4fc3f7;
        }

        .unit {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }
      }

      .potential-title {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
        margin-top: 3px;
      }
    }
  }
}

@media (max-width: 1440px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .main-content {
    grid-template-columns: 1fr;
  }

  .potential-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .potential-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .toolbar {
    flex-direction: column;
    gap: 15px;

    .search-box {
      width: 100%;
    }

    .tool-buttons {
      width: 100%;
      justify-content: flex-end;
    }
  }
}
</style>
