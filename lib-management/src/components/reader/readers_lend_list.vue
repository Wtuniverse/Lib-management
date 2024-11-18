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
        <span>My lend list</span>
      </div>
      <el-table :data="loanLogs" style="width: 100%" stripe>
        <el-table-column label="bookID" prop="bookId" />
        <el-table-column label="lendDate" prop="lendDate" />
        <el-table-column label="backDate" prop="backDate" />
        <el-table-column label="Situation">
          <template #default="{ row }">
            <span v-if="!row.backDate">Lending</span>
            <span v-else>Returned</span>
            <span v-if="!row.backDate && isOverdue(row)">/ Overdue</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { ElAlert, ElTable, ElTableColumn, ElCard } from 'element-plus';
import 'element-plus/dist/index.css';

export default {
  name: 'LoanLog',
  setup() {
    // 数据状态
    const loanLogs = ref([
      {
        bookId: 'B001',
        lendDate: '2024-10-01',
        backDate: '',
      },
      {
        bookId: 'B002',
        lendDate: '2024-09-15',
        backDate: '2024-10-10',
      },
      {
        bookId: 'B003',
        lendDate: '2024-08-01',
        backDate: '',
      },
    ]);

    const successMessage = ref('');
    const errorMessage = ref('');

    // 判断是否超期
    const isOverdue = (log) => {
      const currentTime = new Date().getTime();
      const lendDate = new Date(log.lendDate).getTime();
      const loanPeriod = 30 * 24 * 60 * 60 * 1000; // 假设借期为30天

      return currentTime - lendDate > loanPeriod;
    };

    // 动态加载头部内容
    onMounted(() => {
      const header = document.querySelector('#header');
      if (header) {
        header.innerHTML = '<h1>Lend Lists</h1>';
      }
    });

    return {
      loanLogs,
      successMessage,
      errorMessage,
      isOverdue,
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
</style>
