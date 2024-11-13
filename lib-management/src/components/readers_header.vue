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
    <RouterLink to="/reader/book"><el-menu-item index="1">
      <template #title>All Books</template>
    </el-menu-item></RouterLink>
    <RouterLink to="/reader/lendlist"><el-menu-item index="2">
      <template #title>Lending List</template>
    </el-menu-item></RouterLink>
    <RouterLink to="/reader/repassword"><el-menu-item index="3">
      <template #title>Modify Password</template>
    </el-menu-item></RouterLink>
    <RouterLink to="/reader/info"><el-menu-item index="4">
      <template #title>${readercard.username}</template>
    </el-menu-item></RouterLink>
    <el-menu-item index="5">
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
