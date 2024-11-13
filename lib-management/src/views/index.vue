<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="title">login</h2>
      <el-form :model="form" ref="formRef" label-width="80px" class="login-form" @submit.native.prevent="handleSubmit">
        <el-form-item label="Username" prop="username" :rules="usernameRules">
          <el-input v-model="form.username" placeholder="Username" />
        </el-form-item>

        <el-form-item label="Password" prop="password" :rules="passwordRules">
          <el-input type="password" v-model="form.password" placeholder="Password" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" native-type="submit" class="login-button">
            Login
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
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

    const usernameRules = [
      { required: true, message: 'Username', trigger: 'blur' }
    ];

    const passwordRules = [
      { required: true, message: 'Password', trigger: 'blur' }
    ];

    const handleSubmit = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          alert('Login success');
          // 这里可以处理登录逻辑，例如向后端发送请求
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
      handleSubmit
    };
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-card {
  width: 400px;
  padding: 30px;
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

