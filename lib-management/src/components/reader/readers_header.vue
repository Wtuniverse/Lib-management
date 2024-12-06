<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >

    <RouterLink to="/reader/introduce">
        <el-menu-item index="0">
          <template #title> Welcome To Library System</template>
        </el-menu-item>
    </RouterLink>
    <RouterLink to="/reader/book">
      <el-menu-item index="1">
        <template #title>Searching Books</template>
      </el-menu-item>
    </RouterLink>
    <RouterLink to="/reader/lendlist">
      <el-menu-item index="2">
        <template #title>My Lending List</template>
      </el-menu-item>
    </RouterLink>
    <RouterLink to="/reader/repassword">
      <el-menu-item index="3">
        <template #title>Modify Password</template>
      </el-menu-item>
    </RouterLink>
    <RouterLink to="/reader/info">
      <el-menu-item index="4">
        {{ username }}
      </el-menu-item>
    </RouterLink>
    <el-menu-item index="5" @click="logout">
      <template #title>Log Out</template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import router from '@/router';

const activeIndex = ref('1');
const username = ref('');  // State for storing the username
const token = localStorage.getItem('jwt');  // Make sure to set token after login

// Function to fetch username from the backend
const fetchUsername = async () => {
  if (!token) {
    console.error('No token found');
    return;
  }

  try {
    const response = await axios.get('http://localhost:5000/api/user/current_user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    username.value = response.data.username;  // Set the username upon successful API call
  } catch (error) {
    console.error('Failed to fetch username:');
  }
};

onMounted(() => {
  fetchUsername();  // Fetch username when the component is mounted
});

const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

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
