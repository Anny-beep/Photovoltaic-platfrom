<template>
  <div class="system-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">系统管理</h2>
        <el-tag type="warning" effect="dark">系统配置管理</el-tag>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleSave">
          <el-icon><Document /></el-icon>
          保存配置
        </el-button>
      </div>
    </div>

    <!-- 标签页 -->
    <div class="tab-container">
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="用户管理" name="users">
          <div class="tab-content">
            <div class="content-header">
              <el-input
                v-model="searchUser"
                placeholder="搜索用户..."
                :prefix-icon="Search"
                clearable
                style="width: 250px;"
              />
              <el-button type="primary" @click="addUser">
                <el-icon><Plus /></el-icon>
                新增用户
              </el-button>
            </div>
            <div class="table-wrapper">
              <table class="user-table">
                <thead>
                  <tr>
                    <th>用户名</th>
                    <th>邮箱</th>
                    <th>角色</th>
                    <th>部门</th>
                    <th>状态</th>
                    <th>创建时间</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in users" :key="user.id">
                    <td>{{ user.username }}</td>
                    <td>{{ user.email }}</td>
                    <td>
                      <el-tag :type="user.role === 'admin' ? 'danger' : user.role === 'operator' ? 'warning' : 'info'">
                        {{ user.role === 'admin' ? '管理员' : user.role === 'operator' ? '操作员' : '访客' }}
                      </el-tag>
                    </td>
                    <td>{{ user.department }}</td>
                    <td>
                      <span class="status-badge" :class="user.status">{{ user.status === 'active' ? '启用' : '禁用' }}</span>
                    </td>
                    <td>{{ user.createdAt }}</td>
                    <td>
                      <el-button text size="small" @click="editUser(user)">
                        <el-icon><Edit /></el-icon>
                      </el-button>
                      <el-button text size="small" @click="deleteUser(user)">
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="角色权限" name="roles">
          <div class="tab-content">
            <div class="role-list">
              <div class="role-card" v-for="role in roles" :key="role.name">
                <div class="role-header">
                  <span class="role-name">{{ role.label }}</span>
                  <span class="role-desc">{{ role.description }}</span>
                </div>
                <div class="role-permissions">
                  <div class="permission-group" v-for="group in role.permissions" :key="group.name">
                    <div class="group-title">{{ group.name }}</div>
                    <div class="permission-items">
                      <el-tag
                        v-for="perm in group.items"
                        :key="perm"
                        type="info"
                        size="small"
                      >{{ perm }}</el-tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="系统配置" name="config">
          <div class="tab-content">
            <div class="config-section">
              <div class="section-title">基本配置</div>
              <div class="config-form">
                <div class="form-item">
                  <label>系统名称</label>
                  <el-input v-model="config.systemName" />
                </div>
                <div class="form-item">
                  <label>系统版本</label>
                  <el-input v-model="config.version" disabled />
                </div>
                <div class="form-item">
                  <label>数据更新周期</label>
                  <el-select v-model="config.updateInterval">
                    <el-option label="5分钟" value="5" />
                    <el-option label="15分钟" value="15" />
                    <el-option label="1小时" value="60" />
                    <el-option label="24小时" value="1440" />
                  </el-select>
                </div>
                <div class="form-item">
                  <label>自动保存</label>
                  <el-switch v-model="config.autoSave" />
                </div>
              </div>
            </div>

            <div class="config-section">
              <div class="section-title">地图配置</div>
              <div class="config-form">
                <div class="form-item">
                  <label>地图服务地址</label>
                  <el-input v-model="config.mapUrl" />
                </div>
                <div class="form-item">
                  <label>默认缩放级别</label>
                  <el-input-number v-model="config.mapZoom" :min="1" :max="20" />
                </div>
                <div class="form-item">
                  <label>中心点坐标</label>
                  <div class="coord-input">
                    <el-input v-model="config.centerLat" placeholder="纬度" />
                    <el-input v-model="config.centerLng" placeholder="经度" />
                  </div>
                </div>
              </div>
            </div>

            <div class="config-section">
              <div class="section-title">阈值配置</div>
              <div class="config-form">
                <div class="form-item">
                  <label>适宜性高分阈值</label>
                  <el-slider v-model="config.highThreshold" :min="0" :max="100" show-input />
                </div>
                <div class="form-item">
                  <label>适宜性低分阈值</label>
                  <el-slider v-model="config.lowThreshold" :min="0" :max="100" show-input />
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="数据备份" name="backup">
          <div class="tab-content">
            <div class="backup-info">
              <div class="info-card">
                <div class="info-icon">
                  <el-icon><DataBoard /></el-icon>
                </div>
                <div class="info-content">
                  <div class="info-title">数据库备份</div>
                  <div class="info-desc">自动备份每日执行</div>
                  <div class="info-value">上次备份: {{ lastBackup }}</div>
                </div>
              </div>
            </div>
            <div class="backup-actions">
              <el-button type="primary" @click="createBackup">
                <el-icon><Download /></el-icon>
                创建备份
              </el-button>
              <el-button @click="restoreBackup">
                <el-icon><Upload /></el-icon>
                恢复备份
              </el-button>
              <el-button @click="exportData">
                <el-icon><Share /></el-icon>
                导出数据
              </el-button>
            </div>
            <div class="backup-history">
              <div class="history-title">备份历史</div>
              <div class="history-list">
                <div class="history-item" v-for="item in backupHistory" :key="item.id">
                  <div class="history-info">
                    <span class="history-name">{{ item.name }}</span>
                    <span class="history-time">{{ item.time }}</span>
                  </div>
                  <div class="history-size">{{ item.size }}</div>
                  <el-button text size="small" @click="downloadBackup(item)">下载</el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Document, Search, Plus, Edit, Delete, DataBoard, Download, Upload, Share } from '@element-plus/icons-vue'

const activeTab = ref('users')
const searchUser = ref('')

const users = [
  { id: 1, username: 'admin', email: 'admin@lzufe.edu.cn', role: 'admin', department: '信息管理学院', status: 'active', createdAt: '2024-01-01 09:00:00' },
  { id: 2, username: 'operator', email: 'operator@lzufe.edu.cn', role: 'operator', department: '信息管理学院', status: 'active', createdAt: '2024-01-05 10:30:00' },
  { id: 3, username: 'guest', email: 'guest@lzufe.edu.cn', role: 'guest', department: '测试用户', status: 'disabled', createdAt: '2024-01-10 14:00:00' }
]

const roles = [
  {
    name: 'admin',
    label: '管理员',
    description: '拥有系统全部权限',
    permissions: [
      { name: '系统管理', items: ['用户管理', '角色管理', '系统配置', '数据备份'] },
      { name: '业务操作', items: ['评估分析', '报告生成', '数据导出'] }
    ]
  },
  {
    name: 'operator',
    label: '操作员',
    description: '拥有业务操作权限',
    permissions: [
      { name: '业务操作', items: ['评估分析', '报告生成', '数据导出'] }
    ]
  },
  {
    name: 'guest',
    label: '访客',
    description: '仅拥有查看权限',
    permissions: [
      { name: '业务操作', items: ['评估分析', '报告查看'] }
    ]
  }
]

const config = reactive({
  systemName: '光伏潜力评估平台',
  version: '1.0.0',
  updateInterval: '15',
  autoSave: true,
  mapUrl: '',
  mapZoom: 14,
  centerLat: '36.106',
  centerLng: '103.732',
  highThreshold: 80,
  lowThreshold: 40
})

const lastBackup = '2024-01-15 02:00:00'

const backupHistory = [
  { id: 1, name: '自动备份_20240115', time: '2024-01-15 02:00:00', size: '12.5 MB' },
  { id: 2, name: '手动备份_20240114', time: '2024-01-14 16:30:00', size: '11.8 MB' },
  { id: 3, name: '自动备份_20240114', time: '2024-01-14 02:00:00', size: '11.8 MB' }
]

const handleSave = () => { }
const addUser = () => { }
const editUser = (user) => { }
const deleteUser = (user) => { }
const createBackup = () => { }
const restoreBackup = () => { }
const exportData = () => { }
const downloadBackup = (item) => { }
</script>

<style lang="scss" scoped>
.system-view {
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

.tab-container {
  background: rgba(13, 31, 53, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(100, 200, 255, 0.2);
  overflow: hidden;

  .el-tabs__header {
    background: rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid rgba(100, 200, 255, 0.1);
  }

  .el-tabs__item {
    color: rgba(255, 255, 255, 0.7);

    &.is-active {
      color: #4fc3f7;
    }
  }

  .el-tabs__content {
    padding: 20px;
  }
}

.tab-content {
  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
}

.table-wrapper {
  overflow-x: auto;
}

.user-table {
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
    background: rgba(79, 195, 247, 0.1);
  }

  td {
    font-size: 13px;
    color: #fff;

    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;

      &.active {
        background: rgba(102, 187, 106, 0.2);
        color: #66bb6a;
      }

      &.disabled {
        background: rgba(120, 144, 156, 0.2);
        color: #78909c;
      }
    }
  }

  tr:hover {
    background: rgba(79, 195, 247, 0.05);
  }
}

.role-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  .role-card {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    padding: 20px;
    border: 1px solid rgba(100, 200, 255, 0.1);

    .role-header {
      margin-bottom: 15px;

      .role-name {
        font-size: 16px;
        font-weight: 600;
        color: #fff;
        display: block;
      }

      .role-desc {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        margin-top: 5px;
      }
    }

    .role-permissions {
      .permission-group {
        margin-bottom: 15px;

        &:last-child {
          margin-bottom: 0;
        }

        .group-title {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 10px;
        }

        .permission-items {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
      }
    }
  }
}

.config-section {
  margin-bottom: 25px;

  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(100, 200, 255, 0.1);
  }

  .config-form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;

    .form-item {
      label {
        display: block;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 8px;
      }

      .coord-input {
        display: flex;
        gap: 10px;

        .el-input {
          flex: 1;
        }
      }
    }
  }
}

.backup-info {
  margin-bottom: 20px;

  .info-card {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 25px;
    background: rgba(79, 195, 247, 0.1);
    border-radius: 12px;
    border: 1px solid rgba(79, 195, 247, 0.3);

    .info-icon {
      width: 60px;
      height: 60px;
      background: rgba(79, 195, 247, 0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4fc3f7;
      font-size: 28px;
    }

    .info-content {
      .info-title {
        font-size: 16px;
        font-weight: 600;
        color: #fff;
      }

      .info-desc {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.6);
        margin-top: 5px;
      }

      .info-value {
        font-size: 14px;
        color: #4fc3f7;
        margin-top: 5px;
      }
    }
  }
}

.backup-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
}

.backup-history {
  .history-title {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 15px;
  }

  .history-list {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
    overflow: hidden;

    .history-item {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 15px 20px;
      border-bottom: 1px solid rgba(100, 200, 255, 0.1);

      &:last-child {
        border-bottom: none;
      }

      .history-info {
        flex: 1;

        .history-name {
          font-size: 14px;
          color: #fff;
          display: block;
        }

        .history-time {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 3px;
        }
      }

      .history-size {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
}

@media (max-width: 1440px) {
  .role-list {
    grid-template-columns: repeat(1, 1fr);
  }

  .config-form {
    grid-template-columns: 1fr !important;
  }
}
</style>
