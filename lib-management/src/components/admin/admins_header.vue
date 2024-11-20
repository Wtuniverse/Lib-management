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
      <template #title>Book Management</template>
      <RouterLink to="/admin/book"><el-menu-item index="1-1">All Books</el-menu-item></RouterLink>
      <RouterLink to="/admin/bookadd"><el-menu-item index="1-2">Book Add</el-menu-item></RouterLink>
    </el-sub-menu>

    <el-sub-menu index="3">
      <template #title>Lending Management</template>
      <RouterLink to="/admin/lendlist"><el-menu-item index="3-1">Lend List</el-menu-item></RouterLink>
    </el-sub-menu>
    <RouterLink to="/admin/repassword"><el-menu-item index="4">
      <template #title>Modify Password</template>
    </el-menu-item></RouterLink>
    <el-menu-item index="5">
      <template #title>{{ username }}</template>
    </el-menu-item>
    <el-menu-item index="5" @click="logout">
      <template #title>Log Out</template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios';
import router from '@/router';

const activeIndex = ref('1')
const username = ref('');

const fetchUsername = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/current_user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      username.value = response.data.username;
    } catch (error) {
      console.error('Failed to fetch username:', error);
    }
  }
};

onMounted(() => {
  fetchUsername();
});

const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

const logout = () => {
  try {
    localStorage.removeItem('token');  // 尝试删除 token
  } catch (error) {
    console.error('Token removal failed:', error);
    // 这里可以选择记录错误或进行其他处理
  } finally {
    // 无论删除是否成功，始终执行跳转
    router.push({ name: 'index' }).catch(err => {
      console.error('Navigation error:', err);
    });
  }
};
</script>

<style>
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}
</style>
