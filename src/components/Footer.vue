<template>
  <footer class="footer">
    <div class="footer-left">
      <span class="tech-support">技术支持：兰州财经大学农林经济管理学院</span>
    </div>
    <div class="footer-center">
      <span class="data-time">数据时间：2024-05-20</span>
    </div>
    <div class="footer-right">
      <span class="copyright">© 2024 兰州财经大学 All Rights Reserved</span>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  height: 45px;
  background: linear-gradient(135deg, #0d1f35 0%, #1a365d 50%, #0d1f35 100%);
  border-top: 1px solid rgba(100, 200, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.footer-left,
.footer-center,
.footer-right {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.footer-right {
  font-size: 11px;
}
</style>
