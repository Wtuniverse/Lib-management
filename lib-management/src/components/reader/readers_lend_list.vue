<template>
  <div>
    <div id="header" ref="header"></div>

    <el-alert
      v-if="errorMessage"
      title="Error"
      type="error"
      :closable="false"
      class="mb-4"
    >
      {{ errorMessage }}
    </el-alert>

    <el-card>
      <div slot="header">
        <span>My lend list</span>
      </div>
      <el-table :data="loanLogs" style="width: 100%" stripe>
        <el-table-column label="User ID" prop="userId" />
        <el-table-column label="Book ID" prop="bookId" />
        <el-table-column label="Lend Date" prop="lendTime" />
        <el-table-column label="Return Date" prop="returnTime" />
        <el-table-column label="Situation">
          <template #default="{ row }">
            <span v-if="!row.returnTime">Lending</span>
            <span v-else>Returned</span>
            <span v-if="!row.returnTime && isOverdue(row)">/ Overdue</span>
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
    const loanLogs = ref([]);
    const errorMessage = ref('');

    // 判断是否超期
    const isOverdue = (log) => {
      const currentTime = new Date().getTime();
      const lendDate = new Date(log.lendTime).getTime();
      const loanPeriod = 30 * 24 * 60 * 60 * 1000; // 假设借期为30天

      return currentTime - lendDate > loanPeriod;
    };

    // 动态加载头部内容
    onMounted(async () => {
      const header = document.querySelector('#header');
      if (header) {
        header.innerHTML = '<h1>Lend Lists</h1>';
      }
      await loadLoanLogs();
    });

    // 加载借还日志
    const loadLoanLogs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/lend_list');
        console.log(response)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        loanLogs.value = data;
      } catch (error) {
        console.error('Error fetching lend list:', error);
        errorMessage.value = 'Failed to load loan logs.';
      }
    };


    return {
      loanLogs,
      isOverdue,
      errorMessage,
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
