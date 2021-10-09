import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import routes from './routes.ts';

//importing horizontal nav bar for global usage
import HorizontalNavBar from './components/nav-bar/Horizontal.vue'

//importing CKEditor
import CKEditor from 'ckeditor4-vue';

//[**GLOBAL COMPONENTS**]//
//REMOVING OR MODIFYING THIS SECTION MAY AFFECT MOST OF THE PAGES 
//registering horizontal nav bar
Vue.component('horizontal-nav-bar', HorizontalNavBar)
Vue.use(CKEditor);
Vue.use(Vuetify)

//global fields rules
//used for input validation 
window.valueRules = [(v) => !!v || "Value is required", (v) => !!String(v).trim() || 'Do not use white spaces as value']

Vue.config.productionTip = false

new Vue({
    router: routes,
    vuetify: new Vuetify(),
    render: h => h(App),
}).$mount('#app')