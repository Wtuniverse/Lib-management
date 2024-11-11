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
    <el-menu-item index="1">
      <template #title>Book Mangment</template>
      <el-menu-item index="1-1">All Books</el-menu-item>
      <el-menu-item index="1-2">Book Add</el-menu-item>
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>Reader Managment</template>
      <el-menu-item index="2-1">All Readers</el-menu-item>
      <el-menu-item index="2-2">Reader Add</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>Lending Managment</template>
      <el-menu-item index="3-1">Lend List</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="4">
      <template #title>Modify Password</template>
    </el-sub-menu>
    <el-sub-menu index="5">
      <template #title>${admin.username}</template>
    </el-sub-menu>
    <el-sub-menu index="6">
      <template #title>Log Out</template>
    </el-sub-menu>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

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
