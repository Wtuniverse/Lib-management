<template>
  <el-container>
    <!-- 页头 -->
    <el-header>
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="6"><h2>All Books</h2></el-col>
        <el-col :span="12">
          <el-input
            placeholder="Send a book name"
            :value="searchWord"
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
    </el-main>
  </el-container>

  <!-- 借书填写日期框弹出 -->
  <el-dialog title="Lend Book" :visible.sync="lendModalVisible">
    <el-form>
      <el-form-item label="Return Date">
        <el-date-picker :value="returnDate" type="date" placeholder="Pick a date" @change="updateReturnDate"></el-date-picker>
      </el-form-item>
      <el-button type="primary" @click="confirmLend">Confirm</el-button>
    </el-form>
  </el-dialog>
</template>

<script>
import { ref, onMounted } from 'vue';
import { ElTable, ElTableColumn, ElInput, ElButton, ElDialog, ElForm, ElFormItem, ElContainer, ElHeader, ElMain, ElRow, ElCol } from 'element-plus';
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
    ElCol
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

    const searchBooks = () => {
      fetchBooks();
    };

    const viewDetails = (row) => {
      selectedBook.value = { ...row };
      dialogVisible.value = true;
    };

    const showLendModal = (book) => {
      selectedBookForLend.value = book;
      lendModalVisible.value = true;
    };

    const updateReturnDate = (date) => {
      returnDate.value = date;
    };

    const confirmLend = async () => {
      if (!returnDate.value) {
        alert('Please select a return date.');
        return;
      }

      const lendRecord = {
        bookId: selectedBookForLend.value.bookId,
        bookName: selectedBookForLend.value.name,
        lendTime: new Date().toISOString(),
        returnTime: returnDate.value.toISOString()
      };

      try {
        const response = await axios.post('/api/lend', lendRecord);
        if (response.status === 201) {
          alert('Book lend successfully');
        }
        lendModalVisible.value = false;
      } catch (error) {
        console.error('Error lending book:', error);
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
      searchBooks,
      viewDetails,
      lendModalVisible,
      selectedBookForLend,
      updateSearchWord,
      updateReturnDate,
      confirmLend,
      showLendModal
    };
  }
};
</script>

<style scoped>
.input-search {
  width: 300px;
}
</style>
