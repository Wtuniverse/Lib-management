<template>
  <el-container>
    <!-- 页头 -->
    <el-header>
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="6"><h2>All Books</h2></el-col>
        <el-col :span="12">
          <el-input
            placeholder="Send a book name"
            v-model="searchWord"
            clearable
            @input="updateSearchWord"
            class="input-search"
          />
        </el-col>
      </el-row>
    </el-header>
    <!-- 主体内容 -->
    <el-main>
      <el-table :data="books" style="width: 100%" @row-click="viewDetails">
        <el-table-column prop="name" label="Name" width="150"></el-table-column>
        <el-table-column prop="author" label="Author" width="150"></el-table-column>
        <el-table-column prop="publish" label="Publish" width="150"></el-table-column>
        <el-table-column prop="isbn" label="ISBN" width="150"></el-table-column>
        <el-table-column prop="price" label="Price" width="100"></el-table-column>
        <el-table-column prop="number" label="Number" width="120"></el-table-column>
        <!-- 新增lend按钮 -->
        <el-table-column label="Operations">
          <template #default="scope">
            <el-button type="primary" @click="showLendModal(scope.row)">Lend</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 图书详情弹出框 -->
      <el-dialog title="Detail" :visible.sync="dialogVisible">
        <el-form label-width="100px">
          <el-form-item label="Name">
            <el-input :value="selectedBook.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="Author">
            <el-input :value="selectedBook.author" disabled></el-input>
          </el-form-item>
          <el-form-item label="Publish">
            <el-input :value="selectedBook.publish" disabled></el-input>
          </el-form-item>
          <el-form-item label="ISBN">
            <el-input :value="selectedBook.isbn" disabled></el-input>
          </el-form-item>
          <el-form-item label="Price">
            <el-input :value="selectedBook.price" disabled></el-input>
          </el-form-item>
          <el-form-item label="Number">
            <el-input :value="selectedBook.number" disabled></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showLendModal(selectedBook)">Lend</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 借阅日期选择弹出框 -->
      <el-dialog title="Choose Return Date" v-model="lendModalVisible" width="500">
        <el-form label-width="100px">
          <el-form-item label="Return Date">
            <el-date-picker
              v-model="returnDate"
              type="date"
              placeholder="Pick a return date"
              @change="onDateSelected"
            />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="lendModalVisible = false">Cancel</el-button>
          <el-button type="primary" @click="confirmLend">Confirm</el-button>
        </span>
      </el-dialog>

    </el-main>
  </el-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import {
  ElTable,
  ElTableColumn,
  ElInput,
  ElButton,
  ElDialog,
  ElForm,
  ElFormItem,
  ElContainer,
  ElHeader,
  ElMain,
  ElRow,
  ElCol,
  ElDatePicker // 添加这一行以注册 ElDatePicker 组件
} from 'element-plus';
import axios from 'axios';
export default {
  name: 'BookManagement',
  components: {
    ElTable,
    ElTableColumn,
    ElInput,
    ElButton,
    ElDialog,
    ElForm,
    ElFormItem,
    ElContainer,
    ElHeader,
    ElMain,
    ElRow,
    ElCol,
    ElDatePicker // 注册 ElDatePicker 组件
  },
  setup() {
    const searchWord = ref('');
    const books = ref([]);
    const dialogVisible = ref(false);
    const selectedBook = ref({});
    const lendModalVisible = ref(false);
    const selectedBookForLend = ref(null);
    const returnDate = ref(null);

    const fetchBooks = async () => {
      books.value = [
        { bookId: 1, name: 'Java编程思想', author: 'Bruce Eckel', publish: '人民邮电出版社', isbn: '9787115331423', price: '99.00', number: '50' },
        { bookId: 2, name: '深入理解计算机系统', author: 'Randal E. Bryant', publish: '清华大学出版社', isbn: '9787302513940', price: '129.00', number: '30' },
        // 更多图书数据...
      ];
    };

    const updateSearchWord = (event) => {
      searchWord.value = event.target.value;
    };

    const viewDetails = (row) => {
      selectedBook.value = { ...row };
      dialogVisible.value = true;
    };

    const showLendModal = (book) => {
      console.log('value:', lendModalVisible.value);
      console.log('Lend button clicked for book:', book); // 调试信息
      selectedBookForLend.value = book;
      lendModalVisible.value = true;
      console.log('value:', lendModalVisible.value);
    };

    const confirmLend = async () => {
  if (!selectedBookForLend.value || !returnDate.value) {
    alert('Please select a book and return date.');
    return;
  }
  console.log(returnDate.value)

  // 获取当前日期作为借出日期并转换为 UTC 字符串格式
  const lendDate = new Date().toISOString().split('T')[0];

  // 将用户选择的还书日期转换为 UTC 字符串格式
  const returnDateUTC = new Date(returnDate.value.getTime() - returnDate.value.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];

  console.log(returnDateUTC)
  try {
    const response = await axios.post('http://localhost:5000/api/lend', {
      bookId: selectedBookForLend.value.bookId,
      lendDate: lendDate,
      returnDate: returnDateUTC
    });
    console.log('Lend successful:', response.data);
    lendModalVisible.value = false; // 关闭借阅模态框
  } catch (error) {
    console.error('Error lending book:', error);
  }
};

    const onDateSelected = (date) => {
      console.log('Selected return date:', date);
    };




    onMounted(() => {
      fetchBooks();
    });

    return {
      searchWord,
      books,
      dialogVisible,
      selectedBook,
      updateSearchWord,
      viewDetails,
      lendModalVisible,
      selectedBookForLend,
      showLendModal,
      returnDate,
      onDateSelected,
      confirmLend
    };
  }
};
</script>

<style scoped>
.input-search {
  width: 300px;
}
</style>
