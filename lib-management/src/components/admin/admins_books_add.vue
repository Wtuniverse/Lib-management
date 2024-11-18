<template>
  <div class="add-book-form">
    <el-form ref="form" :model="formData" :rules="rules" label-width="100px" class="form-container">
      <el-form-item label="Name" prop="name">
        <el-input v-model="formData.name" placeholder="Please send book name"></el-input>
      </el-form-item>

      <el-form-item label="Author" prop="author">
        <el-input v-model="formData.author" placeholder="Please send author"></el-input>
      </el-form-item>

      <el-form-item label="Publish" prop="publish">
        <el-input v-model="formData.publish" placeholder="Please send publish"></el-input>
      </el-form-item>

      <el-form-item label="ISBN" prop="isbn">
        <el-input v-model="formData.isbn" placeholder="Please send ISBN"></el-input>
      </el-form-item>


      <el-form-item label="Price" prop="price">
        <el-input v-model="formData.price" placeholder="Please send price"></el-input>
      </el-form-item>

      <el-form-item label="Number" prop="number">
        <el-input v-model="formData.number" placeholder="Pleaase send number"></el-input>
      </el-form-item>



      <el-form-item>
        <el-button type="primary" @click="submitForm">Add</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { ElForm, ElFormItem, ElInput, ElButton, ElDatePicker } from 'element-plus';

export default {
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    ElDatePicker,
  },
  setup() {
    // Form data model
    const formData = ref({
      name: '',
      author: '',
      publish: '',
      isbn: '',
      price: '',
      number: '',

    });

    // Validation rules
    const rules = ref({
      name: [{ required: true, message: 'Please send book name', trigger: 'blur' }],
      author: [{ required: true, message: 'Please send author', trigger: 'blur' }],
      publish: [{ required: true, message: 'Please send publish', trigger: 'blur' }],
      isbn: [{ required: true, message: 'Please send ISBN', trigger: 'blur' }],
      price: [{ required: true, message: 'Please send price', trigger: 'blur' }],
      number: [{ required: true, message: 'Pleaase send number', trigger: 'blur' }],
    });

    // Submit form handler
    const submitForm = async () => {
      const form = refs.form;
      try {
        // Validate the form
        await form.validate();
        alert('Form submitted successfully.');
        // Here you can handle form submission, like sending data to a server
      } catch (error) {
        console.log('Form validation failed.', error);
      }
    };

    return {
      formData,
      rules,
      submitForm,
    };
  },
};
</script>

<style scoped>
.add-book-form {
  margin-top: 20px;
  max-width: 800px;
  margin: 0 auto;
}
.form-container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}
</style>
