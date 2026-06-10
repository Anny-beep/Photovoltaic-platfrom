<template>
  <div class="operation-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">运维管理</h2>
        <el-tag type="info" effect="dark">系统运维支持</el-tag>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新状态
        </el-button>
      </div>
    </div>

    <!-- 状态概览 -->
    <div class="status-overview">
      <div class="status-card success">
        <div class="status-icon">
          <el-icon><CircleCheck /></el-icon>
        </div>
        <div class="status-info">
          <div class="status-value">{{ onlineCount }}</div>
          <div class="status-label">设备在线</div>
        </div>
      </div>
      <div class="status-card warning">
        <div class="status-icon">
          <el-icon><Warning /></el-icon>
        </div>
        <div class="status-info">
          <div class="status-value">{{ warningCount }}</div>
          <div class="status-label">设备告警</div>
        </div>
      </div>
      <div class="status-card danger">
        <div class="status-icon">
          <el-icon><CircleClose /></el-icon>
        </div>
        <div class="status-info">
          <div class="status-value">{{ offlineCount }}</div>
          <div class="status-label">设备离线</div>
        </div>
      </div>
      <div class="status-card info">
        <div class="status-icon">
          <el-icon><Clock /></el-icon>
        </div>
        <div class="status-info">
          <div class="status-value">{{ taskCount }}</div>
          <div class="status-label">待处理任务</div>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 左侧面板 -->
      <div class="left-panel">
        <div class="panel-card">
          <div class="card-header">
            <span class="card-title">设备状态监控</span>
          </div>
          <div class="device-list">
            <div class="device-item" v-for="device in devices" :key="device.id">
              <div class="device-status" :class="device.status"></div>
              <div class="device-info">
                <div class="device-name">{{ device.name }}</div>
                <div class="device-location">{{ device.location }}</div>
              </div>
              <div class="device-metrics">
                <div class="metric">
                  <span class="metric-value">{{ device.power }}</span>
                  <span class="metric-label">功率</span>
                </div>
                <div class="metric">
                  <span class="metric-value">{{ device.temperature }}°C</span>
                  <span class="metric-label">温度</span>
                </div>
              </div>
              <el-button text size="small" @click="viewDevice(device)">
                <el-icon><View /></el-icon>
              </el-button>
            </div>
          </div>
        </div>

        <div class="panel-card">
          <div class="card-header">
            <span class="card-title">实时告警</span>
          </div>
          <div class="alarm-list">
            <div class="alarm-item" v-for="alarm in alarms" :key="alarm.id">
              <div class="alarm-icon" :class="alarm.level">
                <el-icon><Warning /></el-icon>
              </div>
              <div class="alarm-info">
                <div class="alarm-title">{{ alarm.title }}</div>
                <div class="alarm-time">{{ alarm.time }}</div>
              </div>
              <el-button text size="small" @click="handleAlarm(alarm)">
                处理
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧面板 -->
      <div class="right-panel">
        <div class="panel-card">
          <div class="card-header">
            <span class="card-title">任务调度</span>
            <el-button text type="primary" size="small" @click="addTask">
              <el-icon><Plus /></el-icon>
              新建任务
            </el-button>
          </div>
          <div class="task-list">
            <div class="task-item" v-for="task in tasks" :key="task.id">
              <div class="task-header">
                <span class="task-name">{{ task.name }}</span>
                <el-tag :type="task.status === 'running' ? 'success' : task.status === 'pending' ? 'warning' : 'info'" size="small">
                  {{ task.status === 'running' ? '运行中' : task.status === 'pending' ? '待执行' : '已完成' }}
                </el-tag>
              </div>
              <div class="task-info">
                <span>{{ task.schedule }}</span>
                <span>{{ task.lastRun }}</span>
              </div>
              <div class="task-progress">
                <el-progress :percentage="task.progress" :color="task.progress >= 100 ? '#66bb6a' : '#4fc3f7'" :show-text="false" />
              </div>
            </div>
          </div>
        </div>

        <div class="panel-card">
          <div class="card-header">
            <span class="card-title">数据质量监控</span>
          </div>
          <div class="quality-content">
            <div class="quality-item" v-for="item in qualityMetrics" :key="item.name">
              <div class="quality-header">
                <span class="quality-name">{{ item.name }}</span>
                <span class="quality-value" :class="{ warning: item.value < 90 }">{{ item.value }}%</span>
              </div>
              <div class="quality-bar">
                <div class="bar-fill" :style="{ width: item.value + '%', background: item.color }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="panel-card">
          <div class="card-header">
            <span class="card-title">日志管理</span>
            <el-select v-model="logLevel" placeholder="日志级别">
              <el-option label="全部" value="" />
              <el-option label="INFO" value="info" />
              <el-option label="WARN" value="warn" />
              <el-option label="ERROR" value="error" />
            </el-select>
          </div>
          <div class="log-list">
            <div class="log-item" v-for="log in logs" :key="log.id">
              <span class="log-time">{{ log.time }}</span>
              <span class="log-level" :class="log.level">{{ log.level }}</span>
              <span class="log-message">{{ log.message }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Refresh, CircleCheck, Warning, CircleClose, Clock, View, Plus } from '@element-plus/icons-vue'

const onlineCount = '85'
const warningCount = '3'
const offlineCount = '2'
const taskCount = '12'
const logLevel = ref('')

const devices = [
  { id: 1, name: '体育馆逆变器A', location: '体育馆屋顶', power: '156 kW', temperature: 42, status: 'online' },
  { id: 2, name: '图书馆逆变器B', location: '图书馆屋顶', power: '124 kW', temperature: 38, status: 'online' },
  { id: 3, name: '教学楼逆变器C', location: '教学楼A区', power: '98 kW', temperature: 45, status: 'warning' },
  { id: 4, name: '实验楼逆变器D', location: '实验楼群', power: '0 kW', temperature: 28, status: 'offline' },
  { id: 5, name: '活动中心逆变器E', location: '学生活动中心', power: '87 kW', temperature: 40, status: 'online' }
]

const alarms = [
  { id: 1, title: '教学楼逆变器温度过高', time: '2024-01-15 14:32:18', level: 'high' },
  { id: 2, title: '实验楼逆变器通讯中断', time: '2024-01-15 14:28:45', level: 'high' },
  { id: 3, title: '体育馆组件效率下降', time: '2024-01-15 13:15:22', level: 'medium' },
  { id: 4, title: '图书馆逆变器维护提醒', time: '2024-01-15 10:00:00', level: 'low' }
]

const tasks = [
  { id: 1, name: '数据同步任务', schedule: '每小时', lastRun: '14:00', status: 'running', progress: 65 },
  { id: 2, name: '评估报告生成', schedule: '每日02:00', lastRun: '02:00', status: 'completed', progress: 100 },
  { id: 3, name: '设备状态检查', schedule: '每10分钟', lastRun: '14:30', status: 'running', progress: 45 },
  { id: 4, name: '数据备份', schedule: '每日00:00', lastRun: '00:00', status: 'completed', progress: 100 }
]

const qualityMetrics = [
  { name: '数据完整性', value: 98, color: '#66bb6a' },
  { name: '数据准确性', value: 95, color: '#4fc3f7' },
  { name: '数据时效性', value: 88, color: '#ffb74d' },
  { name: '数据一致性', value: 96, color: '#66bb6a' }
]

const logs = [
  { id: 1, time: '14:35:22', level: 'info', message: '系统状态检查完成' },
  { id: 2, time: '14:35:18', level: 'info', message: '数据同步开始' },
  { id: 3, time: '14:35:15', level: 'warn', message: '实验楼设备通讯异常' },
  { id: 4, time: '14:35:12', level: 'error', message: '教学楼逆变器温度告警' },
  { id: 5, time: '14:35:08', level: 'info', message: '任务调度器运行正常' }
]

const handleRefresh = () => { }
const viewDevice = (device) => { }
const handleAlarm = (alarm) => { }
const addTask = () => { }
</script>

<style lang="scss" scoped>
.operation-view {
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

.status-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;

  .status-card {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 20px;
    background: rgba(13, 31, 53, 0.8);
    border-radius: 12px;
    border: 1px solid rgba(100, 200, 255, 0.2);

    &.success {
      border-color: rgba(102, 187, 106, 0.4);
      .status-icon { background: rgba(102, 187, 106, 0.2); color: #66bb6a; }
    }

    &.warning {
      border-color: rgba(255, 183, 77, 0.4);
      .status-icon { background: rgba(255, 183, 77, 0.2); color: #ffb74d; }
    }

    &.danger {
      border-color: rgba(239, 83, 80, 0.4);
      .status-icon { background: rgba(239, 83, 80, 0.2); color: #ef5350; }
    }

    &.info {
      border-color: rgba(79, 195, 247, 0.4);
      .status-icon { background: rgba(79, 195, 247, 0.2); color: #4fc3f7; }
    }

    .status-icon {
      width: 50px;
      height: 50px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .status-info {
      .status-value {
        font-size: 28px;
        font-weight: bold;
        color: #fff;
      }

      .status-label {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.6);
      }
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

.device-list {
  padding: 15px;

  .device-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    margin-bottom: 10px;

    .device-status {
      width: 12px;
      height: 12px;
      border-radius: 50%;

      &.online { background: #66bb6a; box-shadow: 0 0 8px #66bb6a; }
      &.warning { background: #ffb74d; box-shadow: 0 0 8px #ffb74d; }
      &.offline { background: #78909c; }
    }

    .device-info {
      flex: 1;

      .device-name {
        font-size: 14px;
        font-weight: 600;
        color: #fff;
      }

      .device-location {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
        margin-top: 3px;
      }
    }

    .device-metrics {
      display: flex;
      gap: 20px;

      .metric {
        text-align: center;

        .metric-value {
          font-size: 14px;
          font-weight: 600;
          color: #4fc3f7;
          display: block;
        }

        .metric-label {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
        }
      }
    }
  }
}

.alarm-list {
  padding: 15px;

  .alarm-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    margin-bottom: 10px;
    border-left: 3px solid;

    &:nth-child(1) { border-color: #ef5350; }
    &:nth-child(2) { border-color: #ef5350; }
    &:nth-child(3) { border-color: #ffb74d; }
    &:nth-child(4) { border-color: #4fc3f7; }

    .alarm-icon {
      font-size: 18px;

      &.high { color: #ef5350; }
      &.medium { color: #ffb74d; }
      &.low { color: #4fc3f7; }
    }

    .alarm-info {
      flex: 1;

      .alarm-title {
        font-size: 13px;
        color: #fff;
      }

      .alarm-time {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.5);
        margin-top: 3px;
      }
    }
  }
}

.task-list {
  padding: 15px;

  .task-item {
    padding: 15px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    margin-bottom: 10px;

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      .task-name {
        font-size: 14px;
        font-weight: 600;
        color: #fff;
      }
    }

    .task-info {
      display: flex;
      gap: 20px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 10px;
    }

    .task-progress {
      .el-progress {
        height: 6px;
      }
    }
  }
}

.quality-content {
  padding: 15px;

  .quality-item {
    margin-bottom: 15px;

    &:last-child {
      margin-bottom: 0;
    }

    .quality-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;

      .quality-name {
        font-size: 13px;
        color: #fff;
      }

      .quality-value {
        font-size: 13px;
        font-weight: 600;
        color: #66bb6a;

        &.warning {
          color: #ffb74d;
        }
      }
    }

    .quality-bar {
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
  }
}

.log-list {
  padding: 15px;
  max-height: 200px;
  overflow-y: auto;

  .log-item {
    display: flex;
    gap: 15px;
    padding: 10px 0;
    border-bottom: 1px solid rgba(100, 200, 255, 0.1);
    font-size: 12px;

    .log-time {
      color: rgba(255, 255, 255, 0.5);
      min-width: 70px;
    }

    .log-level {
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
      min-width: 50px;
      text-align: center;

      &.info { background: rgba(79, 195, 247, 0.2); color: #4fc3f7; }
      &.warn { background: rgba(255, 183, 77, 0.2); color: #ffb74d; }
      &.error { background: rgba(239, 83, 80, 0.2); color: #ef5350; }
    }

    .log-message {
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

@media (max-width: 1440px) {
  .status-overview {
    grid-template-columns: repeat(2, 1fr);
  }

  .main-content {
    grid-template-columns: 1fr;
  }
}
</style>
