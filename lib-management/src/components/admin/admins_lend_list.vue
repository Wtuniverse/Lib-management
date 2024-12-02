<template>
  <div>
    <!-- Header部分 -->
    <div id="header" ref="header"></div>

    <!-- 提示信息 -->
    <el-alert
      v-if="successMessage"
      title="Success"
      type="success"
      :closable="false"
      class="mb-4"
    >
      {{ successMessage }}
    </el-alert>

    <el-alert
      v-if="errorMessage"
      title="Error"
      type="error"
      :closable="false"
      class="mb-4"
    >
      {{ errorMessage }}
    </el-alert>

    <!-- 借还日志表格 -->
    <el-card>
      <div slot="header">
        <span>My Borrowed Books</span>
      </div>
      <el-table :data="loanLogs" style="width: 100%" stripe>
        <el-table-column label="Reader ID" prop="readerId" />
        <el-table-column label="Book ID" prop="bookId" />
        <el-table-column label="Lend Date" prop="lendDate" />
        <el-table-column label="Back Date" prop="backDate" />
        <el-table-column label="Situation">
          <template #default="{ row }">
            <span v-if="!row.backDate">Lending</span>
            <span v-else>Returned</span>
            <span v-if="!row.backDate && isOverdue(row)">/ Overdue</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="Actions">
          <template #default="{ row, $index }">
            <el-button type="text" size="small" @click="deleteRecord($index)">Delete</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { ElAlert, ElTable, ElTableColumn, ElCard, ElButton } from 'element-plus';
import dayjs from 'dayjs';  // 引入 dayjs 库
import 'element-plus/dist/index.css';

export default {
  name: 'LoanLog',
  setup() {
    // 数据状态
    const loanLogs = ref([
      {
        readerId: 'R001',  // 读者ID
        bookId: 'B001',
        lendDate: '2024-10-01',
        backDate: '',
      },
      {
        readerId: 'R002',  // 读者ID
        bookId: 'B002',
        lendDate: '2024-09-15',
        backDate: '2024-10-10',
      },
      {
        readerId: 'R003',  // 读者ID
        bookId: 'B003',
        lendDate: '2024-08-01',
        backDate: '',
      },
    ]);

    const successMessage = ref('Data loaded successfully!');
    const errorMessage = ref('');

    // 判断是否超期
    const isOverdue = (log) => {
      const currentTime = dayjs();
      const lendDate = dayjs(log.lendDate);
      const loanPeriod = 30; // 假设借期为30天
      return currentTime.diff(lendDate, 'day') > loanPeriod;
    };

    // 删除记录
    const deleteRecord = (index) => {
      loanLogs.value.splice(index, 1); // 删除对应索引的记录
      successMessage.value = 'Record deleted successfully!';
    };

    // 动态加载头部内容
    onMounted(() => {
      const header = document.querySelector('#header');
      if (header) {
        header.innerHTML = '<h1>My Borrowed Books</h1>';
      }
    });

    return {
      loanLogs,
      successMessage,
      errorMessage,
      isOverdue,
      deleteRecord,
    };
  },
};
</script>

<style scoped>
#header {
  text-align: center;
  margin-bottom: 20px;
}

.el-alert {
  margin-bottom: 20px;
}

.el-button {
  margin-left: 10px;
}
</style>
