<template>
<el-container style="height: 100%; border: 1px solid #eee">

  <el-aside width="240px" style="background-color: #fff">
    
    <el-menu :default-openeds="['1', '3']">
      <div class="h56">后台管理系统</div>
      <el-submenu index="1">
        <template slot="title"><i class="el-icon-menu"></i>基础模块</template>
        <el-menu-item-group>
          <el-menu-item index="1-1"><router-link to="/">首页</router-link></el-menu-item>
          <el-menu-item index="1-2"><router-link to="/user">用户管理</router-link></el-menu-item>
          <el-menu-item index="1-3"><router-link to="/news">新闻管理</router-link></el-menu-item>
          <el-menu-item index="1-4"><router-link to="/cate">分类管理</router-link></el-menu-item>
          <el-menu-item index="1-5"><router-link to="/comment">评论管理</router-link></el-menu-item>
          </el-menu-item-group>

      </el-submenu>
      <el-submenu index="2">
        <template slot="title"><i class="el-icon-menu"></i>导航二</template>

      </el-submenu>
      <el-submenu index="3">
        <template slot="title"><i class="el-icon-menu"></i>导航三</template>

      </el-submenu>
    </el-menu>
  </el-aside>
  
  <el-container>
    <el-header style="text-align: right; font-size: 12px">
      <el-dropdown>
        <i class="el-icon-setting" style="margin-right: 15px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>查看</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span>Jzl</span>
  </el-header>
  <el-main>
    <router-view></router-view>
  </el-main>
    

  </el-container>
</el-container>
</template>
<script>
export default {
  data() {
    return {
      a:"t"
    }
  }
}
</script>




<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
.menuitem,.el-submenu__title{
  width:237px !important;
}
 .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  
  .el-aside {
    color: #333;
  }
  *{
    padding:0;
    margin:0;
  }
  .h56{
    height:60px;
    width:240px;
    float: left;
    background-color: #B3C0D1;
    line-height: 60px;
    font-size: 15px;
    color:#1660cf;
    text-align: center;
    font-size: 20px;
  }
  .el-menu-item-group{
      box-sizing: border-box;
     
      margin-right: 8px;
  }
</style>
