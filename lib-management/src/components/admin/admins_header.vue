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
    <el-sub-menu index="2">
      <template #title>Reader Managment</template>
      <RouterLink to="/admin/readers"><el-menu-item index="2-1">All Readers</el-menu-item></RouterLink>
      <RouterLink to="/admin/readeradd"><el-menu-item index="2-2">Reader Add</el-menu-item></RouterLink>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>Lending Managment</template>
      <RouterLink to="/admin/lendlist" ><el-menu-item index="3-1">Lend List</el-menu-item></RouterLink>
    </el-sub-menu>
    <RouterLink to="/admin/repassword"><el-menu-item index="4">
      <template #title>Modify Password</template>
    </el-menu-item></RouterLink>
    <el-menu-item index="5">
      <template #title>${admin.username}</template>
    </el-menu-item>
    <el-menu-item index="6">
      <template #title>Log Out</template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router';

const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style>
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}
</style>
