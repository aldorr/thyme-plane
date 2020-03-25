import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import firebase from "firebase/app"
// import * as admin from "firebase-admin"
import "firebase/auth"
import "firebase/database"
import { firebaseConfig } from "./firebase"

// Could reduce to only needed buefy components
import Buefy from 'buefy'
// import 'buefy/dist/buefy.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)
    // import 'vee-validate'

// Vue.use(vee-validate, {
//     useConstraintAttrs: false,
//     errorBagName: 'errors'
// });


Vue.use(Buefy, { defaultIconPack: 'fas' })

Vue.config.productionTip = false

new Vue({
    router,
    store,
    created() {
        firebase.initializeApp(firebaseConfig)
    },
    render: h => h(App)
}).$mount('#app')