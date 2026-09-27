import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getDatabase } from "firebase/database"
import { firebaseConfig } from "./firebase"

// Could reduce to only needed buefy components
import Buefy from 'buefy'
import 'buefy/dist/css/buefy.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(fas)

// Register VeeValidate compatibility wrapper components globally
import ValidationObserver from '@/components/ValidationObserver.vue'
import ValidationProvider from '@/components/ValidationProvider.vue'

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)
const db = getDatabase(firebaseApp)

// Export firebaseApp for use in store
export { firebaseApp }

// Create Vue app instance
const app = createApp(App)

// Make Firebase instances globally available
app.config.globalProperties.$firebase = {
  app: firebaseApp,
  auth: auth,
  db: db
}

// Register Buefy
app.use(Buefy, { defaultIconPack: 'fas' })

// Register FontAwesome component
app.component('font-awesome-icon', FontAwesomeIcon)

// Register VeeValidate components globally
app.component('ValidationObserver', ValidationObserver)
app.component('ValidationProvider', ValidationProvider)

// Use router and store
app.use(router)
app.use(store)

// Setup lifecycle hooks
app.mount('#app')

// Check database connectivity and auth state after mount
store.dispatch('checkDatabaseConnection')
    .then(connected => {
        if (!connected) {
            console.error('No database connection established');
            // Note: Buefy toast/notification needs to be accessed via app instance or composable
            return;
        }
        
        // Check auth state on app start
        console.log('App created, checking auth state');
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('Auth state changed: User is signed in', user.email, 'UID:', user.uid);
                // User is signed in
                store.commit('setUser', user.uid)
                store.commit('setuserEmail', user.email)
                
                // Load user data
                console.log('Loading data after auth state change');
                Promise.all([
                    store.dispatch('loadTimeEntries'),
                    store.dispatch('loadCustomerEntries')
                ]).then(() => {
                    console.log('All data loaded after auth state change');
                    
                    // Ensure username is set
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

// Legacy Vue 2 code - keeping for reference but not used
/*
new Vue({
    router,
    store,
    created() {
        // Check database connectivity first
        this.$store.dispatch('checkDatabaseConnection')
            .then(connected => {
                if (!connected) {
                    console.error('No database connection established');
                    this.$buefy.notification.open({
                        message: 'Failed to connect to the database. Please check your internet connection.',
                        type: 'is-danger',
                        position: 'is-bottom',
                        duration: 8000
                    });
                    return;
                }
                
                // Check auth state on app start
                console.log('App created, checking auth state');
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        console.log('Auth state changed: User is signed in', user.email, 'UID:', user.uid);
                        // User is signed in
                        this.$store.commit('setUser', user.uid)
                        this.$store.commit('setuserEmail', user.email)
                        
                        // Load user data
                        console.log('Loading data after auth state change');
                        Promise.all([
                            this.$store.dispatch('loadTimeEntries'),
                            this.$store.dispatch('loadCustomerEntries')
                        ]).then(() => {
                            console.log('All data loaded after auth state change');
                            
                            // Ensure username is set
                            const userEntries = this.$store.state.userTimeEntries;
                            const userId = user.uid;
                            
                            if (userEntries && userEntries[userId] && userEntries[userId].fullname) {
                                console.log('Setting username from user entries:', userEntries[userId].fullname);
                                this.$store.commit('setUserName', userEntries[userId].fullname);
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
    },
    render: h => h(App)
}).$mount('#app')
*/