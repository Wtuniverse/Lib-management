<template>
  <div class="login-container">
    <div class="login-content">
      <el-card class="login-card">
        <h2 class="title">{{ isRegister ? 'Register' : 'Login' }}</h2>
        <el-form :model="form" ref="formRef" label-width="80px" class="login-form" @submit.native.prevent="handleSubmit">
          <el-form-item label="Username" prop="username" :rules="usernameRules">
            <el-input v-model="form.username" placeholder="Enter your username" />
          </el-form-item>

          <el-form-item v-if="isRegister" label="Email" prop="email" :rules="emailRules">
            <el-input v-model="form.email" placeholder="Enter your email" />
          </el-form-item>

          <el-form-item label="Password" prop="password" :rules="passwordRules">
            <el-input type="password" v-model="form.password" placeholder="Enter your password" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" native-type="submit" class="login-button" :loading="loading">
              {{ isRegister ? 'Register' : 'Login' }}
            </el-button>
          </el-form-item>
        </el-form>
        <div class="toggle-form">
          <span @click="toggleForm">{{ isRegister ? 'Already have an account? Login' : 'Don\'t have an account? Register' }}</span>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { ElForm, ElFormItem, ElInput, ElButton, ElCard } from 'element-plus';
import axios from 'axios';

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
    const isRegister = ref(false);
    const form = ref({
      username: '',
      password: '',
      email: ''
    });
    const formRef = ref(null);
    const loading = ref(false);

    const usernameRules = [
      { required: true, message: 'Please enter your username', trigger: 'blur' }
    ];

    const emailRules = [
      { required: isRegister.value, message: 'Please enter your email', trigger: 'blur' },
      { type: 'email', message: 'Please enter a valid email address', trigger: 'blur' }
    ];

    const passwordRules = [
      { required: true, message: 'Please enter your password', trigger: 'blur' }
    ];

    const handleSubmit = async () => {
      formRef.value.validate(async (valid) => {
        if (valid) {
          loading.value = true;
          try {
            const response = await axios.post(`http://localhost:5000/${isRegister.value ? 'register' : 'login'}`, form.value);
            const { token, isAdmin } = response.data;
            localStorage.setItem('token', token);
            if (isAdmin) {
              // Redirect to admin dashboard
              window.location.href = '/admin';
            } else {
              // Redirect to user homepage
              window.location.href = '/reader';
            }
          } catch (error) {
            alert('Error: ' + error.response.data);
          } finally {
            loading.value = false;
          }
        } else {
          console.log('Form validation failed.');
          return false;
        }
      });
    };

    const toggleForm = () => {
      isRegister.value = !isRegister.value;
      form.value.email = '';
    };

    return {
      form,
      formRef,
      usernameRules,
      emailRules,
      passwordRules,
      handleSubmit,
      loading,
      isRegister,
      toggleForm
    };
  }
};
</script>


<style scoped>

/* 其他样式保持不变 */
.toggle-form {
  text-align: center;
  margin-top: 20px;
  cursor: pointer;
}
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


