<template>
  <div>
    <!-- 主体内容 -->
    <el-row>
      <el-col :span="24">
        <el-row>
          <el-col :span="24">
            <el-card class="card">
              <template #header>
                <span class="card-title">Book Management</span>
              </template>
              <div class="text item">
                <p>Book List: Display all books, can perform operations such as search, modify, delete</p>
                <p>Book Add: Add new books</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="24">
            <el-card class="card">
              <template #header>
                <span class="card-title">Lending Management</span>
              </template>
              <div class="text item">
                <p>Lend List: Display all lend records, can perform operations such as modify, delete</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-card class="card">
              <template #header>
                <span class="card-title">Password Management</span>
              </template>
              <div class="text item">
                <p>Admins can modify their passwords here</p>
              </div>
            </el-card>
          </el-col>
          <el-col :span="24">
            <el-card class="card">
              <template #header>
                <span class="card-title">Username Management</span>
              </template>
              <div class="text item">
                <p>Show user's name when they successfully login</p>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import { RouterLink } from 'vue-router'
  import { useRouter } from 'vue-router'
  
  const activeIndex = ref('1')
  const router = useRouter()
  const showUsernameDialog = ref(false)
  const admin = ref({ username: '' }) // 示例用户名，实际应用中应从状态管理或 API 获取
  
  const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }
  
  const handleLogout = () => {
    // 清除用户状态，例如 tokens，localStorage，sessionStorage 等
    // 这里是示例代码，具体取决于你的实现
    localStorage.removeItem('user')
  
    // 重定向到登录页面
    router.push({ name: 'index' }) // 使用路由的名称进行重定向
  }
  
  // 在组件挂载时从 localStorage 获取用户信息
  onMounted(() => {
    const user = localStorage.getItem('user')
    if (user) {
      admin.value = JSON.parse(user)
    }
    console.log(admin)
  })
  </script>
  
  <style>
  .card-title {
    color: #fbfbfc; /* 文字颜色为白色 */
    background-color: rgb(113, 179, 237); /* 背景颜色为蓝色 */
    font-weight: bold;
    border-left: 2px solid #2c3e50; /* 左边框 */
    border-right: 2px solid #2c3e50; /* 右边框 */
    padding: 8px 16px;
  }
  
  .card {
    width: 75%; /* 宽度为100% */
    height: 180px; /* 固定高度 */
    margin-bottom: 20px; /* 间距 */
  }
  
  .el-card__header {
    background-color: #0d7ff0; /* 背景颜色 */
    border-bottom: 1px solid #ebeef5; /* 底部边框 */
  }
  
  .el-card__body {
    padding: 20px;
  }
  
  .text {
    text-align: center;
  }
  
  .item {
    margin-bottom: 10px;
  }
  </style>