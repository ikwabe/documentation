import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

const routes = [
    {
        name:'Home',
        component:() => import("./components/document-settings/ComposeDocumentation.vue"),
        path:'/',
        metadata:{allowed:'admin'}
    }
]

export default new VueRouter({
    routes,
    mode: 'history'
})