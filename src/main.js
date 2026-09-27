import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getDatabase } from "firebase/database"
import { firebaseConfig } from "./firebase"

import Buefy from 'buefy'
import '@/assets/scss/main.scss'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(fas)

import ValidationObserver from '@/components/ValidationObserver.vue'
import ValidationProvider from '@/components/ValidationProvider.vue'

const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)
const db = getDatabase(firebaseApp)

export { firebaseApp }

const app = createApp(App)

app.config.globalProperties.$firebase = {
  app: firebaseApp,
  auth: auth,
  db: db
}

app.use(Buefy, { defaultIconPack: 'fas' })
app.component('font-awesome-icon', FontAwesomeIcon)
app.component('ValidationObserver', ValidationObserver)
app.component('ValidationProvider', ValidationProvider)

app.use(router)
app.use(store)

app.mount('#app')

store.dispatch('checkDatabaseConnection')
    .then(connected => {
        if (!connected) {
            console.error('No database connection established');
            return;
        }

        console.log('App created, checking auth state');
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('Auth state changed: User is signed in', user.email, 'UID:', user.uid);
                store.commit('setUser', user.uid)
                store.commit('setuserEmail', user.email)

                console.log('Loading data after auth state change');
                Promise.all([
                    store.dispatch('loadTimeEntries'),
                    store.dispatch('loadCustomerEntries')
                ]).then(() => {
                    console.log('All data loaded after auth state change');

                    const userEntries = store.state.userTimeEntries;
                    const userId = user.uid;

                    if (userEntries && userEntries[userId] && userEntries[userId].fullname) {
                        console.log('Setting username from user entries:', userEntries[userId].fullname);
                        store.commit('setUserName', userEntries[userId].fullname);
                    } else {
                        console.warn('Could not find user data for:', userId);
                    }
                }).catch(err => {
                    console.error('Error loading data after auth state change:', err);
                });
            } else {
                console.log('Auth state changed: No user signed in');
            }
        });
    })
    .catch(err => {
        console.error('Error checking database connection:', err);
    });
