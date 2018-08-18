<template>
    <div>
    <el-row>
        <el-col :span="24">
            <div class="grid-content bg-purple-dark"> 
                <div style="margin-top: 15px;">
                <el-input placeholder="请输入搜索内容" v-model="input5" @change="serachChange">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </div>
            </div>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="24">
            <div class="grid-content bg-purple-dark">
                <el-button type="primary">新增</el-button>
                <el-button type="danger">多个删除</el-button>
            </div>
        </el-col>
    </el-row>

        <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      label="用户"
      width="80" type="selection">
     
    </el-table-column>
    <el-table-column
      label="用户"
      width="180">
      <template slot-scope="scope">
        <el-popover placement="top">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.name }}</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">修改</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage2"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="rows"
      layout="sizes, prev, pager, next"
      :total="total"
      >
    </el-pagination>
    </div>
    
</template>
<script>
export default {
    data() {
      return {
        tableData: [],
        total:0,
        currentPage2: 1,
        rows:5,
        input5: '',

          
        
      }
    },
    methods: {
        //设置每页显示多少条数据列表
        handleSizeChange(val) {
            this.rows = val;
            this.getData();
        },
        //点击页码渲染对应的数据列表
        handleCurrentChange(currentPage2) {
            this.currentPage2 = currentPage2;
            this.getData();  
        },
        //点击事件 修改
        handleEdit(index, row) {
            console.log(index, row);
        },
        //点击事件 删除
        handleDelete(index, row) {
            console.log(index, row);
        },
        //获取数据库列表
        getData(){
                this.axios({
                method: 'post',
                url: 'http://localhost:3000/users/list',
                data: {
                    page:this.currentPage2,
                    rows:this.rows,
                    name:this.input5


            }
            }).then(res=>{
                this.tableData = res.data.rows;
                this.total = res.data.total;
            });
        },
        serachChange(value){
            this.getData(); 
        }
    },
   mounted(){
       this.getData();
   }
       
    }

</script>
