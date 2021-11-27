import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

//check meta before loading the route
const checkMeta = function(to, from, next){
    if (to.matched.some(record => record.meta.requiresAuth)) {

        if (!window.localStorage.getItem("token")) {

            next({
                path: '/login',
                query: { redirect: to.fullPath }
              })
        } else {
            
            next();
        }
    } else {
        
        next()
    }
  }
const routes = [
    {
        name:'Home',
        component:() => import("./components/document-settings/ComposeDocumentation.vue"),
        path:'/create-documentation',
        beforeEnter:checkMeta,
        meta:{requiresAuth:true}
    },
    {
        name:"Login",
        component:()=> import('./components/auth/Login.vue'),
        path:'/login',
        meta:{requiresAuth:false}
    },
    {
        name:"Documentation",
        component:()=> import('./components/document-view/ViewDocumentation.vue'),
        path:'/',
        meta:{requiresAuth:false}
    }
]

export default new VueRouter({
    routes,
    mode: 'history'
})