<template>
  <div class="reader-management">
    <!-- 信息提示 -->
    <el-alert
      v-if="info"
      title="Info"
      type="info"
      :description="info"
      closable
      @close="info = ''"
    ></el-alert>

    <!-- 成功提示 -->
    <el-alert
      v-if="succ"
      title="Success"
      type="success"
      :description="succ"
      closable
      @close="succ = ''"
    ></el-alert>

    <!-- 错误提示 -->
    <el-alert
      v-if="error"
      title="Error"
      type="error"
      :description="error"
      closable
      @close="error = ''"
    ></el-alert>

    <!-- 读者表格 -->
    <el-table :data="readers" style="width: 100%" border>
      <el-table-column prop="readerId" label="ID" width="120"></el-table-column>
      <el-table-column prop="name" label="Name" width="120"></el-table-column>
      <el-table-column prop="sex" label="Sex" width="80"></el-table-column>
      <el-table-column prop="birth" label="Birth" width="150"></el-table-column>
      <el-table-column prop="address" label="Address" width="200"></el-table-column>
      <el-table-column prop="phone" label="Phone" width="150"></el-table-column>

      <!-- 编辑操作 -->
      <el-table-column label="Edit" width="100">
        <template v-slot="scope">
          <el-button @click="openEditDialog(scope.row)" type="primary" size="small">Edit</el-button>
        </template>
      </el-table-column>

      <!-- 删除操作 -->
      <el-table-column label="Delete" width="100">
        <template v-slot="scope">
          <el-button @click="deleteReader(scope.row.readerId)" type="danger" size="small">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑读者信息的对话框 -->
    <el-dialog
      title="Edit reader"
      :visible.sync="dialogVisible"
      width="500px"
      @close="resetForm"
    >
      <el-form :model="currentReader" ref="form" label-width="100px">
        <el-form-item label="Name">
          <el-input v-model="currentReader.name" placeholder="Please send name"></el-input>
        </el-form-item>
        <el-form-item label="Sex">
          <el-select v-model="currentReader.sex" placeholder="Please choose a sex">
            <el-option label="Male" value="Male"></el-option>
            <el-option label="Female" value="Female"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Birth">
          <el-date-picker v-model="currentReader.birth" type="date" placeholder="Choose Birth"></el-date-picker>
        </el-form-item>
        <el-form-item label="Address">
          <el-input v-model="currentReader.address" placeholder="Please send address"></el-input>
        </el-form-item>
        <el-form-item label="Phone">
          <el-input v-model="currentReader.phone" placeholder="Please send phone number"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveReader">Save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { ref } from 'vue';
import { ElTable, ElTableColumn, ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElDatePicker, ElAlert } from 'element-plus';

export default {
  name: 'ReaderManagement',
  components: {
    ElTable,
    ElTableColumn,
    ElButton,
    ElDialog,
    ElForm,
    ElFormItem,
    ElInput,
    ElSelect,
    ElOption,
    ElDatePicker,
    ElAlert
  },
  data() {
    return {
      readers: [
        { readerId: 1, name: '张三', sex: '男', birth: '2000-01-01', address: '北京市', phone: '13800000000' },
        { readerId: 2, name: '李四', sex: '女', birth: '1995-05-20', address: '上海市', phone: '13900000000' }
        // 这里假设是从后台接口获取的读者信息
      ],
      dialogVisible: false,
      currentReader: {},
      info: '', // 信息提示
      succ: '', // 成功提示
      error: '' // 错误提示
    };
  },
  methods: {
    // 打开编辑对话框
    openEditDialog(reader) {
      this.currentReader = { ...reader }; // 复制一份数据来编辑
      this.dialogVisible = true;
    },

    // 保存编辑后的读者信息
    saveReader() {
      // 假设这里调用API保存数据
      const index = this.readers.findIndex(reader => reader.readerId === this.currentReader.readerId);
      if (index !== -1) {
        this.readers[index] = { ...this.currentReader };
        this.succ = 'Reader information has been updated!';
      }
      this.dialogVisible = false;
    },

    // 重置表单
    resetForm() {
      this.currentReader = {};
    },

    // 删除读者
    deleteReader(readerId) {
      this.readers = this.readers.filter(reader => reader.readerId !== readerId);
      this.succ = 'Reader has been deleted!';
    }
  }
};
</script>

<style scoped>
.reader-management {
  padding: 20px;
}
</style>
