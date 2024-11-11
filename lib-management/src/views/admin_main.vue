<template>
  <div id="app">
    <admins_header />
    <div class="content">
      <!-- 其他内容可以放在这里 -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import admins_header from '../components/admins_header.vue';

export default defineComponent({
  name: 'UserPage',
  components: {
    admins_header,
  },
  data() {
    return {
      readerName: 'Reader Name',
    };
  },
  mounted() {
    // 你可以在这里进行其他初始化操作
  },
});
</script>

<style scoped>
.content {
  padding-top: 60px; /* 确认导航栏高度后，进行适当的顶部填充 */
}

.background {
  background-color: #f4f4f9;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
