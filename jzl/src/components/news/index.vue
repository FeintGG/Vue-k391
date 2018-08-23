<template>
<div>
    <el-row :gutter="20">
        <el-col :span="4">
            <div class="grid-content bg-purple">

                <!--tree列表-->
                <el-tree :data="treeData" @node-click="handleNodeClick" default-expand-all></el-tree>
            </div>
        </el-col>

        <el-col :span="20"><div class="grid-content bg-purple">
            <!--搜索框-->
            <el-input placeholder="请输入搜索内容" v-model="input5" @change="serachChange">
                        <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>

            <!--新增新闻-->
            <el-button type="primary" @click="addNews">新增新闻</el-button>
        <!--table数据-->
            <el-table :data="tableData" style="width: 100%">
                <!--发布时间-->
                <el-table-column label="发布时间" width="220">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ new Date(scope.row.ctime).toLocaleString() }}</span>
                    </template>
                </el-table-column>

                <!--新闻标题-->
                <el-table-column label="标题" width="180">
                    <template slot-scope="scope">
                     <el-popover placement="top" trigger="manual">
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.title }}</el-tag>
                        </div>
                     </el-popover>
                    </template>
                </el-table-column>

                <!--新闻内容--> 
                <el-table-column label="内容" width="280">
                    <template slot-scope="scope">
                     <el-popover placement="top" trigger="manual">
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.content }}</el-tag>
                        </div>
                     </el-popover>
                    </template>
                </el-table-column>

                <!--作者-->
                <el-table-column label="作者" width="100">
                    <template slot-scope="scope">
                     <el-popover placement="top" trigger="manual">
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.author }}</el-tag>
                        </div>
                     </el-popover>
                    </template>
                </el-table-column>

                <!--修改时间-->
                <el-table-column label="修改时间" width="180">
                    <template slot-scope="scope">
                     <el-popover placement="top" trigger="manual">
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ new Date(scope.row.mtime).toLocaleString()}}</el-tag>
                        </div>
                     </el-popover>
                    </template>
                </el-table-column>

                <!--操作-->
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-button
                        size="mini"
                        type="info"
                        @click="viewLog(scope.$index, scope.row)">查看评论</router-link></el-button>
                    </template>
                </el-table-column>
            </el-table>

                <!--分页显示-->
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage2" :page-sizes="[5, 10, 20, 30]" :page-size="rows" layout="sizes, prev, pager, next" :total="total">
                </el-pagination>

                <!--弹出对话框-->
                    <el-dialog title="数据操作" :visible.sync="dialogVisible" width="30%">
                   
                    <!--form表单-->
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="标题" prop="title">
                            <el-input v-model="ruleForm.title"></el-input>
                        </el-form-item>
                        <el-form-item label="内容" prop="content">
                            <el-input v-model="ruleForm.content"></el-input>
                        </el-form-item>
                        <el-form-item label="作者" prop="author">
                            <el-input v-model="ruleForm.author"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                            <el-button ref="btn1" @click="resetForm('ruleForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>
            </div>
        </el-col>
    </el-row>
</div> 
</template>
<script>


export default {
    methods:{
        
    },
     data() {
      return {
        module:'cate',
        treeData: [],
        tableData:[],
        currentPage2: 1,
        rows: 5,
        total: 0,
        cateType:3,
        switchNewslist:'',
        submitType: 0, //0代表是新增   1代表是修改
        editId:'',
        input5: "",
        dialogVisible:false,
        ruleForm: {
            content: "",
            title: "",
            author:''
        },
      rules: {
        title: [
          { required: true, message: "please enter title", trigger: "blur" }
        ],
        content: [
          { required: true, message: "please enter content", trigger: "blur" }
        ],
        conauthortent: [
          { required: true, message: "please enter author", trigger: "blur" }
        ]
      }
      
      };
    },
    methods:{
            //渲染列表
            handleNodeClick(data){
                this.switchNewsList = data._id;
                this.getNewsList()
            },
            getNewsList(){
                this.axios({
                    method: "post",
                    url: `${this.globalUrlPrefix}/news/list`,
                    data:{
                        cateId:this.switchNewsList,
                        page: this.currentPage2,
                        rows: this.rows,
                        title: this.input5
                    }
                    }).then(res => {
                        this.tableData = res.data.rows;
                        this.total = res.data.total; 
                    });  

            },
            //获取tree节点数据
            getTreeData() {
                this.axios({
                    method:'get',
                    url:`${this.globalUrlPrefix}/cate/list/${this.cateType}`,
                }).then(res=>{
                    this.treeData = res.data;
                })
            },
            //设置每页显示多少条数据列表
            handleSizeChange(val) {
                this.rows = val;
                this.getNewsList(); 
            },
            //点击页码渲染对应的数据列表
            handleCurrentChange(currentPage2) {
                this.currentPage2 = currentPage2;
                this.getNewsList()
            },
            //搜索框
            serachChange(value) {
                this.getNewsList()
            },
            //添加新闻
            addNews(){
                this.submitType == 0;
                this.dialogVisible = true;
            },
            //修改新闻
            handleEdit(node,val) {
                this.editId = val._id;
                this.dialogVisible = true;
                this.submitType = 1
                this.axios({
                    method:'get',
                    url:`${this.globalUrlPrefix}/news/data/${val._id}`
                }).then(res=>{
                    this.ruleForm.title = res.data.title;
                    this.ruleForm.content = res.data.content;
                    this.ruleForm.author = res.data.author;
                })
            },
            //删除新闻
            handleDelete(node,val){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                this.axios({
                    method:'delete',
                    url:`${this.globalUrlPrefix}/news/data/${val._id}`,
                }).then(res=>{
                    this.getNewsList();
                })
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
                })                
            },
            //表单提交
            submitForm(ruleForm){
                if(this.submitType == 0) {
                        this.axios({
                        method:'post',
                        url:`${this.globalUrlPrefix}/news/data/`,
                        data:{
                        cateId:this.switchNewsList,
                        title:this.ruleForm.title,
                        content:this.ruleForm.content,
                        author:this.ruleForm.author
                        }
                    }).then(res=>{
                        this.getNewsList();
                        this.dialogVisible = false;
                        this.$message({
                        message: "数据添加成功",
                        type: "success"
                    });
                    })
                }else if(this.submitType == 1) {
                    this.submitType=0;
                    this.axios({
                        method:'put',
                        url:`${this.globalUrlPrefix}/news/data/${this.editId}`,
                        data:{
                            title:this.ruleForm.title,
                            content:this.ruleForm.content,
                            author:this.ruleForm.author,
                        }
                    }).then(res => {
                        this.getNewsList();
                        this.dialogVisible = false;
                        this.$message({
                        message: "数据修改成功",
                        type: "success"
                    });
                  this.ruleForm.title = "";
                  this.ruleForm.content = "";
                  this.ruleForm.author = "";

               })
            }
            },
            //表单重置
            resetForm(ruleForm){

            },
            //跳转至评论模块
            viewLog(index, row){
               // console.log(row._id);
                this.$router.push({
                    name: 'commentPage',
                    params: {newsId: row._id},
                    query: {newsTitle: encodeURI(row.title)}
                });
            }

    },
    mounted(){
            this.getTreeData();
            
        }
    
   
  };

</script>
