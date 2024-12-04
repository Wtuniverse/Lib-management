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

      <!-- 新增的借阅日期选择弹出框 -->
      <el-dialog title="Choose Return Date" :visible.sync="lendModalVisible">
        <el-form>
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
      console.log('Lend button clicked for book:', book); // 调试信息
      selectedBookForLend.value = book;
      lendModalVisible.value = true;
    };

    const onDateSelected = (date) => {
      console.log('Selected return date:', date);
    };

    const confirmLend = async () => {
      if (!returnDate.value) {
        alert('Please select a return date.');
        return;
      }

      try {
        // 构造要发送的数据对象
        const userId = "CURRENT_USER_ID"; // 你需要根据实际情况获取当前用户的ID
        const bookId = selectedBookForLend.value.bookId;
        const bookName = selectedBookForLend.value.name;
        const lendTime = new Date().toISOString().split('T')[0]; // 获取当前日期
        const returnTime = returnDate.value.toISOString().split('T')[0];

        // 发送POST请求到后端API
        const response = await axios.post('/api/lendBook', {
          userId,
          bookId,
          bookName,
          lendTime,
          returnTime
        });

        console.log('Book lent successfully:', response.data);
        alert('Book lent successfully!');

        // 关闭弹出框并清空已选书籍和日期
        lendModalVisible.value = false;
        selectedBookForLend.value = null;
        returnDate.value = null;

      } catch (error) {
        console.error('Error lending book:', error.response ? error.response.data : error.message);
        alert('Failed to lend the book. Please try again.');
      }
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
