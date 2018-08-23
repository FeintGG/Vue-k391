<template>
    <div>
        <h1>新闻标题：{{newsTitle}}</h1>
        <!--水平线-->
        <div style="width:98%;height:1px;background-color:#ccc;margin:10px 0;"></div>
        <!--新增按钮-->
        <el-button type="info" size="small" plain @click="append">添加评论</el-button>
        <!--table数据-->
         <el-table :data="tableData" style="width: 100%">
                <!--发布时间-->
                <el-table-column label="评论时间" width="220">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ new Date(scope.row.createTime).toLocaleString() }}</span>
                    </template>
                </el-table-column>

                <!--新闻标题-->
                <el-table-column label="评论人" width="100">
                    <template slot-scope="scope">
                     <el-popover placement="top" trigger="manual">
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.user }}</el-tag>
                        </div>
                     </el-popover>
                    </template>
                </el-table-column>

                <!--新闻内容--> 
                <el-table-column label="评论内容" width="380">
                    <template slot-scope="scope">
                     <el-popover placement="top" trigger="manual">
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.commentContent }}</el-tag>
                        </div>
                     </el-popover>
                    </template>
                </el-table-column>

                <!--修改时间-->
                <el-table-column label="最后修改时间" width="180">
                    <template slot-scope="scope">
                     <el-popover placement="top" trigger="manual">
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ new Date(scope.row.updateTime).toLocaleString()}}</el-tag>
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
                <el-form-item label="评论内容" prop="commentContent">
                    <el-input type="textarea" v-model="ruleForm.commentContent"></el-input>
                </el-form-item>
                <el-form-item label="评论人" prop="user">
                    <el-input v-model="ruleForm.user"></el-input>
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
            newsTitle: decodeURI(this.$route.query.newsTitle),
            newsId: this.$route.params.newsId,
            tableData:[],
            currentPage2:1,
            rows:5,
            total:0,
            submitType: 0, //0代表是新增   1代表是修改
            dialogVisible:false,
            editId:'',
             ruleForm: {
                commentContent: "",
                user: "",
            },
            rules: {
                commentContent: [
                { required: true, message: "please enter title", trigger: "blur" }
                ],
                user: [
                { required: true, message: "please enter content", trigger: "blur" }
                ],
            }
        }
    },
    methods:{
        //设置每页显示多少条数据
        handleSizeChange(val){
            this.rows = val;
            this.getCommentData();
        },

        //点击页码渲染对应的数据列表
        handleCurrentChange(currentPage2){
            this.currentPage2 = currentPage2;
            this.getCommentData();
        },

        //添加
        append(){
            this.submitType == 0;
            this.dialogVisible = true;
        },

        //修改评论
        handleEdit(node,val){
            this.editId = val._id;
            this.dialogVisible = true;
            this.submitType = 1
            this.axios({
                method:'get',
                url:`${this.globalUrlPrefix}/comments/data/${val._id}`
            }).then(res=>{
                this.ruleForm.commentContent = res.data.commentContent;
                this.ruleForm.user = res.data.user;
            })
        },

        //删除
        handleDelete(node,val){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
            this.axios({
                method:'delete',
                url:`${this.globalUrlPrefix}/comments/data/${val._id}`,
            }).then(res=>{
                this.getCommentData();
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
                    url:`${this.globalUrlPrefix}/comments/data/`,
                    data:{
                    newsId:this.$route.params.newsId,
                    commentContent:this.ruleForm.commentContent,
                    user:this.ruleForm.user
                    }
                }).then(res=>{
                    this.getCommentData();
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
                        url:`${this.globalUrlPrefix}/comments/data/${this.editId}`,
                        data:{
                            commentContent:this.ruleForm.commentContent,
                            user:this.ruleForm.user,
                        }
                    }).then(res => {
                        this.getCommentData();
                        this.dialogVisible = false;
                        this.$message({
                        message: "数据修改成功",
                        type: "success"
                    });
                  this.ruleForm.user = "";
                  this.ruleForm.commentContent = "";

               })
            }
        },
        //表单重置
        resetForm(ruleForm){

        },

        //渲染评论列表
        getCommentData(){
            console.log(this.newsId);
            this.axios({
                method:'post',
                url: `${this.globalUrlPrefix}/comments/list`,
                data:{
                    newsId:this.newsId,
                    commentContent:this.input5,
                    page: this.currentPage2,
                    rows: this.rows,
                }
            }).then(res=>{
                console.log(res);
                this.tableData = res.data.rows;
                this.total = res.data.total; 
            })

        },

        
    },
    mounted(){
        this.getCommentData();
    }
}
</script>

