<template>
  <div class="main-content">
    <div class="map-section">
      <div class="map-header">
        <input 
          type="text" 
          class="search-input" 
          placeholder="请输入建筑名称或地址搜索..."
        />
        <div class="map-tools">
          <button class="tool-btn active">三维场景</button>
          <button class="tool-btn">影像底图</button>
          <button class="tool-btn">热力图</button>
          <button class="tool-btn">行政区划</button>
        </div>
      </div>
      <div class="map-container">
        <img 
          src="https://neeko-copilot.bytedance.net/api/text_to_image?prompt=aerial%20view%20of%20university%20campus%20buildings%20with%20solar%20panels%20on%20roofs%203d%20visualization%20blue%20sky&image_size=landscape_16_9" 
          alt="地图" 
          class="map-image"
        />
        <div class="map-labels">
          <div class="label-item" style="top: 20%; left: 35%;">
            <span class="label-dot"></span>
            <span class="label-text">甘肃农业大学</span>
          </div>
          <div class="label-item" style="top: 30%; left: 25%;">
            <span class="label-dot"></span>
            <span class="label-text">安宁区</span>
          </div>
          <div class="label-item active" style="top: 35%; left: 50%;">
            <span class="label-dot"></span>
            <span class="label-text">兰州财经大学</span>
          </div>
          <div class="label-item" style="top: 45%; left: 70%;">
            <span class="label-dot"></span>
            <span class="label-text">西北师范大学</span>
          </div>
        </div>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-card" v-for="card in statCards" :key="card.title">
        <div class="card-icon">{{ card.icon }}</div>
        <div class="card-content">
          <div class="card-value">{{ card.value }}</div>
          <div class="card-label">{{ card.label }}</div>
          <div class="card-title">{{ card.title }}</div>
        </div>
      </div>
    </div>

    <div class="process-section">
      <div class="section-header">
        <span class="section-title">评估流程</span>
      </div>
      <div class="process-steps">
        <div 
          class="process-step" 
          v-for="(step, index) in processSteps" 
          :key="step.title"
          :class="{ active: index <= 2 }"
        >
          <div class="step-icon">{{ step.icon }}</div>
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-title">{{ step.title }}</div>
          <div class="step-desc">{{ step.desc }}</div>
          <div v-if="index < processSteps.length - 1" class="step-line"></div>
        </div>
      </div>
    </div>

    <div class="charts-section">
      <div class="chart-card energy-chart">
        <div class="chart-header">
          <span class="chart-title">发电量趋势分析</span>
          <span class="chart-unit">万kWh</span>
        </div>
        <div ref="energyChart" class="chart-container"></div>
      </div>

      <div class="chart-card suitability-chart">
        <div class="chart-header">
          <span class="chart-title">适宜性分级统计</span>
          <span class="chart-unit">万m²</span>
        </div>
        <div ref="suitabilityChart" class="chart-container"></div>
      </div>

      <div class="chart-card emission-chart">
        <div class="chart-header">
          <span class="chart-title">碳减排贡献TOP5</span>
          <span class="chart-unit">tCO₂/年</span>
        </div>
        <div ref="emissionChart" class="chart-container"></div>
      </div>
    </div>

    <div class="summary-section">
      <div class="section-header">
        <span class="section-title">光伏潜力概览</span>
      </div>
      <div class="summary-cards">
        <div class="summary-card" v-for="card in summaryCards" :key="card.title">
          <div class="summary-icon">{{ card.icon }}</div>
          <div class="summary-content">
            <div class="summary-value">{{ card.value }}</div>
            <div class="summary-label">{{ card.label }}</div>
            <div class="summary-title">{{ card.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const energyChart = ref(null)
const suitabilityChart = ref(null)
const emissionChart = ref(null)

const statCards = [
  { icon: '🏭', value: '35.6', label: '万m²', title: '研究范围', sub: '兰州财经大学周边3km' },
  { icon: '🏢', value: '1,258', label: '栋', title: '建筑总数', sub: '公共建筑' },
  { icon: '☀️', value: '67.28', label: '万m²', title: '可安装面积', sub: '屋顶可利用面积' },
  { icon: '⚡', value: '3,186.76', label: '万kWh', title: '年发电量潜力', sub: '预计年发电量' },
  { icon: '🌿', value: '1,12', label: '万t', title: '年减碳量', sub: '二氧化碳减排量' },
  { icon: '💰', value: '6.35', label: '年', title: '投资回收期', sub: '平均投资回收期' }
]
console.log('[MainContent] 统计卡片数据加载完成:', { data: statCards, length: statCards.length })

const processSteps = [
  { icon: '📁', title: '数据准备', desc: '数据收集与处理' },
  { icon: '🔍', title: '适宜性分析', desc: '多因子空间分析' },
  { icon: '📊', title: '效益评估', desc: '发电量与经济效益' },
  { icon: '🌿', title: '碳减排评估', desc: '碳减排量核算' },
  { icon: '🎯', title: '决策支持', desc: '综合评价与优化' },
  { icon: '📤', title: '结果输出', desc: '可视化与报告生成' }
]
console.log('[MainContent] 评估流程数据加载完成:', { data: processSteps, length: processSteps.length })

const summaryCards = [
  { icon: '📐', value: '42.61', label: '万m²', title: '适宜面积' },
  { icon: '⚡', value: '32.75', label: 'MW', title: '装机容量潜力' },
  { icon: '📈', value: '3,186.76', label: '万kWh', title: '年发电量潜力' },
  { icon: '🌿', value: '11,204.35', label: 'tCO₂', title: '年减碳量' },
  { icon: '💰', value: '19,850.65', label: '万元', title: '投资估算' },
  { icon: '💵', value: '3,186.76', label: '万元', title: '年收益' }
]
console.log('[MainContent] 光伏潜力概览数据加载完成:', { data: summaryCards, length: summaryCards.length })

const initCharts = () => {
  console.log('[MainContent] 开始初始化图表...')
  if (energyChart.value) {
    const chart = echarts.init(energyChart.value)
    chart.setOption({
      grid: { top: 30, right: 30, bottom: 40, left: 50 },
      tooltip: { trigger: 'axis' },
      legend: { 
        data: ['预测发电量', '实际发电量'],
        textStyle: { color: '#fff' },
        top: 0
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.3)' } },
        axisLabel: { color: '#fff' }
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.3)' } },
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
    console.log('[MainContent] 发电量趋势分析图表初始化完成')
  }

  if (suitabilityChart.value) {
    const chart = echarts.init(suitabilityChart.value)
    chart.setOption({
      tooltip: { 
        trigger: 'item',
        formatter: '{b}: {c}万m² ({d}%)'
      },
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
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#0d1f35',
            borderWidth: 3
          },
          label: {
            show: true,
            position: 'inside',
            color: '#fff',
            fontSize: 14,
            fontWeight: 'bold',
            formatter: '{c}'
          },
          labelLine: { show: false },
          data: [
            { value: 67.28, name: '总屋顶', itemStyle: { color: '#4fc3f7' } },
            { value: 15.37, name: '非常适宜', itemStyle: { color: '#66bb6a' } },
            { value: 15.37, name: '较适宜', itemStyle: { color: '#81c784' } },
            { value: 24.61, name: '较适宜', itemStyle: { color: '#aed581' } },
            { value: 18.92, name: '一般', itemStyle: { color: '#ffb74d' } },
            { value: 6.07, name: '较不适宜', itemStyle: { color: '#ff8a65' } },
            { value: 2.31, name: '不适宜', itemStyle: { color: '#ef5350' } }
          ]
        }
      ]
    })
    console.log('[MainContent] 适宜性分级统计图表初始化完成')
  }

  if (emissionChart.value) {
    const chart = echarts.init(emissionChart.value)
    chart.setOption({
      grid: { top: 20, right: 100, bottom: 30, left: 50 },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      xAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.3)' } },
        axisLabel: { color: '#fff' },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
      },
      yAxis: {
        type: 'category',
        data: ['实验楼群', '教学楼A区', '学生活动中心', '图书馆', '体育馆'],
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.3)' } },
        axisLabel: { color: '#fff' }
      },
      series: [
        {
          type: 'bar',
          data: [
            { value: 612.48, itemStyle: { color: '#ef5350' } },
            { value: 685.33, itemStyle: { color: '#ff8a65' } },
            { value: 862.54, itemStyle: { color: '#ffb74d' } },
            { value: 961.12, itemStyle: { color: '#4fc3f7' } },
            { value: 1128.35, itemStyle: { color: '#66bb6a' } }
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
    console.log('[MainContent] 碳减排贡献TOP5图表初始化完成')
  }
  console.log('[MainContent] 所有图表初始化完成')
}

onMounted(() => {
  console.log('[MainContent] 组件挂载开始')
  nextTick(() => {
    initCharts()
    window.addEventListener('resize', initCharts)
    console.log('[MainContent] 组件挂载完成，图表初始化触发')
  })
})
</script>

<style scoped>
.main-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.map-section {
  background: rgba(13, 31, 53, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(100, 200, 255, 0.2);
  overflow: hidden;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid rgba(100, 200, 255, 0.1);
}

.search-input {
  width: 300px;
  padding: 8px 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(100, 200, 255, 0.3);
  border-radius: 20px;
  color: #fff;
  font-size: 13px;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #4fc3f7;
  background: rgba(255, 255, 255, 0.15);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.map-tools {
  display: flex;
  gap: 10px;
}

.tool-btn {
  padding: 6px 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(100, 200, 255, 0.3);
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tool-btn:hover {
  background: rgba(100, 200, 255, 0.2);
}

.tool-btn.active {
  background: linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%);
  border-color: #4fc3f7;
}

.map-container {
  position: relative;
  height: 320px;
}

.map-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.map-labels {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.label-item {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  background: rgba(13, 31, 53, 0.8);
  border-radius: 15px;
  border: 1px solid rgba(100, 200, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.label-item:hover,
.label-item.active {
  background: rgba(79, 195, 247, 0.3);
  border-color: #4fc3f7;
}

.label-dot {
  width: 8px;
  height: 8px;
  background: #4fc3f7;
  border-radius: 50%;
  box-shadow: 0 0 8px #4fc3f7;
}

.label-item.active .label-dot {
  background: #66bb6a;
  box-shadow: 0 0 8px #66bb6a;
}

.label-text {
  font-size: 12px;
  color: #fff;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

.stat-card {
  background: rgba(13, 31, 53, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(100, 200, 255, 0.2);
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(79, 195, 247, 0.2);
}

.card-icon {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, rgba(79, 195, 247, 0.2) 0%, rgba(41, 182, 246, 0.1) 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.card-content {
  display: flex;
  flex-direction: column;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #4fc3f7;
  line-height: 1.2;
}

.card-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-left: 2px;
}

.card-title {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 2px;
}

.process-section {
  background: rgba(13, 31, 53, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(100, 200, 255, 0.2);
  padding: 20px;
}

.section-header {
  margin-bottom: 15px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}

.process-steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.process-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}

.step-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 10px;
  border: 2px solid rgba(100, 200, 255, 0.3);
  transition: all 0.3s ease;
}

.process-step.active .step-icon {
  background: linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%);
  border-color: #4fc3f7;
  box-shadow: 0 0 15px rgba(79, 195, 247, 0.5);
}

.step-number {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  background: #1a365d;
  border: 2px solid #4fc3f7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: bold;
  color: #4fc3f7;
}

.process-step.active .step-number {
  background: #4fc3f7;
  color: #0d1f35;
}

.step-title {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 3px;
}

.step-desc {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.step-line {
  position: absolute;
  top: 25px;
  left: 50%;
  width: calc(100% / 6 - 20px);
  height: 2px;
  background: rgba(100, 200, 255, 0.2);
  transform: translateX(50%);
  z-index: 0;
}

.process-step.active ~ .step-line {
  background: linear-gradient(90deg, #4fc3f7, rgba(100, 200, 255, 0.2));
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.chart-card {
  background: rgba(13, 31, 53, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(100, 200, 255, 0.2);
  padding: 15px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.chart-unit {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.chart-container {
  height: 200px;
}

.summary-section {
  background: rgba(13, 31, 53, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(100, 200, 255, 0.2);
  padding: 20px;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 15px;
}

.summary-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(100, 200, 255, 0.1);
}

.summary-icon {
  font-size: 20px;
}

.summary-content {
  display: flex;
  flex-direction: column;
}

.summary-value {
  font-size: 18px;
  font-weight: bold;
  color: #4fc3f7;
}

.summary-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
}

.summary-title {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 2px;
}
</style>
