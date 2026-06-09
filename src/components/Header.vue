<template>
  <header class="header">
    <div class="header-left">
      <div class="logo">
        <img src="https://neeko-copilot.bytedance.net/api/text_to_image?prompt=university%20logo%20with%20sun%20and%20building%20icon%20blue%20color&image_size=square" alt="Logo" class="logo-img" />
        <div class="logo-text">
          <span class="logo-title">兰州财经大学</span>
          <span class="logo-subtitle">周边公共建筑屋顶光伏潜力评估与碳减排决策平台</span>
        </div>
      </div>
    </div>
    <div class="header-right">
      <div class="weather-info">
        <span class="weather-icon">☀️</span>
        <span class="weather-text">18-28°C</span>
        <span class="location-text">晴 | 西北风2级</span>
      </div>
      <div class="time-info">
        <span class="time">{{ currentTime }}</span>
        <span class="date">{{ currentDate }}</span>
      </div>
      <div class="user-info">
        <span class="user-icon">👤</span>
        <span class="user-name">管理员</span>
        <span class="user-arrow">▼</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentTime = ref('')
const currentDate = ref('')

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour12: false })
  currentDate.value = now.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    weekday: 'short'
  })
}

let timer = null

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.header {
  height: 65px;
  background: linear-gradient(135deg, #0d1f35 0%, #1a365d 50%, #0d1f35 100%);
  border-bottom: 1px solid rgba(100, 200, 255, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 20px rgba(0, 150, 255, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-img {
  width: 45px;
  height: 45px;
  border-radius: 8px;
  background: linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%);
  padding: 5px;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}

.logo-subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 30px;
}

.weather-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 13px;
}

.weather-icon {
  font-size: 20px;
}

.weather-text {
  font-weight: 600;
  color: #4fc3f7;
}

.location-text {
  color: rgba(255, 255, 255, 0.6);
}

.time-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  color: #fff;
}

.time {
  font-size: 20px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  color: #4fc3f7;
}

.date {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  background: rgba(100, 200, 255, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(100, 200, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-info:hover {
  background: rgba(100, 200, 255, 0.2);
}

.user-icon {
  font-size: 16px;
}

.user-name {
  font-size: 13px;
  color: #fff;
}

.user-arrow {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
}
</style>
