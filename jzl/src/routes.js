import Home from './components/Home.vue';
import User from './components/user';
import News from './components/news';
import Cate from './components/cate';
import Comment from './components/Comment';


export default [
    {
        path:'/',
        component: Home
    },

    {
        path:'/user',
        component: User
    },

    {
        path:'/news',
        component: News,
    },

    {
        path:'/news/:newsId/comment',
        component: Comment,
        name: 'commentPage'
    },

    {
        path:'/cate',
        component: Cate
    },

    {
        path:'*',
        redirect: '/' 
    }


    
]