<template>
  <div class="emission-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">碳减排评估</h2>
        <el-tag type="success" effect="dark">环境效益分析</el-tag>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleCalculate">
          <el-icon><Refresh /></el-icon>
          重新核算
        </el-button>
        <el-button @click="handleReport">
          <el-icon><Document /></el-icon>
          生成报告
        </el-button>
      </div>
    </div>

    <!-- 核心指标 -->
    <div class="core-indicators">
      <div class="indicator-card primary">
        <div class="indicator-icon">
          <el-icon><Cherry /></el-icon>
        </div>
        <div class="indicator-content">
          <div class="indicator-value">{{ totalReduction }}</div>
          <div class="indicator-label">年碳减排量</div>
          <div class="indicator-unit">tCO₂/年</div>
        </div>
        <div class="indicator-trend up">
          <el-icon><Histogram /></el-icon>
          <span>+12.5%</span>
        </div>
      </div>
      <div class="indicator-card">
        <div class="indicator-icon coal">
          <el-icon><Sunny /></el-icon>
        </div>
        <div class="indicator-content">
          <div class="indicator-value">{{ coalSavings }}</div>
          <div class="indicator-label">标准煤节约量</div>
          <div class="indicator-unit">吨/年</div>
        </div>
      </div>
      <div class="indicator-card">
        <div class="indicator-icon so2">
          <el-icon><Cloudy /></el-icon>
        </div>
        <div class="indicator-content">
          <div class="indicator-value">{{ so2Reduction }}</div>
          <div class="indicator-label">SO₂减排量</div>
          <div class="indicator-unit">吨/年</div>
        </div>
      </div>
      <div class="indicator-card">
        <div class="indicator-icon nox">
          <el-icon><Drizzling /></el-icon>
        </div>
        <div class="indicator-content">
          <div class="indicator-value">{{ noxReduction }}</div>
          <div class="indicator-label">NOₓ减排量</div>
          <div class="indicator-unit">吨/年</div>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 左侧图表 -->
      <div class="left-panel">
        <div class="panel-card">
          <div class="card-header">
            <span class="card-title">碳减排趋势</span>
            <el-select v-model="trendPeriod" size="small">
              <el-option label="近一年" value="year" />
              <el-option label="近三年" value="3year" />
            </el-select>
          </div>
          <div ref="trendChart" class="chart-container"></div>
        </div>

        <div class="panel-card">
          <div class="card-header">
            <span class="card-title">减排贡献排名</span>
          </div>
          <div ref="rankingChart" class="chart-container"></div>
        </div>
      </div>

      <!-- 右侧面板 -->
      <div class="right-panel">
        <div class="panel-card">
          <div class="card-header">
            <span class="card-title">CCER项目潜力</span>
          </div>
          <div class="ccer-content">
            <div class="ccer-summary">
              <div class="summary-item">
                <div class="summary-value">{{ ccerPotential }}</div>
                <div class="summary-label">CCER潜力(tCO₂)</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">{{ ccerRevenue }}</div>
                <div class="summary-label">碳交易收益(万元)</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">{{ carbonPrice }}</div>
                <div class="summary-label">碳价(元/tCO₂)</div>
              </div>
            </div>
            <div class="ccer-description">
              <p>本项目符合CCER开发条件，预计可开发碳减排量约 <strong>{{ ccerPotential }} tCO₂</strong>，按照当前碳价 <strong>{{ carbonPrice }} 元/tCO₂</strong>计算，年碳交易收益约 <strong>{{ ccerRevenue }} 万元</strong>。</p>
            </div>
          </div>
        </div>

        <div class="panel-card">
          <div class="card-header">
            <span class="card-title">碳中和路径规划</span>
          </div>
          <div class="path-content">
            <div class="path-item" v-for="(item, index) in carbonNeutralPath" :key="index">
              <div class="path-icon" :class="{ active: index <= 2 }">
                <el-icon><component :is="item.icon" /></el-icon>
              </div>
              <div class="path-info">
                <div class="path-title">{{ item.title }}</div>
                <div class="path-desc">{{ item.description }}</div>
                <div class="path-target">目标: {{ item.target }}</div>
              </div>
              <div class="path-status" :class="item.status">
                {{ item.status === 'completed' ? '已完成' : item.status === 'current' ? '进行中' : '待开展' }}
              </div>
            </div>
          </div>
        </div>

        <div class="panel-card">
          <div class="card-header">
            <span class="card-title">环境效益折算</span>
          </div>
          <div class="conversion-grid">
            <div class="conversion-item" v-for="item in environmentalBenefits" :key="item.name">
              <div class="conversion-icon" :style="{ background: item.bgColor }">
                <el-icon :color="item.color"><component :is="item.icon" /></el-icon>
              </div>
              <div class="conversion-content">
                <div class="conversion-value">{{ item.value }}</div>
                <div class="conversion-label">{{ item.name }}</div>
                <div class="conversion-desc">{{ item.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ESG报告预览 -->
    <div class="esg-section">
      <div class="section-header">
        <span class="section-title">ESG报告摘要</span>
        <el-button text type="primary" @click="downloadESG">
          <el-icon><Download /></el-icon>
          下载完整报告
        </el-button>
      </div>
      <div class="esg-content">
        <div class="esg-grid">
          <div class="esg-item">
            <div class="esg-score">
              <div class="score-circle">
                <div class="score-value">85</div>
                <div class="score-label">E评分</div>
              </div>
            </div>
            <div class="esg-title">环境维度</div>
            <div class="esg-desc">碳排放管理、能源效率、资源循环</div>
          </div>
          <div class="esg-item">
            <div class="esg-score">
              <div class="score-circle">78</div>
              <div class="score-label">S评分</div>
            </div>
            <div class="esg-title">社会维度</div>
            <div class="esg-desc">社会责任、员工关怀、社区贡献</div>
          </div>
          <div class="esg-item">
            <div class="esg-score">
              <div class="score-circle">92</div>
              <div class="score-label">G评分</div>
            </div>
            <div class="esg-title">治理维度</div>
            <div class="esg-desc">合规管理、风险控制、信息披露</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app'
import * as echarts from 'echarts'
import { Refresh, Document, Cherry, Sunny, Cloudy, Drizzling, Histogram, Download, CircleCheck, Clock, Aim, Ship } from '@element-plus/icons-vue'

const appStore = useAppStore()
const trendPeriod = ref('year')

const totalReduction = computed(() => {
  return appStore.statistics.carbonReduction.toLocaleString()
})

const coalSavings = computed(() => {
  return Math.round(appStore.statistics.carbonReduction * 0.312)
})

const so2Reduction = computed(() => {
  return (appStore.statistics.carbonReduction * 0.0026).toFixed(2)
})

const noxReduction = computed(() => {
  return (appStore.statistics.carbonReduction * 0.0038).toFixed(2)
})

const ccerPotential = '11,204'
const ccerRevenue = '81.67'
const carbonPrice = '72.9'

const carbonNeutralPath = [
  { title: '碳排查基线建立', description: '完成校园碳排放基线数据收集与分析', target: '2024年Q1', status: 'completed', icon: CircleCheck },
  { title: '光伏项目建设', description: '完成核心建筑屋顶光伏安装', target: '2024年Q4', status: 'current', icon: Clock },
  { title: '能源管理体系', description: '建立完善的能源监测与管理系统', target: '2025年Q2', status: 'pending', icon: Aim },
  { title: '碳中和认证', description: '获取碳中和认证证书', target: '2025年Q4', status: 'pending', icon: Ship }
]

const environmentalBenefits = [
  { name: '森林种植', value: '305亩', description: '相当于种植的森林面积', icon: Cherry, color: '#66bb6a', bgColor: 'rgba(102, 187, 106, 0.15)' },
  { name: '汽车减排', value: '2,456辆', description: '相当于减少的汽车数量', icon: Sunny, color: '#4fc3f7', bgColor: 'rgba(79, 195, 247, 0.15)' },
  { name: '发电节约', value: '523万kWh', description: '相当于节约的火力发电量', icon: Sunny, color: '#ffb74d', bgColor: 'rgba(255, 183, 77, 0.15)' },
  { name: '水资源保护', value: '1.2万吨', description: '相当于节约的水资源', icon: Cloudy, color: '#29b6f6', bgColor: 'rgba(41, 182, 246, 0.15)' }
]

const trendChart = ref(null)
const rankingChart = ref(null)
let tChart = null
let rChart = null

const initCharts = () => {
  if (tChart) tChart.dispose()
  if (rChart) rChart.dispose()

  tChart = echarts.init(trendChart.value)
  tChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['碳减排量', '累计减排量'], textStyle: { color: '#fff' }, top: 0 },
    grid: { top: 40, right: 20, bottom: 30, left: 50 },
    xAxis: {
      type: 'category',
      data: ['2020', '2021', '2022', '2023', '2024'],
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      axisLabel: { color: '#fff' }
    },
    yAxis: [
      { type: 'value', axisLabel: { color: '#fff', formatter: '{value}t' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } } },
      { type: 'value', axisLabel: { color: '#fff', formatter: '{value}万t' }, splitLine: { show: false } }
    ],
    series: [
      {
        name: '碳减排量',
        type: 'bar',
        data: [3200, 4500, 6800, 9200, 11204],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#66bb6a' },
            { offset: 1, color: '#43a047' }
          ])
        }
      },
      {
        name: '累计减排量',
        type: 'line',
        yAxisIndex: 1,
        data: [0.32, 0.77, 1.45, 2.37, 3.49],
        lineStyle: { color: '#4fc3f7', width: 3 },
        itemStyle: { color: '#4fc3f7' }
      }
    ]
  })

  rChart = echarts.init(rankingChart.value)
  rChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { top: 10, right: 20, bottom: 20, left: 100 },
    xAxis: { type: 'value', axisLabel: { color: '#fff' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } } },
    yAxis: { type: 'category', data: ['实验楼群', '学生活动中心', '教学楼A区', '图书馆', '体育馆'], axisLabel: { color: '#fff' } },
    series: [{
      type: 'bar',
      data: [1652, 1377, 1889, 2439, 3347].map((v, i) => ({
        value: v,
        itemStyle: { color: ['#aed581', '#aed581', '#81c784', '#4fc3f7', '#66bb6a'][i] }
      })),
      label: { show: true, position: 'right', color: '#fff' }
    }]
  })
}

const handleCalculate = () => { }
const handleReport = () => { }
const downloadESG = () => { }

onMounted(() => {
  nextTick(() => {
    initCharts()
  })
  window.addEventListener('resize', initCharts)
})

onUnmounted(() => {
  window.removeEventListener('resize', initCharts)
  if (tChart) tChart.dispose()
  if (rChart) rChart.dispose()
})
</script>

<style lang="scss" scoped>
.emission-view {
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
}

.core-indicators {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;

  .indicator-card {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 20px;
    background: rgba(13, 31, 53, 0.8);
    border-radius: 12px;
    border: 1px solid rgba(100, 200, 255, 0.2);
    position: relative;

    &.primary {
      grid-column: span 2;
      background: linear-gradient(135deg, rgba(102, 187, 106, 0.2) 0%, rgba(67, 160, 71, 0.1) 100%);
      border-color: rgba(102, 187, 106, 0.4);
    }

    .indicator-icon {
      width: 56px;
      height: 56px;
      background: rgba(102, 187, 106, 0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #66bb6a;
      font-size: 24px;

      &.coal {
        background: rgba(255, 183, 77, 0.2);
        color: #ffb74d;
      }

      &.so2 {
        background: rgba(79, 195, 247, 0.2);
        color: #4fc3f7;
      }

      &.nox {
        background: rgba(156, 39, 176, 0.2);
        color: #ab47bc;
      }
    }

    .indicator-content {
      .indicator-value {
        font-size: 32px;
        font-weight: bold;
        color: #fff;
      }

      .indicator-label {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
        margin-top: 5px;
      }

      .indicator-unit {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
      }
    }

    .indicator-trend {
      position: absolute;
      top: 15px;
      right: 15px;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 5px 10px;
      background: rgba(102, 187, 106, 0.2);
      border-radius: 12px;
      font-size: 12px;
      color: #66bb6a;

      &.up {
        color: #66bb6a;
      }

      &.down {
        color: #ef5350;
        background: rgba(239, 83, 80, 0.2);
      }
    }
  }
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
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
  }
}

.chart-container {
  height: 280px;
  padding: 15px;
}

.ccer-content {
  padding: 20px;

  .ccer-summary {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin-bottom: 20px;

    .summary-item {
      text-align: center;
      padding: 15px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 8px;

      .summary-value {
        font-size: 24px;
        font-weight: bold;
        color: #66bb6a;
      }

      .summary-label {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        margin-top: 5px;
      }
    }
  }

  .ccer-description {
    p {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.6;
    }
  }
}

.path-content {
  padding: 15px;

  .path-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }

    .path-icon {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.5);

      &.active {
        background: rgba(102, 187, 106, 0.2);
        color: #66bb6a;
      }
    }

    .path-info {
      flex: 1;

      .path-title {
        font-size: 14px;
        font-weight: 600;
        color: #fff;
      }

      .path-desc {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
        margin-top: 3px;
      }

      .path-target {
        font-size: 11px;
        color: #4fc3f7;
        margin-top: 3px;
      }
    }

    .path-status {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;

      &.completed {
        background: rgba(102, 187, 106, 0.2);
        color: #66bb6a;
      }

      &.current {
        background: rgba(79, 195, 247, 0.2);
        color: #4fc3f7;
      }

      &.pending {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
}

.conversion-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding: 20px;

  .conversion-item {
    display: flex;
    gap: 12px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;

    .conversion-icon {
      width: 45px;
      height: 45px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .conversion-content {
      .conversion-value {
        font-size: 18px;
        font-weight: bold;
        color: #fff;
      }

      .conversion-label {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.8);
        margin-top: 3px;
      }

      .conversion-desc {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.5);
        margin-top: 2px;
      }
    }
  }
}

.esg-section {
  background: rgba(13, 31, 53, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(100, 200, 255, 0.2);
  overflow: hidden;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid rgba(100, 200, 255, 0.1);

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
    }
  }

  .esg-content {
    padding: 20px;

    .esg-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .esg-item {
      text-align: center;
      padding: 20px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 12px;

      .esg-score {
        margin-bottom: 15px;

        .score-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4fc3f7 0%, #66bb6a 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0 auto;

          .score-value {
            font-size: 28px;
            font-weight: bold;
            color: #fff;
          }

          .score-label {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.8);
          }
        }
      }

      .esg-title {
        font-size: 14px;
        font-weight: 600;
        color: #fff;
        margin-bottom: 5px;
      }

      .esg-desc {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
}

@media (max-width: 1440px) {
  .core-indicators {
    grid-template-columns: repeat(2, 1fr);
  }

  .main-content {
    grid-template-columns: 1fr;
  }

  .esg-grid {
    grid-template-columns: repeat(1, 1fr) !important;
  }
}
</style>
