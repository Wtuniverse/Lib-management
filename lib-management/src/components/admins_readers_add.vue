<template>
  <div class="add-reader" :style="backgroundStyle">
    <!-- 顶部 Header -->
    <div id="header"></div>

    <!-- 表单区域 -->
    <div class="form-container">
      <el-card :body-style="{ padding: '20px' }">
        <h3 class="panel-title">Add Reader</h3>
        <el-form :model="form" ref="form" label-width="120px" @submit.native.prevent="submitForm">
          <el-form-item label="Password" :rules="[{ required: true, message: 'Please send password', trigger: 'blur' }]">
            <el-input v-model="form.password" type="password" placeholder="Please send password"></el-input>
          </el-form-item>

          <el-form-item label="Name" :rules="[{ required: true, message: 'Please send name', trigger: 'blur' }]">
            <el-input v-model="form.name" placeholder="Please send name"></el-input>
          </el-form-item>

          <el-form-item label="Sex" :rules="[{ required: true, message: 'Please choose a sex', trigger: 'change' }]">
            <el-radio-group v-model="form.sex">
              <el-radio label="Male">Male</el-radio>
              <el-radio label="Female">Female</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="Birth" :rules="[{ required: true, message: 'Please choose birth', trigger: 'change' }]">
            <el-date-picker v-model="form.birth" type="date" placeholder="Choose birth"></el-date-picker>
          </el-form-item>

          <el-form-item label="Address" :rules="[{ required: true, message: 'Please send address', trigger: 'blur' }]">
            <el-input v-model="form.address" placeholder="Please send Address"></el-input>
          </el-form-item>

          <el-form-item label="Phone" :rules="[{ required: true, message: 'Please send a phone number', trigger: 'blur' }]">
            <el-input v-model="form.phone" placeholder="Please send a phone number"></el-input>
          </el-form-item>

          <el-button type="primary" @click="submitForm">Add</el-button>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { ElCard, ElForm, ElFormItem, ElInput, ElButton, ElDatePicker } from 'element-plus';

export default {
  name: 'AddReader',
  components: {
    ElCard,
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    ElDatePicker
  },
  data() {
    return {
      form: {
        password: '',
        name: '',
        sex: '',
        birth: '',
        address: '',
        phone: ''
      },
      backgroundStyle: {
        background: 'url(img/school.jpg) no-repeat center center fixed',
        backgroundSize: '100% 100%'
      }
    };
  },
  methods: {
    submitForm() {
      // 表单验证逻辑
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 假设通过API发送表单数据
          alert('Reader information has been submitted!');
          console.log(this.form);
          // 这里可以处理表单提交到后台的逻辑
          // 比如 axios.post('/api/reader/add', this.form)
        } else {
          console.log('Form validation failed.');
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.add-reader {
  padding-top: 100px;
  text-align: center;
}

.form-container {
  max-width: 600px;
  margin: 0 auto;
}
</style>
