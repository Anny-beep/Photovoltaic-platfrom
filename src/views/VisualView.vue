<template>
  <div class="visual-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">可视化分析</h2>
        <el-tag type="info" effect="dark">高级数据展示</el-tag>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="toggleFullscreen">
          <el-icon><FullScreen /></el-icon>
          全屏展示
        </el-button>
        <el-button @click="exportChart">
          <el-icon><Download /></el-icon>
          导出图表
        </el-button>
      </div>
    </div>

    <!-- 大屏模式切换 -->
    <div class="mode-switch">
      <el-radio-group v-model="displayMode" size="small">
        <el-radio-button label="dashboard">仪表盘模式</el-radio-button>
        <el-radio-button label="3d">3D场景模式</el-radio-button>
        <el-radio-button label="compare">对比模式</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 仪表盘模式 -->
    <div v-if="displayMode === 'dashboard'" class="dashboard-view">
      <!-- 顶部统计 -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><OfficeBuilding /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ buildingCount }}</div>
            <div class="stat-label">建筑总数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><Sunny /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ suitableArea }}</div>
            <div class="stat-label">适宜面积(万m²)</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><Lightning /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ generation }}</div>
            <div class="stat-label">年发电量(万kWh)</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><Cherry /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ emission }}</div>
            <div class="stat-label">碳减排量(tCO₂)</div>
          </div>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="charts-grid">
        <div class="chart-card large">
          <div class="card-header">
            <span class="card-title">实时发电监测</span>
            <div class="live-indicator">
              <span class="pulse"></span>
              <span>实时</span>
            </div>
          </div>
          <div ref="realtimeChart" class="chart-container"></div>
        </div>
        <div class="chart-card">
          <div class="card-header">
            <span class="card-title">适宜性分布</span>
          </div>
          <div ref="distributionChart" class="chart-container"></div>
        </div>
        <div class="chart-card">
          <div class="card-header">
            <span class="card-title">效益分析</span>
          </div>
          <div ref="benefitChart" class="chart-container"></div>
        </div>
        <div class="chart-card">
          <div class="card-header">
            <span class="card-title">减排贡献</span>
          </div>
          <div ref="emissionChart" class="chart-container"></div>
        </div>
      </div>
    </div>

    <!-- 3D场景模式 -->
    <div v-if="displayMode === '3d'" class="scene-view">
      <div class="scene-container">
        <div class="scene-header">
          <span class="scene-title">校园光伏3D场景</span>
          <div class="scene-controls">
            <el-button text @click="rotateScene">
              <el-icon><Refresh /></el-icon>
            </el-button>
            <el-button text @click="zoomIn">
              <el-icon><ZoomIn /></el-icon>
            </el-button>
            <el-button text @click="zoomOut">
              <el-icon><ZoomOut /></el-icon>
            </el-button>
            <el-button text @click="resetView">
              <el-icon><MapLocation /></el-icon>
            </el-button>
          </div>
        </div>
        <div class="scene-content">
          <img
            src="https://neeko-copilot.bytedance.net/api/text_to_image?prompt=3d%20visualization%20of%20university%20campus%20with%20solar%20panels%20on%20building%20roofs%20architectural%20rendering%20blue%20sky&image_size=landscape_16_9"
            alt="3D场景"
            class="scene-image"
          />
          <div class="scene-markers">
            <div class="marker" style="left: 30%; top: 40%;">
              <div class="marker-pin"></div>
              <div class="marker-tooltip">体育馆 - 3347tCO₂/年</div>
            </div>
            <div class="marker" style="left: 50%; top: 35%;">
              <div class="marker-pin"></div>
              <div class="marker-tooltip">图书馆 - 2439tCO₂/年</div>
            </div>
            <div class="marker" style="left: 65%; top: 50%;">
              <div class="marker-pin"></div>
              <div class="marker-tooltip">教学楼 - 1889tCO₂/年</div>
            </div>
          </div>
        </div>
        <div class="scene-info">
          <div class="info-item">
            <span>装机容量:</span>
            <span class="value">32.75 MW</span>
          </div>
          <div class="info-item">
            <span>年发电量:</span>
            <span class="value">3,186.76万kWh</span>
          </div>
          <div class="info-item">
            <span>年减碳量:</span>
            <span class="value">11,204 tCO₂</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 对比模式 -->
    <div v-if="displayMode === 'compare'" class="compare-view">
      <div class="compare-header">
        <el-select v-model="compareType" placeholder="选择对比维度">
          <el-option label="建筑类型对比" value="type" />
          <el-option label="区域对比" value="area" />
          <el-option label="时间对比" value="time" />
        </el-select>
      </div>
      <div class="compare-content">
        <div class="compare-panel">
          <div class="panel-title">方案A</div>
          <div class="panel-content">
            <div class="compare-item">
              <span>投资:</span>
              <span>1,985万</span>
            </div>
            <div class="compare-item">
              <span>装机:</span>
              <span>32.75 MW</span>
            </div>
            <div class="compare-item">
              <span>发电:</span>
              <span>3,186万kWh</span>
            </div>
            <div class="compare-item">
              <span>回收期:</span>
              <span>6.35年</span>
            </div>
          </div>
        </div>
        <div class="compare-panel highlight">
          <div class="panel-title">方案B</div>
          <div class="panel-content">
            <div class="compare-item">
              <span>投资:</span>
              <span>2,850万</span>
            </div>
            <div class="compare-item">
              <span>装机:</span>
              <span>45.5 MW</span>
            </div>
            <div class="compare-item">
              <span>发电:</span>
              <span>4,420万kWh</span>
            </div>
            <div class="compare-item">
              <span>回收期:</span>
              <span>7.2年</span>
            </div>
          </div>
        </div>
        <div class="compare-panel">
          <div class="panel-title">方案C</div>
          <div class="panel-content">
            <div class="compare-item">
              <span>投资:</span>
              <span>1,200万</span>
            </div>
            <div class="compare-item">
              <span>装机:</span>
              <span>19.8 MW</span>
            </div>
            <div class="compare-item">
              <span>发电:</span>
              <span>1,920万kWh</span>
            </div>
            <div class="compare-item">
              <span>回收期:</span>
              <span>5.8年</span>
            </div>
          </div>
        </div>
      </div>
      <div ref="compareChart" class="compare-chart"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { FullScreen, Download, OfficeBuilding, Sunny, Lightning, Cherry, Refresh, ZoomIn, ZoomOut, MapLocation } from '@element-plus/icons-vue'

const displayMode = ref('dashboard')
const compareType = ref('type')

const buildingCount = '1,258'
const suitableArea = '42.61'
const generation = '3,186.76'
const emission = '11,204'

const realtimeChart = ref(null)
const distributionChart = ref(null)
const benefitChart = ref(null)
const emissionChart = ref(null)
const compareChart = ref(null)

let rtChart = null, dChart = null, bChart = null, eChart = null, cChart = null

const initCharts = () => {
  if (rtChart) rtChart.dispose()
  if (dChart) dChart.dispose()
  if (bChart) bChart.dispose()
  if (eChart) eChart.dispose()
  if (cChart) cChart.dispose()

  rtChart = echarts.init(realtimeChart.value)
  rtChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { top: 20, right: 20, bottom: 30, left: 50 },
    xAxis: { type: 'category', data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'], axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } }, axisLabel: { color: '#fff' } },
    yAxis: { type: 'value', axisLabel: { color: '#fff' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } } },
    series: [{ type: 'line', smooth: true, data: [120, 80, 450, 890, 720, 350], lineStyle: { color: '#ffb74d', width: 3 }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(255, 183, 77, 0.4)' }, { offset: 1, color: 'rgba(255, 183, 77, 0.05)' }]) } }]
  })

  dChart = echarts.init(distributionChart.value)
  dChart.setOption({
    tooltip: { trigger: 'item' },
    series: [{ type: 'pie', radius: ['45%', '70%'], data: [{ value: 35, name: '非常适宜', itemStyle: { color: '#66bb6a' } }, { value: 30, name: '较适宜', itemStyle: { color: '#81c784' } }, { value: 20, name: '一般', itemStyle: { color: '#aed581' } }, { value: 15, name: '不适宜', itemStyle: { color: '#ff8a65' } }], label: { show: true, color: '#fff', formatter: '{b}: {d}%' } }]
  })

  bChart = echarts.init(benefitChart.value)
  bChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: { type: 'category', data: ['电费节省', '补贴收益', '碳交易', '其他'], axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } }, axisLabel: { color: '#fff' } },
    yAxis: { type: 'value', axisLabel: { color: '#fff' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } } },
    series: [{ type: 'bar', data: [1115, 398, 82, 55], itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#4fc3f7' }, { offset: 1, color: '#29b6f6' }]) } }]
  })

  eChart = echarts.init(emissionChart.value)
  eChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { top: 20, right: 20, bottom: 20, left: 60 },
    xAxis: { type: 'category', data: ['体育馆', '图书馆', '教学楼', '实验楼'], axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } }, axisLabel: { color: '#fff', rotate: 30 } },
    yAxis: { type: 'value', axisLabel: { color: '#fff' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } } },
    series: [{ type: 'line', data: [3347, 2439, 1889, 1652], lineStyle: { color: '#66bb6a', width: 3 }, itemStyle: { color: '#66bb6a' } }]
  })

  cChart = echarts.init(compareChart.value)
  cChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['方案A', '方案B', '方案C'], textStyle: { color: '#fff' } },
    xAxis: { type: 'category', data: ['投资', '装机容量', '发电量', '回收期'], axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } }, axisLabel: { color: '#fff' } },
    yAxis: { type: 'value', axisLabel: { color: '#fff' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } } },
    series: [
      { name: '方案A', type: 'bar', data: [1985, 32.75, 3186, 6.35], itemStyle: { color: '#4fc3f7' } },
      { name: '方案B', type: 'bar', data: [2850, 45.5, 4420, 7.2], itemStyle: { color: '#66bb6a' } },
      { name: '方案C', type: 'bar', data: [1200, 19.8, 1920, 5.8], itemStyle: { color: '#ffb74d' } }
    ]
  })
}

const toggleFullscreen = () => {
  document.documentElement.requestFullscreen()
}

const exportChart = () => { }
const rotateScene = () => { }
const zoomIn = () => { }
const zoomOut = () => { }
const resetView = () => { }

onMounted(() => {
  nextTick(() => {
    initCharts()
  })
  window.addEventListener('resize', initCharts)
})

onUnmounted(() => {
  window.removeEventListener('resize', initCharts)
  if (rtChart) rtChart.dispose()
  if (dChart) dChart.dispose()
  if (bChart) bChart.dispose()
  if (eChart) eChart.dispose()
  if (cChart) cChart.dispose()
})
</script>

<style lang="scss" scoped>
.visual-view {
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

.mode-switch {
  margin-bottom: 20px;
}

.dashboard-view {
  .stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    margin-bottom: 20px;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 20px;
    background: rgba(13, 31, 53, 0.8);
    border-radius: 12px;
    border: 1px solid rgba(100, 200, 255, 0.2);

    .stat-icon {
      width: 50px;
      height: 50px;
      background: rgba(79, 195, 247, 0.2);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4fc3f7;
      font-size: 22px;
    }

    .stat-info {
      .stat-value {
        font-size: 28px;
        font-weight: bold;
        color: #fff;
      }

      .stat-label {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }

  .charts-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 15px;

    .chart-card {
      background: rgba(13, 31, 53, 0.8);
      border-radius: 12px;
      border: 1px solid rgba(100, 200, 255, 0.2);
      overflow: hidden;

      &.large {
        grid-column: span 2;
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

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #66bb6a;

          .pulse {
            width: 8px;
            height: 8px;
            background: #66bb6a;
            border-radius: 50%;
            animation: pulse 2s infinite;
          }
        }
      }

      .chart-container {
        height: 250px;
        padding: 15px;
      }

      &.large .chart-container {
        height: 350px;
      }
    }
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.scene-view {
  .scene-container {
    background: rgba(13, 31, 53, 0.8);
    border-radius: 12px;
    border: 1px solid rgba(100, 200, 255, 0.2);
    overflow: hidden;

    .scene-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      border-bottom: 1px solid rgba(100, 200, 255, 0.1);

      .scene-title {
        font-size: 16px;
        font-weight: 600;
        color: #fff;
      }

      .scene-controls {
        display: flex;
        gap: 8px;
      }
    }

    .scene-content {
      position: relative;
      height: 450px;

      .scene-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .scene-markers {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        .marker {
          position: absolute;
          cursor: pointer;

          .marker-pin {
            width: 20px;
            height: 20px;
            background: #4fc3f7;
            border-radius: 50%;
            border: 2px solid #fff;
            box-shadow: 0 0 10px #4fc3f7;
          }

          .marker-tooltip {
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            padding: 6px 12px;
            background: rgba(13, 31, 53, 0.95);
            border: 1px solid rgba(100, 200, 255, 0.3);
            border-radius: 6px;
            font-size: 12px;
            color: #fff;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.3s;
          }

          &:hover .marker-tooltip {
            opacity: 1;
          }
        }
      }
    }

    .scene-info {
      display: flex;
      justify-content: center;
      gap: 40px;
      padding: 20px;
      background: rgba(0, 0, 0, 0.3);

      .info-item {
        display: flex;
        gap: 10px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);

        .value {
          font-weight: bold;
          color: #4fc3f7;
        }
      }
    }
  }
}

.compare-view {
  .compare-header {
    margin-bottom: 20px;
  }

  .compare-content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 20px;

    .compare-panel {
      background: rgba(13, 31, 53, 0.8);
      border-radius: 12px;
      border: 1px solid rgba(100, 200, 255, 0.2);
      overflow: hidden;

      &.highlight {
        border-color: rgba(79, 195, 247, 0.5);
        background: rgba(79, 195, 247, 0.1);
      }

      .panel-title {
        padding: 15px 20px;
        background: rgba(79, 195, 247, 0.1);
        font-size: 14px;
        font-weight: 600;
        color: #fff;
      }

      .panel-content {
        padding: 20px;

        .compare-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(100, 200, 255, 0.1);
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);

          span:last-child {
            color: #4fc3f7;
            font-weight: 600;
          }
        }
      }
    }
  }

  .compare-chart {
    height: 300px;
    background: rgba(13, 31, 53, 0.8);
    border-radius: 12px;
    border: 1px solid rgba(100, 200, 255, 0.2);
    padding: 15px;
  }
}

@media (max-width: 1440px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr) !important;
  }

  .charts-grid {
    grid-template-columns: 1fr !important;
  }

  .compare-content {
    grid-template-columns: 1fr !important;
  }
}
</style>
