<template>
  <div class="login-container">
    <div class="login-content">
      <el-card class="login-card">
        <h2 class="title">Login</h2>
        <el-form :model="form" ref="formRef" label-width="80px" class="login-form" @submit.native.prevent="handleSubmit">
          <el-form-item label="Username" prop="username" :rules="usernameRules">
            <el-input v-model="form.username" placeholder="Enter your username" />
          </el-form-item>

          <el-form-item label="Password" prop="password" :rules="passwordRules">
            <el-input type="password" v-model="form.password" placeholder="Enter your password" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" native-type="submit" class="login-button" :loading="loading">
              Login
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { ElForm, ElFormItem, ElInput, ElButton, ElCard } from 'element-plus';

export default {
  name: 'LoginPage',
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    ElCard
  },
  setup() {
    const form = ref({
      username: '',
      password: ''
    });

    const formRef = ref(null);
    const loading = ref(false);  // 用于按钮的 loading 状态

    // 更具描述性的错误信息
    const usernameRules = [
      { required: true, message: 'Please enter your username', trigger: 'blur' }
    ];

    const passwordRules = [
      { required: true, message: 'Please enter your password', trigger: 'blur' }
    ];

    // 提交表单
    const handleSubmit = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          loading.value = true;  // 开始加载状态
          // 模拟请求处理（比如发送请求到后端）
          setTimeout(() => {
            loading.value = false;  // 请求结束，关闭加载状态
            alert('Login successful');
            // 在这里处理登录逻辑，比如跳转到首页或其他操作
          }, 1000);
        } else {
          console.log('Form validation failed.');
          return false;
        }
      });
    };

    return {
      form,
      formRef,
      usernameRules,
      passwordRules,
      handleSubmit,
      loading
    };
  }
};
</script>

<style scoped>
/* 设置整个页面的背景图片 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url('../assets/1706753915154946.jpg') no-repeat center center;
  background-size: cover;  /* 背景图片覆盖整个页面 */
  width: 1200px;
}

/* 设置居中容器 */
.login-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

/* 设置登录卡片样式 */
.login-card {
  width: 400px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.8);  /* 半透明背景，确保背景图片不影响卡片内容 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.login-form .el-form-item {
  margin-bottom: 20px;
}

.login-button {
  width: 100%;
}
</style>


