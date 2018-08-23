<template> 
<div>
    <el-row>
        <el-col :span="24"><div class="grid-content bg-purple-dark">
                <el-button type="primary" plain size='small' @click="switchType(1)">地区分类</el-button>
                <el-button type="success" plain size='small' @click="switchType(2)">产品分类</el-button>
                <el-button type="info" plain size='small' @click="switchType(3)">新闻分类</el-button>
                <el-button type="warning" plain size='small' @click="switchType(4)">课程分类</el-button>
                <el-button type="danger" plain size='small' @click="switchType(5)">饮食分类</el-button>
            </div></el-col>
    </el-row>
    <div style="width:98%;height:1px;background-color:#ccc;margin:10px 0;"></div>
    <el-row>
        <el-col :span="24"><div class="grid-content bg-purple-dark">
                <el-button type="primary" plain size='medium' @click="removes">多个删除</el-button>
            </div></el-col>
    </el-row>
    
    <el-row>
      <el-col :span="7">
        <div class="grid-content bg-purple">
        <div class="custom-tree-container">
        <div class="block">
            <el-tree :data="treeData" show-checkbox default-expand-all :expand-on-click-node="false" ref="cateTree">
      
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>{{ node.label }}</span>
                  <span>
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => append(data)">
                      添加
                    </el-button>
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => edit(data)">
                      修改
                    </el-button>
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => remove(node, data)">
                      删除
                    </el-button>
                  </span>
                </span>
              </el-tree>
        </div>
        </div>
        </div>
      </el-col>

      <el-col :span="16"><div class="grid-content bg-purple-light" style="margin-left:40px;">
        <el-dialog title="节点操作" :visible.sync="dialogVisible" width="30%">
     <!--form表单-->
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="添加子节点" prop="name">
                  <el-input v-model="ruleForm.text"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                  <el-button ref="btn1" @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
          </el-form>
        </el-dialog>
      </div></el-col>      
  </el-row>
    
</div>

</template>
<script>
  let id = 1000;

  export default {
    data() {
      return {
          ruleForm: {
        text: "",
      },
      rules: {
        text: [
          { required: true, message: "please enter Username", trigger: "blur" }
        ],
      },
        treeData:[],
        cateType:1,
        input:'',
        dialogVisible:false,
        _Id:'',
        submitType:0 //0是新增  1是修改
        
      }
    },

    methods: {
      //添加节点
      append(data) {
        this._Id = data._id;
        this.dialogVisible = true;
      },

      //修改节点
      edit(data){
        this.dialogVisible = true;
        this.submitType = 1;
        this._Id = data._id;
        this.ruleForm.text = data.text;
      },

      remove(node, data) {
       
         this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios({
            method:'delete',
            url:`${this.globalUrlPrefix}/cate/data/${data._id}`,
          }).then(res=>{
            this.getTreeList();
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

      //切换分类
      switchType(type){
          this.cateType = type;
          this.getTreeList();
          //console.log(this.cateType);
      },

      //渲染tree数据
      getTreeList(){
          this.axios({
              method:'get',
              url:`${this.globalUrlPrefix}/cate/list/${this.cateType}`,
          }).then(res=>{
              this.treeData = res.data;
          })
      },
      //点击添加提交事件
      submitForm(formName){
      this.dialogVisible = false;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.submitType == 0) { 
            //新增
            this.axios({
              method: "post",
              url: `${this.globalUrlPrefix}/cate/data`,
              data:{
                type:this.cateType,
                parentId:this._Id,
                text:this.ruleForm.text
              } 
            }).then(res => {
              this.getTreeList(),
              this.$message({
                message: "数据添加成功",
                type: "success"
              });
            this.ruleForm.text = "";

            });

            
          }else if (this.submitType == 1) {//修改
              this.submitType=0;
               this.axios({
                   method:'put',
                   url:`${this.globalUrlPrefix}/cate/data/${this._Id}`,
                   data:{
                      text:this.ruleForm.text
                   }
               }).then(res => {
                   this.getTreeList();
                   this.$message({
                    message: "数据修改成功",
                    type: "success"
                });
                  this.ruleForm.text = "";
               })
               
          }
        } else {
         
          return false;
        }
      });
      },
      //点击添加重置事件
      resetForm(){

      },
     
       removes(){
         let checked = this.$refs.cateTree.getCheckedNodes();
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [];
           checked.forEach(value => {
              ids.push(value._id);
            });
            this.axios({
              method:'post',
              url:`${this.globalUrlPrefix}/cate/removes`,
              data:{
                  ids:ids.toString()
              }
            }).then(res=>{
              this.getTreeList();
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
        });
      }
    
    },
    mounted(){
        this.getTreeList();

        
    }
  };
 

</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
   
  }
</style>