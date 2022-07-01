import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

//check meta before loading the route
//this function check if a certain route requires token auth.
//if yes then it check if user has an active token.
const checkMeta = function (to, from, next) {
    if (to.matched.some(record => record.meta.requiresAuth)) {

        if (!window.localStorage.getItem("token")) {

            next({
                path: '/',
                query: { redirect: to.fullPath }
            })
        } else {
            //taking the declared variable for username and departiment id 
            //it show error since the values are captured on runtime
            window.username = window.localStorage.getItem("name")

            window.dept_id = window.localStorage.getItem("dept_id")

            next();
        }
    } else {

        next()
    }
}

//ignore these errors, they just want to confuse you
//focus on seting the right routes. 
//the routes compiles on run time
const routes = [
    {
        name: 'Home',
        component: () => import("./components/document-settings/ComposeDocumentation.vue"),
        path: '/create-documentation',
        beforeEnter: checkMeta,
        meta: { requiresAuth: true }
    },
    {
        name: "Login",
        component: () => import('./components/auth/Login.vue'),
        path: '/',
        meta: { requiresAuth: false }
    },
    {
        name: "Documentation",
        component: () => import('./components/document-view/ViewDocumentation.vue'),
        path: '/documentation-view',
        beforeEnter: checkMeta,
        meta: { requiresAuth: true }
    },
    {
        name: "Documentation-edit",
        component: () => import('./components/document-settings/EditDocument.vue'),
        path: '/documentation-edit',
        beforeEnter: checkMeta,
        meta: { requiresAuth: true }
    }
]

export default new VueRouter({
    routes,
    mode: 'history'
})