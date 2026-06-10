<template>
  <aside class="sidebar">
    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li 
          v-for="item in menuItems" 
          :key="item.name" 
          class="nav-item"
          :class="{ active: $route.name === item.name }"
        >
          <router-link :to="item.path" class="nav-link">
            <el-icon :size="24">
              <component :is="item.icon" />
            </el-icon>
            <span class="nav-text">{{ item.label }}</span>
            <span v-if="item.active" class="nav-dot"></span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { HomeFilled, DataAnalysis, Money, Guide, Aim, DataLine, Tools, Setting } from '@element-plus/icons-vue'

const menuItems = [
  { name: 'Home', label: '首页', path: '/home', icon: HomeFilled, active: true },
  { name: 'Suitability', label: '适宜性评估', path: '/suitability', icon: DataAnalysis, active: false },
  { name: 'Benefit', label: '效益评估', path: '/benefit', icon: Money, active: false },
  { name: 'Emission', label: '碳减排评估', path: '/emission', icon: Guide, active: false },
  { name: 'Decision', label: '决策支持', path: '/decision', icon: Aim, active: false },
  { name: 'Visual', label: '可视化分析', path: '/visual', icon: DataLine, active: false },
  { name: 'Operation', label: '运维管理', path: '/operation', icon: Tools, active: false },
  { name: 'System', label: '系统管理', path: '/system', icon: Setting, active: false }
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
