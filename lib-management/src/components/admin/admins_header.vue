<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item index="0">
      Library Management System
    </el-menu-item>
    <el-sub-menu index="1">
      <template #title>Book Mangment</template>
      <RouterLink to="/admin/book"><el-menu-item index="1-1">All Books</el-menu-item></RouterLink>
      <RouterLink to="/admin/bookadd"><el-menu-item index="1-2">Book Add</el-menu-item></RouterLink>
    </el-sub-menu>

    <el-sub-menu index="3">
      <template #title>Lending Managment</template>
      <RouterLink to="/admin/lendlist" ><el-menu-item index="3-1">Lend List</el-menu-item></RouterLink>
    </el-sub-menu>
    <RouterLink to="/admin/repassword"><el-menu-item index="4">
      <template #title>Modify Password</template>
    </el-menu-item></RouterLink>
    <el-menu-item index="5" @click="showUsernameDialog = true">
      <template #title>{{admin}}</template>
    </el-menu-item>
    <el-menu-item index="6" @click="handleLogout">
      <template #title>Log Out</template>
    </el-menu-item>
  </el-menu>

  <!-- 用户名模态框 -->
  <el-dialog
    title="User Information"
    v-model="showUsernameDialog"
    width="30%"
  >
    <p>Username: {{admin}}</p>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted} from 'vue'
import { RouterLink } from 'vue-router';
import { useRouter } from 'vue-router';
import axios from 'axios';


const activeIndex = ref('1')
const router = useRouter()
const showUsernameDialog = ref(false)
const admin = ref('') // 示例用户名，实际应用中应从状态管理或 API 获取
const token = localStorage.getItem('jwt');  // Make sure to set token after login


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


const fetchUsername = async () => {
  if (!token) {
    console.error('No token found');
    return;
  }

  try {
    const response = await axios.get('http://localhost:5000/api/admin/current_user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    admin.value = response.data.username;  // Set the username upon successful API call
  } catch (error) {
    console.error('Failed to fetch username:');
  }
};
// 在组件挂载时从 localStorage 获取用户信息
onMounted(() => {
  fetchUsername();
  console.log(admin.value)
})

</script>

<style>
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}
</style>
