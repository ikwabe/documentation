import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

const routes = [
    {
        name:'Home',
        component:() => import("./components/document-settings/ComposeDocumentation.vue"),
        path:'/create-documentation',
        metadata:{allowed:'admin'}
    },

    {
        name:"Documentation",
        component:()=> import('./components/document-view/ViewDocumentation.vue'),
        path:'/',
        metadata:{allowed:'all'}
    }
]

export default new VueRouter({
    routes,
    mode: 'history'
})