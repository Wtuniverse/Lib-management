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
            @input="searchBooks"
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
          <template slot-scope="scope">
            <el-button type="primary" @click="lendBook(scope.row)">Lend</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 图书详情弹出框 -->
      <el-dialog title="Detail" :visible.sync="dialogVisible">
        <el-form label-width="100px">
          <el-form-item label="Name">
            <el-input v-model="selectedBook.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="Author">
            <el-input v-model="selectedBook.author" disabled></el-input>
          </el-form-item>
          <el-form-item label="Publish">
            <el-input v-model="selectedBook.publish" disabled></el-input>
          </el-form-item>
          <el-form-item label="ISBN">
            <el-input v-model="selectedBook.isbn" disabled></el-input>
          </el-form-item>
          <el-form-item label="Price">
            <el-input v-model="selectedBook.price" disabled></el-input>
          </el-form-item>
          <el-form-item label="Number">
            <el-input v-model="selectedBook.number" disabled></el-input>
          </el-form-item>
          <el-button type="primary" @click="lendBook(selectedBook)">Lend</el-button>
        </el-form>
      </el-dialog>
    </el-main>
  </el-container>
  <!-- 借书填写日期框弹出 -->
  <el-dialog title="Lend Book" :visible.sync="lendModalVisible">
    <el-form>
      <el-form-item label="Return Date">
        <el-date-picker v-model="returnDate" type="date" placeholder="Pick a date"></el-date-picker>
      </el-form-item>
      <el-button type="primary" @click="confirmLend">Confirm</el-button>
    </el-form>
  </el-dialog>
</template>

<script>
import { ref, onMounted } from 'vue';
import { ElTable, ElTableColumn, ElInput, ElButton, ElDialog, ElForm, ElFormItem, ElContainer, ElHeader, ElMain, ElRow, ElCol } from 'element-plus';

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
    // 新增
    const lendModalVisible = ref(false);
    const selectedBookForLend = ref(null);
    const returnDate = ref(null);
    // 模拟获取图书数据
    const fetchBooks = async () => {
      // 假设从后端API获取图书列表
      books.value = [
        { bookId: 1, name: 'Java编程思想', author: 'Bruce Eckel', publish: '人民邮电出版社', isbn: '9787115331423', price: '99.00', number: '50' },
        { bookId: 2, name: '深入理解计算机系统', author: 'Randal E. Bryant', publish: '清华大学出版社', isbn: '9787302513940', price: '129.00', number: '30' },
        // 更多图书数据...
      ];
    };

    // 搜索图书
    const searchBooks = () => {
      // 这里可以根据关键字过滤图书
      fetchBooks(); // 这里只是模拟刷新
    };

    // 查看图书详情
    const viewDetails = (row) => {
      selectedBook.value = { ...row }; // 复制图书信息
      dialogVisible.value = true; // 打开弹出框
    };

    // 显示借书模态框
    const showLendModal = (book) => {
      selectedBookForLend.value = book;
      lendModalVisible.value = true;
    };

    // 确认借书
    const confirmLend = () => {
      if (!returnDate.value) {
        alert('Please select a return date.');
        return;
      }

      const lendRecord = {
        bookId: selectedBookForLend.value.id,
        bookName: selectedBookForLend.value.name,
        lendTime: new Date().toISOString(),
        returnTime: returnDate.value.toISOString()
      };

      lendBook(lendRecord);
    };

    // 借书
    const lendBook = async (lendRecord) => {
      try {
        const response = await axios.post('/api/lend', lendRecord);
        if (response.status === 201) {
          lendList.value.push(lendRecord);
          writeLendList(lendList.value);
          alert('Book lend successfully');
        }
      } catch (error) {
        console.error('Error lending book:', error);
      }
    };



    // 页面加载时获取图书数据
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
    };
  }
};
</script>

<style scoped>
.input-search {
  width: 300px;
}
</style>
