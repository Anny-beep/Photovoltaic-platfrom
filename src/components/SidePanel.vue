<template>
  <aside class="side-panel">
    <div class="panel-section notices-section">
      <div class="section-header">
        <span class="section-title">平台公告</span>
        <button class="more-btn">更多</button>
      </div>
      <div class="notices-list">
        <div class="notice-item" v-for="notice in notices" :key="notice.id">
          <span class="notice-icon">📌</span>
          <div class="notice-content">
            <span class="notice-title">{{ notice.title }}</span>
            <span class="notice-date">{{ notice.date }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="panel-section quick-entrance">
      <div class="section-header">
        <span class="section-title">快捷入口</span>
      </div>
      <div class="entrance-grid">
        <div 
          class="entrance-item" 
          v-for="item in entranceItems" 
          :key="item.title"
          @click="handleEntranceClick(item.title)"
        >
          <span class="entrance-icon">{{ item.icon }}</span>
          <span class="entrance-text">{{ item.title }}</span>
        </div>
      </div>
    </div>

    <div class="panel-section data-statistics">
      <div class="section-header">
        <span class="section-title">数据统计</span>
      </div>
      <div ref="pieChart" class="pie-chart-container"></div>
      <div class="legend-list">
        <div class="legend-item" v-for="item in legendItems" :key="item.name">
          <span class="legend-color" :style="{ background: item.color }"></span>
          <span class="legend-name">{{ item.name }}</span>
          <span class="legend-value">{{ item.value }}</span>
        </div>
      </div>
    </div>

    <div class="panel-section 3d-preview">
      <div class="section-header">
        <span class="section-title">三维场景预览</span>
      </div>
      <div class="preview-container">
        <img 
          src="https://neeko-copilot.bytedance.net/api/text_to_image?prompt=3d%20building%20visualization%20with%20solar%20panels%20aerial%20view%20campus&image_size=portrait_4_3" 
          alt="三维预览" 
          class="preview-image"
        />
        <button class="preview-btn">
          <span class="play-icon">▶</span>
          <span class="btn-text">进入三维场景</span>
        </button>
        <div class="preview-hint">
          <span class="hint-icon">👆</span>
          <span class="hint-text">全屏预览</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const pieChart = ref(null)

const notices = [
  { id: 1, title: '关于2024年光伏数据更新的通知', date: '05-18' },
  { id: 2, title: '平台功能升级说明', date: '05-15' },
  { id: 3, title: '关于开展光伏实地调研的通知', date: '05-12' },
  { id: 4, title: '平台功能升级说明', date: '05-12' },
  { id: 5, title: '校园排期子库更新说明', date: '05-10' }
]
console.log('[SidePanel] 平台公告数据加载完成:', { data: notices, length: notices.length })

const entranceItems = [
  { icon: '📊', title: '适宜性评估' },
  { icon: '📈', title: '效益评估' },
  { icon: '🌿', title: '碳减排评估' },
  { icon: '🎯', title: '三维场景' },
  { icon: '📄', title: '专题制作' },
  { icon: '📤', title: '报告导出' }
]
console.log('[SidePanel] 快捷入口数据加载完成:', { data: entranceItems, length: entranceItems.length })

const legendItems = [
  { name: '体育馆', value: '22.6%', color: '#4fc3f7' },
  { name: '图书馆', value: '18.7%', color: '#81c784' },
  { name: '教学楼', value: '24.5%', color: '#ffb74d' },
  { name: '学生公寓', value: '14.9%', color: '#ff8a65' },
  { name: '实验楼', value: '12.4%', color: '#ef5350' },
  { name: '其他', value: '6.9%', color: '#9575cd' }
]
console.log('[SidePanel] 数据统计图例数据加载完成:', { data: legendItems, length: legendItems.length })

const handleEntranceClick = (title) => {
  console.log('Clicked:', title)
}

const initPieChart = () => {
  console.log('[SidePanel] 开始初始化饼图...')
  if (pieChart.value) {
    const chart = echarts.init(pieChart.value)
    chart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {d}%'
      },
      series: [
        {
          type: 'pie',
          radius: ['55%', '80%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#1a365d',
            borderWidth: 2
          },
          label: { show: false },
          labelLine: { show: false },
          data: [
            { value: 22.6, name: '体育馆', itemStyle: { color: '#4fc3f7' } },
            { value: 18.7, name: '图书馆', itemStyle: { color: '#81c784' } },
            { value: 24.5, name: '教学楼', itemStyle: { color: '#ffb74d' } },
            { value: 14.9, name: '学生公寓', itemStyle: { color: '#ff8a65' } },
            { value: 12.4, name: '实验楼', itemStyle: { color: '#ef5350' } },
            { value: 6.9, name: '其他', itemStyle: { color: '#9575cd' } }
          ]
        }
      ]
    })
    console.log('[SidePanel] 数据统计饼图初始化完成')
  }
}

onMounted(() => {
  console.log('[SidePanel] 组件挂载开始')
  nextTick(() => {
    initPieChart()
    window.addEventListener('resize', initPieChart)
    console.log('[SidePanel] 组件挂载完成，饼图初始化触发')
  })
})
</script>

<style scoped>
.side-panel {
  width: 280px;
  background: linear-gradient(180deg, #0d1f35 0%, #132743 100%);
  border-left: 1px solid rgba(100, 200, 255, 0.2);
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
}

.panel-section {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  border: 1px solid rgba(100, 200, 255, 0.15);
  padding: 12px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.more-btn {
  font-size: 12px;
  color: #4fc3f7;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.more-btn:hover {
  text-decoration: underline;
}

.notices-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notice-item {
  display: flex;
  gap: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.notice-item:hover {
  background: rgba(79, 195, 247, 0.1);
}

.notice-icon {
  font-size: 12px;
  flex-shrink: 0;
}

.notice-content {
  display: flex;
  flex-direction: column;
}

.notice-title {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notice-date {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 3px;
}

.entrance-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.entrance-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(100, 200, 255, 0.1);
}

.entrance-item:hover {
  background: rgba(79, 195, 247, 0.15);
  border-color: rgba(79, 195, 247, 0.3);
}

.entrance-icon {
  font-size: 20px;
  margin-bottom: 5px;
}

.entrance-text {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
}

.pie-chart-container {
  height: 140px;
  margin-bottom: 10px;
}

.legend-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-name {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  flex: 1;
}

.legend-value {
  font-size: 12px;
  color: #4fc3f7;
  font-weight: 600;
}

.preview-container {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.preview-btn {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: rgba(79, 195, 247, 0.9);
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.preview-btn:hover {
  background: #4fc3f7;
  transform: translateX(-50%) scale(1.05);
}

.play-icon {
  font-size: 14px;
  color: #fff;
}

.btn-text {
  font-size: 13px;
  color: #fff;
  font-weight: 500;
}

.preview-hint {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
}

.hint-icon {
  font-size: 12px;
}

.hint-text {
  font-size: 11px;
  color: #fff;
}
</style>
