<template>
  <div class="suitability-view">
    <!-- 页面标题和工具栏 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">适宜性评估</h2>
        <el-tag type="success" effect="dark">多因子空间分析</el-tag>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleEvaluate">
          <el-icon><Refresh /></el-icon>
          重新评估
        </el-button>
        <el-button @click="handleExport">
          <el-icon><Download /></el-icon>
          导出报告
        </el-button>
      </div>
    </div>

    <!-- 评估参数配置 -->
    <div class="config-section">
      <div class="section-card">
        <div class="card-header">
          <span class="card-title">评估参数配置</span>
        </div>
        <div class="config-content">
          <div class="config-item">
            <label>屋顶面积权重</label>
            <el-slider v-model="weights.roofArea" :min="0" :max="100" :step="5" show-input />
          </div>
          <div class="config-item">
            <label>朝向角度权重</label>
            <el-slider v-model="weights.orientation" :min="0" :max="100" :step="5" show-input />
          </div>
          <div class="config-item">
            <label>遮挡情况权重</label>
            <el-slider v-model="weights.obstruction" :min="0" :max="100" :step="5" show-input />
          </div>
          <div class="config-item">
            <label>结构承载权重</label>
            <el-slider v-model="weights.structure" :min="0" :max="100" :step="5" show-input />
          </div>
          <div class="config-item">
            <label>周边环境权重</label>
            <el-slider v-model="weights.environment" :min="0" :max="100" :step="5" show-input />
          </div>
        </div>
      </div>
    </div>

    <!-- 评估结果统计 -->
    <div class="stats-section">
      <div class="stat-card" v-for="stat in assessmentStats" :key="stat.level">
        <div class="stat-indicator" :style="{ background: stat.color }"></div>
        <div class="stat-content">
          <div class="stat-value">{{ stat.count }}</div>
          <div class="stat-label">{{ stat.level }}</div>
          <div class="stat-area">{{ stat.area }}万m²</div>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 左侧地图和分析图表 -->
      <div class="left-panel">
        <div class="panel-card">
          <div class="card-header">
            <span class="card-title">适宜性空间分布</span>
            <el-radio-group v-model="mapView" size="small">
              <el-radio-button label="map">地图</el-radio-button>
              <el-radio-button label="heat">热力图</el-radio-button>
              <el-radio-button label="3d">3D视图</el-radio-button>
            </el-radio-group>
          </div>
          <div class="map-container">
            <img
              src="https://neeko-copilot.bytedance.net/api/text_to_image?prompt=aerial%20view%20of%20university%20campus%20buildings%20solar%20panels%20heat%20map%20visualization&image_size=landscape_16_9"
              alt="适宜性分布图"
              class="map-image"
            />
          </div>
        </div>

        <div class="panel-card">
          <div class="card-header">
            <span class="card-title">适宜性分布统计</span>
          </div>
          <div ref="distributionChart" class="chart-container"></div>
        </div>
      </div>

      <!-- 右侧建筑列表 -->
      <div class="right-panel">
        <div class="panel-card building-list">
          <div class="card-header">
            <span class="card-title">建筑评估结果</span>
            <div class="header-tools">
              <el-input
                v-model="searchKeyword"
                placeholder="搜索建筑..."
                :prefix-icon="Search"
                size="small"
                style="width: 200px;"
              />
              <el-select v-model="filterLevel" placeholder="筛选等级" size="small" style="width: 120px;">
                <el-option label="全部" value="" />
                <el-option label="非常适宜" value="非常适宜" />
                <el-option label="较适宜" value="较适宜" />
                <el-option label="一般" value="一般" />
                <el-option label="较不适宜" value="较不适宜" />
                <el-option label="不适宜" value="不适宜" />
              </el-select>
            </div>
          </div>
          <div class="building-items">
            <div
              v-for="building in filteredBuildings"
              :key="building.id"
              class="building-item"
              :class="{ active: selectedBuilding?.id === building.id }"
              @click="handleSelectBuilding(building)"
            >
              <div class="building-header">
                <span class="building-name">{{ building.name }}</span>
                <el-tag :type="getLevelType(building.suitability.level)" size="small">
                  {{ building.suitability.level }}
                </el-tag>
              </div>
              <div class="building-info">
                <span class="info-item">
                  <el-icon><Location /></el-icon>
                  {{ building.location.address }}
                </span>
                <span class="info-item">
                  <el-icon><OfficeBuilding /></el-icon>
                  {{ building.roofArea }}m²
                </span>
              </div>
              <div class="building-score">
                <div class="score-bar">
                  <div class="score-fill" :style="{ width: building.suitability.score + '%', background: getLevelColor(building.suitability.level) }"></div>
                </div>
                <span class="score-value">{{ building.suitability.score }}分</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 选中建筑详情 -->
        <div v-if="selectedBuilding" class="panel-card building-detail">
          <div class="card-header">
            <span class="card-title">{{ selectedBuilding.name }}</span>
            <el-button text @click="selectedBuilding = null">
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
          <div class="detail-content">
            <div class="detail-section">
              <h4 class="section-title">基本信息</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>建筑类型</label>
                  <span>{{ selectedBuilding.type }}</span>
                </div>
                <div class="detail-item">
                  <label>结构类型</label>
                  <span>{{ selectedBuilding.structure }}</span>
                </div>
                <div class="detail-item">
                  <label>屋顶面积</label>
                  <span>{{ selectedBuilding.roofArea }}m²</span>
                </div>
                <div class="detail-item">
                  <label>可利用面积</label>
                  <span>{{ selectedBuilding.usableArea }}m²</span>
                </div>
                <div class="detail-item">
                  <label>朝向</label>
                  <span>{{ selectedBuilding.orientation }}°</span>
                </div>
                <div class="detail-item">
                  <label>倾斜角</label>
                  <span>{{ selectedBuilding.tilt }}°</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4 class="section-title">适宜性评分</h4>
              <div class="score-overview">
                <div class="main-score" :style="{ color: getLevelColor(selectedBuilding.suitability.level) }">
                  {{ selectedBuilding.suitability.score }}
                </div>
                <div class="score-level">{{ selectedBuilding.suitability.level }}</div>
              </div>
              <div class="factor-scores">
                <div class="factor-item" v-for="(value, key) in selectedBuilding.suitability.factors" :key="key">
                  <span class="factor-name">{{ getFactorName(key) }}</span>
                  <el-progress :percentage="value" :color="getProgressColor(value)" :show-text="false" />
                  <span class="factor-value">{{ value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useAppStore } from '@/stores/app'
import * as echarts from 'echarts'
import { Search, Refresh, Download, Location, OfficeBuilding, Close } from '@element-plus/icons-vue'

const appStore = useAppStore()

// 状态
const searchKeyword = ref('')
const filterLevel = ref('')
const mapView = ref('map')
const selectedBuilding = ref(null)
const weights = ref({
  roofArea: 25,
  orientation: 20,
  obstruction: 20,
  structure: 20,
  environment: 15
})

// 评估统计
const assessmentStats = computed(() => [
  { level: '非常适宜', count: 15, area: 15.37, color: '#66bb6a' },
  { level: '较适宜', count: 28, area: 24.61, color: '#81c784' },
  { level: '一般', count: 42, area: 18.92, color: '#aed581' },
  { level: '较不适宜', count: 25, area: 6.07, color: '#ffb74d' },
  { level: '不适宜', count: 18, area: 2.31, color: '#ff8a65' }
])

// 筛选后的建筑列表
const filteredBuildings = computed(() => {
  let buildings = appStore.buildings
  if (searchKeyword.value) {
    buildings = buildings.filter(b =>
      b.name.includes(searchKeyword.value) ||
      b.location.address.includes(searchKeyword.value)
    )
  }
  if (filterLevel.value) {
    buildings = buildings.filter(b => b.suitability.level === filterLevel.value)
  }
  return buildings
})

// 图表引用
const distributionChart = ref(null)
let chartInstance = null

// 方法
const getLevelType = (level) => {
  const map = {
    '非常适宜': 'success',
    '较适宜': 'success',
    '一般': 'warning',
    '较不适宜': 'warning',
    '不适宜': 'danger'
  }
  return map[level] || 'info'
}

const getLevelColor = (level) => {
  const map = {
    '非常适宜': '#66bb6a',
    '较适宜': '#81c784',
    '一般': '#aed581',
    '较不适宜': '#ffb74d',
    '不适宜': '#ff8a65'
  }
  return map[level] || '#999'
}

const getProgressColor = (value) => {
  if (value >= 90) return '#66bb6a'
  if (value >= 80) return '#81c784'
  if (value >= 60) return '#aed581'
  if (value >= 40) return '#ffb74d'
  return '#ff8a65'
}

const getFactorName = (key) => {
  const map = {
    area: '屋顶面积',
    orientation: '朝向角度',
    obstruction: '遮挡情况',
    structure: '结构承载'
  }
  return map[key] || key
}

const handleEvaluate = () => {
  console.log('重新评估，权重:', weights.value)
}

const handleExport = () => {
  console.log('导出报告')
}

const handleSelectBuilding = (building) => {
  selectedBuilding.value = building
}

const initChart = () => {
  if (!distributionChart.value) return

  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(distributionChart.value)
  chartInstance.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c}万m² ({d}%)' },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: { color: '#fff' }
    },
    series: [{
      type: 'pie',
      radius: ['45%', '75%'],
      center: ['40%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#0d1f35',
        borderWidth: 3
      },
      label: {
        show: true,
        position: 'outside',
        color: '#fff',
        formatter: '{b}\n{c}万m²'
      },
      labelLine: { show: true },
      data: [
        { value: 15.37, name: '非常适宜', itemStyle: { color: '#66bb6a' } },
        { value: 24.61, name: '较适宜', itemStyle: { color: '#81c784' } },
        { value: 18.92, name: '一般', itemStyle: { color: '#aed581' } },
        { value: 6.07, name: '较不适宜', itemStyle: { color: '#ffb74d' } },
        { value: 2.31, name: '不适宜', itemStyle: { color: '#ff8a65' } }
      ]
    }]
  })
}

onMounted(() => {
  nextTick(() => {
    initChart()
  })
  window.addEventListener('resize', initChart)
})

onUnmounted(() => {
  window.removeEventListener('resize', initChart)
  if (chartInstance) chartInstance.dispose()
})
</script>

<style lang="scss" scoped>
.suitability-view {
  padding: 20px;
  background: transparent;
  min-height: calc(100vh - 110px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 15px;

    .page-title {
      font-size: 24px;
      font-weight: 600;
      color: #fff;
      margin: 0;
    }
  }

  .header-actions {
    display: flex;
    gap: 10px;
  }
}

.config-section {
  margin-bottom: 20px;

  .config-content {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 30px;
    padding: 20px;
  }

  .config-item {
    label {
      display: block;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 10px;
    }
  }
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  margin-bottom: 20px;

  .stat-card {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 18px;
    background: rgba(13, 31, 53, 0.8);
    border-radius: 12px;
    border: 1px solid rgba(100, 200, 255, 0.2);

    .stat-indicator {
      width: 6px;
      height: 50px;
      border-radius: 3px;
    }

    .stat-content {
      .stat-value {
        font-size: 28px;
        font-weight: bold;
        color: #fff;
      }

      .stat-label {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.8);
        margin-top: 2px;
      }

      .stat-area {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
        margin-top: 2px;
      }
    }
  }
}

.main-content {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
}

.left-panel,
.right-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel-card {
  background: rgba(13, 31, 53, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(100, 200, 255, 0.2);
  overflow: hidden;

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

    .header-tools {
      display: flex;
      gap: 10px;
    }
  }
}

.map-container {
  padding: 15px;

  .map-image {
    width: 100%;
    height: 300px;
    border-radius: 8px;
    object-fit: cover;
  }
}

.chart-container {
  height: 280px;
  padding: 15px;
}

.building-list {
  flex: 1;

  .building-items {
    max-height: 400px;
    overflow-y: auto;
    padding: 15px;
  }

  .building-item {
    padding: 15px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(100, 200, 255, 0.1);
    border-radius: 8px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover,
    &.active {
      background: rgba(79, 195, 247, 0.1);
      border-color: rgba(79, 195, 247, 0.3);
    }

    .building-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .building-name {
        font-size: 14px;
        font-weight: 600;
        color: #fff;
      }
    }

    .building-info {
      display: flex;
      gap: 15px;
      margin-bottom: 10px;

      .info-item {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }
    }

    .building-score {
      display: flex;
      align-items: center;
      gap: 10px;

      .score-bar {
        flex: 1;
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
        overflow: hidden;

        .score-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.3s ease;
        }
      }

      .score-value {
        font-size: 12px;
        font-weight: 600;
        color: #4fc3f7;
        min-width: 45px;
      }
    }
  }
}

.building-detail {
  .detail-content {
    padding: 20px;
  }

  .detail-section {
    margin-bottom: 25px;

    &:last-child {
      margin-bottom: 0;
    }

    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #fff;
      margin: 0 0 15px 0;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(100, 200, 255, 0.1);
    }
  }

  .detail-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;

    .detail-item {
      label {
        display: block;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
        margin-bottom: 5px;
      }

      span {
        font-size: 14px;
        color: #fff;
      }
    }
  }

  .score-overview {
    text-align: center;
    margin-bottom: 20px;

    .main-score {
      font-size: 56px;
      font-weight: bold;
    }

    .score-level {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.8);
      margin-top: 5px;
    }
  }

  .factor-scores {
    .factor-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;

      .factor-name {
        width: 80px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.7);
      }

      .el-progress {
        flex: 1;
      }

      .factor-value {
        width: 35px;
        font-size: 13px;
        font-weight: 600;
        color: #4fc3f7;
        text-align: right;
      }
    }
  }
}

@media (max-width: 1440px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .stats-section {
    grid-template-columns: repeat(3, 1fr);
  }

  .config-section .config-content {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
