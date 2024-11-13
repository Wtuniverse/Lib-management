<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item index="0">
      My Library
    </el-menu-item>
    <el-menu-item index="1">
      <template #title>Book Seaeching</template>
    </el-menu-item>
    <el-sub-menu index="3">
      <template #title>Reader Information</template>
    </el-sub-menu>
    <el-sub-menu index="4">
      <template #title><RouterLink to="/reader/repassword">Modify Password</RouterLink></template>
    </el-sub-menu>
    <el-sub-menu index="5">
      <template #title><RouterLink to="/reader/info">${readercard.username}</RouterLink></template>
    </el-sub-menu>
    <el-sub-menu index="6">
      <template #title>Log Out</template>
    </el-sub-menu>
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
