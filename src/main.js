import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import routes from './routes.ts';

//importing CKEditor
import CKEditor from 'ckeditor4-vue';

Vue.use(CKEditor);
Vue.use(Vuetify)


Vue.config.productionTip = false

new Vue({
    router: routes,
    vuetify: new Vuetify(),
    render: h => h(App),
}).$mount('#app')