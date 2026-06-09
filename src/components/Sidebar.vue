<template>
  <aside class="sidebar">
    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li 
          v-for="item in menuItems" 
          :key="item.id" 
          class="nav-item"
          :class="{ active: activeMenu === item.id }"
          @click="activeMenu = item.id"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-text">{{ item.name }}</span>
          <span v-if="item.active" class="nav-dot"></span>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

const activeMenu = ref('home')

const menuItems = [
  { id: 'home', name: '首页', icon: '🏠', active: true },
  { id: 'suitability', name: '适宜性评估', icon: '📊', active: false },
  { id: 'benefit', name: '效益评估', icon: '💰', active: false },
  { id: 'emission', name: '碳减排评估', icon: '🌿', active: false },
  { id: 'decision', name: '决策支持', icon: '🎯', active: false },
  { id: 'visual', name: '可视化分析', icon: '📈', active: false },
  { id: 'operation', name: '运维管理', icon: '⚙️', active: false },
  { id: 'system', name: '系统管理', icon: '🔧', active: false }
]
</script>

<style scoped>
.sidebar {
  width: 75px;
  background: linear-gradient(180deg, #0d1f35 0%, #132743 100%);
  border-right: 1px solid rgba(100, 200, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
}

.sidebar-nav {
  width: 100%;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: rgba(100, 200, 255, 0.1);
}

.nav-item.active {
  background: rgba(100, 200, 255, 0.15);
  border-left-color: #4fc3f7;
}

.nav-icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.nav-text {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
}

.nav-item.active .nav-text {
  color: #4fc3f7;
}

.nav-dot {
  position: absolute;
  top: 10px;
  right: 12px;
  width: 8px;
  height: 8px;
  background: #4fc3f7;
  border-radius: 50%;
  box-shadow: 0 0 8px #4fc3f7;
}
</style>
