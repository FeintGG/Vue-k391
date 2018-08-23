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
    <div style="width:100%;height:1px;background-color:#bac5c5;margin:10px 0;box-shadow: 0px 2px 3px #888888"></div>
    <el-row>
        <el-col :span="24">
            <div class="grid-content bg-purple-dark">
                <el-button type="primary" @click="addUser">新增</el-button>
                <el-button type="danger" @click="deletes">多个删除</el-button>
                
            </div>
        </el-col>
    </el-row>
     <!--列表-->
    <el-table :data="tableData" style="width: 100%" @select="removes" @select-all="allSelect">
      <el-table-column width="80" type="selection"  >
      </el-table-column>
      
      <el-table-column label="用户" width="180">
      <template slot-scope="scope">
        <el-popover placement="top" trigger="manual">
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
   <!--分页显示-->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage2" :page-sizes="[5, 10, 20, 30]" :page-size="rows" layout="sizes, prev, pager, next" :total="total">
    </el-pagination>

    <!--弹出对话框-->
    <el-dialog
    title="数据操作"
    :visible.sync="dialogVisible"
    width="30%"
    >
     <!--form表单-->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="Username" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
            <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button ref="btn1" @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
    </el-form>
</el-dialog>
        
    </div>
    
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      total: 0,
      currentPage2: 1,
      rows: 5,
      input5: "",
      dialogVisible: false,
      submitType: 0, //0代表是新增   1代表是修改
      editId:'',
      ids : [],
      ruleForm: {
        name: "",
        password: ""
      },
      rules: {
        name: [
          { required: true, message: "please enter Username", trigger: "blur" }
        ],
        password: [
          { required: true, message: "please enter Password", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //新增用户
    addUser() {
      this.dialogVisible = true;
      this.submitType = 0;
      this.ruleForm.name = "";
      this.ruleForm.password = "";
    },
    //重置表单内容
    resetForm(formName) {
      //console.log( this.$refs.ruleForm);
      this.$refs[formName].resetFields();
    },
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
        this.editId = row._id;
        this.dialogVisible =  true;
      this.submitType = 1;
       this.axios({
           method:'get',
           url:`${this.globalUrlPrefix}/users/data/${this.editId}`
       }).then(res=>{   
           this.ruleForm.name = res.data.name;
           this.ruleForm.password = res.data.password;
       })
    },
    //点击事件 删除
    handleDelete(index, row) {
         this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
                  this.axios({
                  method:'delete',
                  url:`${this.globalUrlPrefix}/users/data/${row._id}`
                }).then(res=>{
                  this.getData();
                })
          this.$message({
            type: 'success',
            message: '删除成功!', 
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    //点击全选
    allSelect(selection){
      for (var i=0;i<selection.length;i++) {
        this.ids.push(selection[i]._id);
      }
     // console.log(this.ids);
    },
  
    //提交事件
    submitForm(formName) {
        
      this.dialogVisible = false;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.submitType == 0) {
             
            //新增
            this.axios({
              method: "post",
              url: "http://localhost:3000/users/data",
              data: this.ruleForm
            }).then(res => {
              this.getData(),
              this.$message({
                message: "数据添加成功",
                type: "success"
              });
            this.ruleForm.name = "";
           this.ruleForm.password = "";

            });
          }else if (this.submitType == 1) {//修改
              this.submitType=0;
               this.axios({
                   method:'put',
                   url:`${this.globalUrlPrefix}/users/data/${this.editId}`,
                   data:this.ruleForm
               }).then(res => {
                   this.getData();
                   this.$message({
                    message: "数据修改成功",
                    type: "success"
                });
                
                  //this.resetForm('ruleForm');
                  console.log(111,this.ruleForm);
                  this.ruleForm.name = "";
                  this.ruleForm.password = "";
                  //console.log(1222,this.ruleForm);

               })
               
          }
        } else {
         
          return false;
        }
      });
    },    
    //获取数据库列表
    getData() {
      this.axios({
        method: "post",
        url: `${this.globalUrlPrefix}/users/list`,
        data: {
          page: this.currentPage2,
          rows: this.rows,
          name: this.input5
        }
      }).then(res => {
        this.tableData = res.data.rows;
        this.total = res.data.total;
      });
    },
    //搜索框
    serachChange(value) {
      this.getData();
    },
    //删除多条---->获取id值存入数组
    removes(selection, row){
      let index = this.ids.indexOf(row._id);
      if( index != -1){//存在
        //删除
         this.ids.splice(index,1);
      } else {
        //新增
        this.ids.push(row._id);
      }
    },
    //多个删除
    deletes(){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
              this.axios({
              method: "post",
              url: `${this.globalUrlPrefix}/users/removes`,
              data: {
              ids:this.ids.toString()
              }
            }).then(res => {
               this.getData();
            });
          this.$message({
            type: 'success',
            message: '删除成功!', 
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }

   
  },
  mounted() {
    this.getData();
  }
};
</script>
