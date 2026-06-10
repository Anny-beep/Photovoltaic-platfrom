<template>
  <div class="decision-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">决策支持</h2>
        <el-tag type="warning" effect="dark">综合评价与优化</el-tag>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleOptimize">
          <el-icon><Star /></el-icon>
          智能优化
        </el-button>
        <el-button @click="handleCompare">
          <el-icon><ArrowRight /></el-icon>
          方案对比
        </el-button>
      </div>
    </div>

    <!-- 推荐方案 -->
    <div class="recommendation-section">
      <div class="section-header">
        <span class="section-title">推荐方案</span>
        <el-tag type="success">AI智能推荐</el-tag>
      </div>
      <div class="recommendation-card">
        <div class="card-header">
          <div class="card-title">
            <el-icon><Trophy /></el-icon>
            <span>最优方案-A方案</span>
          </div>
          <div class="card-badge">推荐指数 95%</div>
        </div>
        <div class="card-content">
          <div class="content-row">
            <div class="content-item">
              <span class="item-label">投资规模</span>
              <span class="item-value">1,985万元</span>
            </div>
            <div class="content-item">
              <span class="item-label">装机容量</span>
              <span class="item-value">32.75 MW</span>
            </div>
            <div class="content-item">
              <span class="item-label">年发电量</span>
              <span class="item-value">3,186.76万kWh</span>
            </div>
            <div class="content-item">
              <span class="item-label">投资回收期</span>
              <span class="item-value highlight">6.35年</span>
            </div>
          </div>
          <div class="recommendation-desc">
            <p>基于多目标优化算法，综合考虑投资成本、发电效益、碳减排量等因素，推荐优先建设体育馆、图书馆、教学楼A区等建筑的光伏项目。该方案投资回报率达15.62%，内部收益率12.35%，具有良好的经济效益和环境效益。</p>
          </div>
        </div>
        <div class="card-footer">
          <el-button type="primary" @click="applyRecommendation">
            <el-icon><CircleCheck /></el-icon>
            应用方案
          </el-button>
          <el-button @click="viewDetails">
            <el-icon><View /></el-icon>
            查看详情
          </el-button>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 左侧面板 -->
      <div class="left-panel">
        <div class="panel-card">
          <div class="card-header">
            <span class="card-title">方案对比矩阵</span>
          </div>
          <div class="matrix-content">
            <table class="matrix-table">
              <thead>
                <tr>
                  <th>指标</th>
                  <th>A方案</th>
                  <th>B方案</th>
                  <th>C方案</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>投资规模</td>
                  <td>1,985万</td>
                  <td>2,850万</td>
                  <td>1,200万</td>
                </tr>
                <tr>
                  <td>装机容量</td>
                  <td>32.75 MW</td>
                  <td>45.5 MW</td>
                  <td>19.8 MW</td>
                </tr>
                <tr>
                  <td>年发电量</td>
                  <td>3,186万kWh</td>
                  <td>4,420万kWh</td>
                  <td>1,920万kWh</td>
                </tr>
                <tr>
                  <td>投资回收期</td>
                  <td class="best">6.35年</td>
                  <td>7.2年</td>
                  <td>5.8年</td>
                </tr>
                <tr>
                  <td>IRR</td>
                  <td class="best">12.35%</td>
                  <td>11.2%</td>
                  <td>13.5%</td>
                </tr>
                <tr>
                  <td>碳减排量</td>
                  <td>11,204t</td>
                  <td class="best">15,540t</td>
                  <td>6,780t</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="panel-card">
          <div class="card-header">
            <span class="card-title">决策因素权重</span>
          </div>
          <div ref="weightChart" class="chart-container"></div>
        </div>
      </div>

      <!-- 右侧面板 -->
      <div class="right-panel">
        <div class="panel-card">
          <div class="card-header">
            <span class="card-title">风险评估矩阵</span>
          </div>
          <div class="risk-content">
            <div class="risk-grid">
              <div class="risk-item high" v-for="item in highRisks" :key="item.name">
                <div class="risk-icon">
                  <el-icon><WarnTriangleFilled /></el-icon>
                </div>
                <div class="risk-info">
                  <div class="risk-name">{{ item.name }}</div>
                  <div class="risk-desc">{{ item.description }}</div>
                </div>
                <div class="risk-score high">{{ item.score }}</div>
              </div>
              <div class="risk-item medium" v-for="item in mediumRisks" :key="item.name">
                <div class="risk-icon">
                  <el-icon><WarningFilled /></el-icon>
                </div>
                <div class="risk-info">
                  <div class="risk-name">{{ item.name }}</div>
                  <div class="risk-desc">{{ item.description }}</div>
                </div>
                <div class="risk-score medium">{{ item.score }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="panel-card">
          <div class="card-header">
            <span class="card-title">优先级排序</span>
          </div>
          <div class="priority-list">
            <div class="priority-item" v-for="(item, index) in priorityList" :key="item.name">
              <div class="priority-rank" :class="{ top: index < 3 }">{{ index + 1 }}</div>
              <div class="priority-info">
                <div class="priority-name">{{ item.name }}</div>
                <div class="priority-score">综合评分: {{ item.score }}分</div>
              </div>
              <div class="priority-bar">
                <div class="bar-fill" :style="{ width: item.score + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="panel-card">
          <div class="card-header">
            <span class="card-title">情景模拟分析</span>
          </div>
          <div ref="scenarioChart" class="chart-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { Star, ArrowRight, Trophy, CircleCheck, View, WarnTriangleFilled, WarningFilled } from '@element-plus/icons-vue'

const highRisks = [
  { name: '政策风险', description: '补贴政策变动影响收益', score: '高' },
  { name: '市场风险', description: '电价波动影响投资回报', score: '高' }
]

const mediumRisks = [
  { name: '技术风险', description: '组件效率不及预期', score: '中' },
  { name: '施工风险', description: '安装周期延误', score: '中' }
]

const priorityList = [
  { name: '体育馆', score: 92 },
  { name: '图书馆', score: 87 },
  { name: '教学楼A区', score: 85 },
  { name: '实验楼群', score: 82 },
  { name: '学生活动中心', score: 78 }
]

const weightChart = ref(null)
const scenarioChart = ref(null)
let wChart = null
let sChart = null

const initCharts = () => {
  if (wChart) wChart.dispose()
  if (sChart) sChart.dispose()

  wChart = echarts.init(weightChart.value)
  wChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
    series: [{
      type: 'pie',
      radius: ['50%', '75%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 8, borderColor: '#0d1f35', borderWidth: 2 },
      label: { show: true, color: '#fff', formatter: '{b}\n{c}%' },
      data: [
        { value: 30, name: '经济效益', itemStyle: { color: '#4fc3f7' } },
        { value: 25, name: '环境效益', itemStyle: { color: '#66bb6a' } },
        { value: 20, name: '投资回收期', itemStyle: { color: '#ffb74d' } },
        { value: 15, name: '技术可行性', itemStyle: { color: '#ab47bc' } },
        { value: 10, name: '政策风险', itemStyle: { color: '#78909c' } }
      ]
    }]
  })

  sChart = echarts.init(scenarioChart.value)
  sChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['基准情景', '乐观情景', '悲观情景'], textStyle: { color: '#fff' }, top: 0 },
    grid: { top: 40, right: 20, bottom: 30, left: 50 },
    xAxis: { type: 'category', data: ['第1年', '第3年', '第5年', '第8年', '第10年'], axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } }, axisLabel: { color: '#fff' } },
    yAxis: { type: 'value', axisLabel: { color: '#fff' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } } },
    series: [
      { name: '基准情景', type: 'line', smooth: true, data: [0, 800, 1800, 3500, 5000], lineStyle: { color: '#4fc3f7', width: 3 } },
      { name: '乐观情景', type: 'line', smooth: true, data: [0, 1000, 2200, 4200, 6000], lineStyle: { color: '#66bb6a', width: 3, type: 'dashed' } },
      { name: '悲观情景', type: 'line', smooth: true, data: [0, 600, 1400, 2800, 4000], lineStyle: { color: '#ef5350', width: 3, type: 'dashed' } }
    ]
  })
}

const handleOptimize = () => { }
const handleCompare = () => { }
const applyRecommendation = () => { }
const viewDetails = () => { }

onMounted(() => {
  nextTick(() => {
    initCharts()
  })
  window.addEventListener('resize', initCharts)
})

onUnmounted(() => {
  window.removeEventListener('resize', initCharts)
  if (wChart) wChart.dispose()
  if (sChart) sChart.dispose()
})
</script>

<style lang="scss" scoped>
.decision-view {
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

.recommendation-section {
  margin-bottom: 20px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #fff;
    }
  }

  .recommendation-card {
    background: linear-gradient(135deg, rgba(79, 195, 247, 0.15) 0%, rgba(41, 182, 246, 0.1) 100%);
    border-radius: 12px;
    border: 1px solid rgba(79, 195, 247, 0.3);
    overflow: hidden;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      background: rgba(79, 195, 247, 0.1);
      border-bottom: 1px solid rgba(79, 195, 247, 0.2);

      .card-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 18px;
        font-weight: 600;
        color: #fff;
      }

      .card-badge {
        padding: 6px 16px;
        background: rgba(102, 187, 106, 0.2);
        color: #66bb6a;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
      }
    }

    .card-content {
      padding: 20px;

      .content-row {
        display: flex;
        gap: 20px;
        margin-bottom: 20px;

        .content-item {
          flex: 1;
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          text-align: center;

          .item-label {
            display: block;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 8px;
          }

          .item-value {
            font-size: 18px;
            font-weight: bold;
            color: #fff;

            &.highlight {
              color: #66bb6a;
            }
          }
        }
      }

      .recommendation-desc {
        p {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin: 0;
        }
      }
    }

    .card-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 15px 20px;
      background: rgba(0, 0, 0, 0.2);
    }
  }
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
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
    padding: 15px 20px;
    border-bottom: 1px solid rgba(100, 200, 255, 0.1);

    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
    }
  }
}

.matrix-content {
  padding: 15px;

  .matrix-table {
    width: 100%;
    border-collapse: collapse;

    th, td {
      padding: 12px;
      text-align: center;
      border-bottom: 1px solid rgba(100, 200, 255, 0.1);
    }

    th {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 600;
      background: rgba(79, 195, 247, 0.1);
    }

    td {
      font-size: 13px;
      color: #fff;

      &.best {
        color: #66bb6a;
        font-weight: 600;
      }
    }
  }
}

.chart-container {
  height: 220px;
  padding: 15px;
}

.risk-content {
  padding: 15px;

  .risk-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .risk-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 15px;
    border-radius: 8px;

    &.high {
      background: rgba(239, 83, 80, 0.1);
      border: 1px solid rgba(239, 83, 80, 0.3);
    }

    &.medium {
      background: rgba(255, 183, 77, 0.1);
      border: 1px solid rgba(255, 183, 77, 0.3);
    }

    .risk-icon {
      color: #ef5350;
      font-size: 20px;
    }

    .medium & .risk-icon {
      color: #ffb74d;
    }

    .risk-info {
      flex: 1;

      .risk-name {
        font-size: 14px;
        font-weight: 600;
        color: #fff;
      }

      .risk-desc {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        margin-top: 3px;
      }
    }

    .risk-score {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;

      &.high {
        background: rgba(239, 83, 80, 0.2);
        color: #ef5350;
      }

      &.medium {
        background: rgba(255, 183, 77, 0.2);
        color: #ffb74d;
      }
    }
  }
}

.priority-list {
  padding: 15px;

  .priority-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }

    .priority-rank {
      width: 28px;
      height: 28px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
      color: rgba(255, 255, 255, 0.7);

      &.top {
        background: linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%);
        color: #fff;
      }
    }

    .priority-info {
      flex: 1;

      .priority-name {
        font-size: 14px;
        font-weight: 600;
        color: #fff;
      }

      .priority-score {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.5);
        margin-top: 3px;
      }
    }

    .priority-bar {
      width: 100px;
      height: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      overflow: hidden;

      .bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #4fc3f7, #66bb6a);
        border-radius: 3px;
        transition: width 0.5s ease;
      }
    }
  }
}

@media (max-width: 1440px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .content-row {
    flex-wrap: wrap;

    .content-item {
      min-width: calc(50% - 10px);
    }
  }
}
</style>
