<template>
  <div class="benefit-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">效益评估</h2>
        <el-tag type="primary" effect="dark">经济效益分析</el-tag>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleRecalculate">
          <el-icon><Refresh /></el-icon>
          重新计算
        </el-button>
        <el-button @click="handleCompare">
          <el-icon><ArrowRight /></el-icon>
          方案对比
        </el-button>
      </div>
    </div>

    <!-- 核心指标卡片 -->
    <div class="stats-cards">
      <div class="stat-card main">
        <div class="stat-icon">
          <el-icon><Lightning /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ totalGeneration }}</div>
          <div class="stat-unit">万kWh/年</div>
          <div class="stat-label">总发电量潜力</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon revenue">
          <el-icon><Wallet /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ totalRevenue }}</div>
          <div class="stat-unit">万元/年</div>
          <div class="stat-label">年收益</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon investment">
          <el-icon><Wallet /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ totalInvestment }}</div>
          <div class="stat-unit">万元</div>
          <div class="stat-label">总投资估算</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon payback">
          <el-icon><Clock /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ averagePayback }}</div>
          <div class="stat-unit">年</div>
          <div class="stat-label">平均回收期</div>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 左侧图表 -->
      <div class="left-panel">
        <!-- 发电量表 -->
        <div class="panel-card">
          <div class="card-header">
            <span class="card-title">发电量趋势预测</span>
            <el-select v-model="chartPeriod" size="small">
              <el-option label="月度" value="monthly" />
              <el-option label="年度" value="yearly" />
              <el-option label="五年" value="5year" />
            </el-select>
          </div>
          <div ref="generationChart" class="chart-container"></div>
        </div>

        <!-- 投资成本分析 -->
        <div class="panel-card">
          <div class="card-header">
            <span class="card-title">投资成本构成</span>
          </div>
          <div ref="costChart" class="chart-container"></div>
        </div>
      </div>

      <!-- 右侧内容 -->
      <div class="right-panel">
        <!-- 敏感性分析 -->
        <div class="panel-card">
          <div class="card-header">
            <span class="card-title">敏感性分析</span>
          </div>
          <div class="analysis-content">
            <div class="analysis-item" v-for="item in sensitivityData" :key="item.name">
              <div class="analysis-header">
                <span class="analysis-name">{{ item.name }}</span>
                <span class="analysis-value">{{ item.value }}%</span>
              </div>
              <div class="analysis-bar">
                <div class="bar-fill" :style="{ width: item.value + '%', background: item.color }"></div>
              </div>
              <div class="analysis-desc">{{ item.description }}</div>
            </div>
          </div>
        </div>

        <!-- 收益测算表 -->
        <div class="panel-card">
          <div class="card-header">
            <span class="card-title">收益测算明细</span>
          </div>
          <div class="table-container">
            <table class="benefit-table">
              <thead>
                <tr>
                  <th>项目</th>
                  <th>金额(万元/年)</th>
                  <th>占比</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in revenueItems" :key="item.name">
                  <td>{{ item.name }}</td>
                  <td class="amount">{{ item.amount }}</td>
                  <td>
                    <div class="percent-bar">
                      <div class="percent-fill" :style="{ width: item.percent + '%' }"></div>
                    </div>
                    <span class="percent-text">{{ item.percent }}%</span>
                  </td>
                </tr>
                <tr class="total">
                  <td><strong>合计</strong></td>
                  <td class="amount total-amount"><strong>{{ totalRevenue }}</strong></td>
                  <td><strong>100%</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 经济性指标 -->
        <div class="panel-card">
          <div class="card-header">
            <span class="card-title">经济性指标</span>
          </div>
          <div class="metrics-grid">
            <div class="metric-item">
              <div class="metric-value">{{ roi }}%</div>
              <div class="metric-label">投资回报率</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">{{ irr }}%</div>
              <div class="metric-label">内部收益率</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">{{ npv }}</div>
              <div class="metric-label">净现值(万元)</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">{{ benefitCost }}</div>
              <div class="metric-label">效益成本比</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 建筑效益列表 -->
    <div class="building-section">
      <div class="section-header">
        <span class="section-title">各建筑效益明细</span>
        <el-button text type="primary" @click="handleExport">
          <el-icon><Download /></el-icon>
          导出报表
        </el-button>
      </div>
      <div class="table-wrapper">
        <table class="building-table">
          <thead>
            <tr>
              <th>建筑名称</th>
              <th>建筑类型</th>
              <th>可利用面积(m²)</th>
              <th>装机容量(kW)</th>
              <th>年发电量(万kWh)</th>
              <th>投资估算(万元)</th>
              <th>年收益(万元)</th>
              <th>回收期(年)</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="building in buildings" :key="building.id">
              <td>{{ building.name }}</td>
              <td>{{ building.type }}</td>
              <td>{{ building.usableArea }}</td>
              <td>{{ building.potential.installCapacity }}</td>
              <td>{{ building.potential.annualGeneration }}</td>
              <td>{{ building.potential.investment }}</td>
              <td>{{ building.potential.annualGeneration * 0.35 }}</td>
              <td>{{ building.potential.paybackPeriod }}</td>
              <td>
                <el-button text size="small" @click="viewDetail(building)">
                  <el-icon><View /></el-icon>
                </el-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useAppStore } from '@/stores/app'
import * as echarts from 'echarts'
import { Refresh, ArrowRight, Lightning, CreditCard, Wallet, Clock, Download, View } from '@element-plus/icons-vue'

const appStore = useAppStore()
const chartPeriod = ref('monthly')

const buildings = computed(() => appStore.buildings)

const totalGeneration = computed(() => {
  return buildings.value.reduce((sum, b) => sum + b.potential.annualGeneration, 0).toFixed(2)
})

const totalInvestment = computed(() => {
  return buildings.value.reduce((sum, b) => sum + b.potential.investment, 0).toFixed(2)
})

const totalRevenue = computed(() => {
  return (parseFloat(totalGeneration.value) * 0.35).toFixed(2)
})

const averagePayback = computed(() => {
  return (parseFloat(totalInvestment.value) / parseFloat(totalRevenue.value)).toFixed(2)
})

const roi = '15.62'
const irr = '12.35'
const npv = '2,856.42'
const benefitCost = '1.85'

const sensitivityData = [
  { name: '电价波动', value: 35, color: '#4fc3f7', description: '电价每上涨10%，收益增加约8.5%' },
  { name: '装机成本', value: 28, color: '#66bb6a', description: '成本每降低5%，回收期缩短约0.3年' },
  { name: '光照条件', value: 22, color: '#ffb74d', description: '光照增加10%，发电量增加约9.5%' },
  { name: '运维成本', value: 15, color: '#ef5350', description: '运维费用占总成本约8-12%' }
]

const revenueItems = [
  { name: '电费节省', amount: '1,115.67', percent: 65 },
  { name: '国家补贴', amount: '398.34', percent: 23 },
  { name: '地方补贴', amount: '111.57', percent: 7 },
  { name: '碳交易收益', amount: '81.67', percent: 5 }
]

const generationChart = ref(null)
const costChart = ref(null)
let genChart = null
let cstChart = null

const initCharts = () => {
  if (genChart) genChart.dispose()
  if (cstChart) cstChart.dispose()

  genChart = echarts.init(generationChart.value)
  genChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['预测值', '基准值'],
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
        name: '预测值',
        type: 'bar',
        data: [180, 220, 280, 320, 380, 420, 450, 430, 380, 300, 240, 180],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#4fc3f7' },
            { offset: 1, color: '#29b6f6' }
          ]),
          borderRadius: [4, 4, 0, 0]
        }
      },
      {
        name: '基准值',
        type: 'line',
        data: [150, 180, 230, 260, 310, 340, 360, 350, 310, 250, 200, 150],
        lineStyle: { color: '#fff', width: 2, type: 'dashed' },
        itemStyle: { color: '#fff' }
      }
    ]
  })

  cstChart = echarts.init(costChart.value)
  cstChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c}万元 ({d}%)' },
    series: [{
      type: 'pie',
      radius: ['50%', '75%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 8, borderColor: '#0d1f35', borderWidth: 2 },
      label: { show: true, color: '#fff', formatter: '{b}\n{d}%' },
      data: [
        { value: 4500, name: '光伏组件', itemStyle: { color: '#4fc3f7' } },
        { value: 3200, name: '支架系统', itemStyle: { color: '#66bb6a' } },
        { value: 2800, name: '逆变器', itemStyle: { color: '#ffb74d' } },
        { value: 2500, name: '线缆设备', itemStyle: { color: '#ef5350' } },
        { value: 1800, name: '安装费用', itemStyle: { color: '#ab47bc' } },
        { value: 1200, name: '其他费用', itemStyle: { color: '#78909c' } }
      ]
    }]
  })
}

const handleRecalculate = () => { }
const handleCompare = () => { }
const handleExport = () => { }
const viewDetail = (building) => {
  console.log('查看详情:', building)
}

onMounted(() => {
  nextTick(() => {
    initCharts()
  })
  window.addEventListener('resize', initCharts)
})

onUnmounted(() => {
  window.removeEventListener('resize', initCharts)
  if (genChart) genChart.dispose()
  if (cstChart) cstChart.dispose()
})
</script>

<style lang="scss" scoped>
.benefit-view {
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

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;

  .stat-card {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 20px;
    background: rgba(13, 31, 53, 0.8);
    border-radius: 12px;
    border: 1px solid rgba(100, 200, 255, 0.2);

    &.main {
      grid-column: span 2;
      background: linear-gradient(135deg, rgba(79, 195, 247, 0.2) 0%, rgba(41, 182, 246, 0.1) 100%);
      border-color: rgba(79, 195, 247, 0.4);
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      background: rgba(79, 195, 247, 0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4fc3f7;
      font-size: 24px;

      &.revenue {
        background: rgba(102, 187, 106, 0.2);
        color: #66bb6a;
      }

      &.investment {
        background: rgba(255, 183, 77, 0.2);
        color: #ffb74d;
      }

      &.payback {
        background: rgba(156, 39, 176, 0.2);
        color: #ab47bc;
      }
    }

    .stat-info {
      .stat-value {
        font-size: 32px;
        font-weight: bold;
        color: #fff;
      }

      .stat-unit {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
        margin-left: 5px;
      }

      .stat-label {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.7);
        margin-top: 5px;
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

.analysis-content {
  padding: 15px;

  .analysis-item {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    .analysis-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;

      .analysis-name {
        font-size: 13px;
        color: #fff;
      }

      .analysis-value {
        font-size: 13px;
        font-weight: 600;
        color: #4fc3f7;
      }
    }

    .analysis-bar {
      height: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      overflow: hidden;

      .bar-fill {
        height: 100%;
        border-radius: 3px;
        transition: width 0.5s ease;
      }
    }

    .analysis-desc {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.5);
      margin-top: 5px;
    }
  }
}

.table-container {
  padding: 15px;
  overflow-x: auto;
}

.benefit-table {
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid rgba(100, 200, 255, 0.1);
  }

  th {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 600;
  }

  td {
    font-size: 13px;
    color: #fff;

    .amount {
      color: #4fc3f7;
      font-weight: 600;
    }

    .percent-bar {
      display: inline-block;
      width: 80px;
      height: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      overflow: hidden;
      vertical-align: middle;
      margin-right: 8px;

      .percent-fill {
        height: 100%;
        background: linear-gradient(90deg, #4fc3f7, #66bb6a);
        border-radius: 3px;
      }
    }

    .percent-text {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
    }
  }

  .total {
    background: rgba(79, 195, 247, 0.1);

    .total-amount {
      color: #4fc3f7;
      font-size: 16px;
    }
  }
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  padding: 20px;

  .metric-item {
    text-align: center;
    padding: 15px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;

    .metric-value {
      font-size: 24px;
      font-weight: bold;
      color: #4fc3f7;
    }

    .metric-label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      margin-top: 5px;
    }
  }
}

.building-section {
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

  .table-wrapper {
    padding: 15px;
    overflow-x: auto;
  }

  .building-table {
    width: 100%;
    border-collapse: collapse;

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid rgba(100, 200, 255, 0.1);
    }

    th {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 600;
    }

    td {
      font-size: 13px;
      color: #fff;
    }

    tr:hover {
      background: rgba(79, 195, 247, 0.05);
    }
  }
}

@media (max-width: 1440px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .main-content {
    grid-template-columns: 1fr;
  }

  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
