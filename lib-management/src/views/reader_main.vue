<template>
  <div id="app" class="background">
    <readers_header />
    <!-- 其他内容可以放在这里 -->
  </div>
</template>

<script lang="ts">
import readers_header from '../components/readers_header.vue';

export default {
  name: 'UserPage',
  components: {
   readers_header,
  },
  data() {
    return {
      readerName: 'Reader Name', // 这里可以动态绑定 readerName
    };
  },
  mounted() {
    // 你可以在这里进行其他初始化操作
  },
};
</script>

<style scoped>
</style>