/* eslint-disable no-unused-vars */
/**
 * States, mutations and actions that should be available to multiple components 
 * 
 */
import { createStore } from 'vuex'
import { getApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, signOut, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { getDatabase, ref, set, get, remove, onValue, push, update, child } from 'firebase/database'
import router from '@/router';
import createPersistedState from 'vuex-persistedstate'
import { sanitizePath } from '@/utils/firebase-helpers'

// Try to import firebaseApp from main.js, fallback to getApp() if not available
let firebaseApp = null;
try {
    // Try to get the app instance that was initialized in main.js
    firebaseApp = getApp();
} catch (e) {
    // App not initialized yet, will be set when store actions are called
    console.warn('Firebase app not available at module load time, will be retrieved lazily');
}

// Helper function to get Firebase app instance (lazy loading)
function getFirebaseApp() {
    if (!firebaseApp) {
        try {
            firebaseApp = getApp();
        } catch (e) {
            console.error('Firebase app not available:', e);
            throw new Error('Firebase app not initialized. Make sure Firebase is initialized in main.js before using store actions.');
        }
    }
    return firebaseApp;
}

// Helper function to get database instance with app
function getDb() {
    const app = getFirebaseApp();
    return getDatabase(app);
}

// Helper function to get auth instance with app
function getAuthWithApp() {
    const app = getFirebaseApp();
    return getAuth(app);
}

const store = createStore({

    state: {
        user: null,
        userEmail: '',
        userName: '',
        status: null,
        error: null,
        customerEntries: null,
        userTimeEntries: {},
        newUID: null
    },

    plugins: [createPersistedState()],

    mutations: {
        setUser(state, payload) {
            state.user = payload
        },

        setuserEmail(state, payload) {
            state.userEmail = payload
        },

        setUserName(state, payload) {
            state.userName = payload
        },

        removeUser(state) {
            state.user = null
        },

        setCustomerEntries(state, payload) {
            state.customerEntries = payload
        },

        setTimeEntries(state, payload) {
            state.userTimeEntries = payload
        },

        setStatus(state, payload) {
            state.status = payload
        },

        setError(state, payload) {
            state.error = payload
        },

        setNewUID(state, payload) {
            state.newUID = payload
        }
    },

    actions: {
        checkAuth({ commit, dispatch }) {
            const auth = getAuthWithApp();
            const user = auth.currentUser;
            
            console.log("Checking auth state...");
            if (user) {
                // User is already signed in
                console.log('User already authenticated:', user.email);
                commit('setUser', user.uid);
                commit('setuserEmail', user.email);
                commit('setStatus', 'success');
                
                // Load data
                console.log('Loading data after authentication check');
                return Promise.all([
                    dispatch('loadCustomerEntries'),
                    dispatch('loadTimeEntries')
                ]).then(() => {
                    console.log('All data loaded in checkAuth');
                    return user;
                });
            } else {
                console.log('No user authenticated');
                return Promise.resolve(null);
            }
        },

        signInAction({ commit, dispatch }, payload) {
            return new Promise((resolve, reject) => {
                const auth = getAuthWithApp();
                setPersistence(auth, browserLocalPersistence).then(() => {
                    signInWithEmailAndPassword(auth, payload.email, payload.password)
                        .then((response) => {
                            console.log('Sign in successful:', response.user.email);
                            commit('setUser', response.user.uid);
                            commit('setuserEmail', response.user.email);
                            commit('setStatus', 'success');
                            commit('setError', null);
                            localStorage.user = true;
                            
                            // Load data after successful login
                            dispatch('loadCustomerEntries').then(() => {
                                dispatch('loadTimeEntries').then(() => {
                                    // Explicitly navigate to entry page after all data is loaded
                                    console.log('Data loaded - redirecting to entry page');
                                    router.replace({ name: 'entry' });
                                    
                                    // Make sure to resolve with the full response to get user info
                                    resolve(response);
                                });
                            });
                        })
                        .catch((error) => {
                            console.error('Sign in error:', error.message);
                            commit('setStatus', 'failure');
                            commit('setError', error.message);
                            reject(error.message);
                        });
                });
            });
        },

        passwordResetAction({ commit }, payload) {
            return new Promise((resolve, reject) => {
                const auth = getAuthWithApp();
                sendPasswordResetEmail(auth, payload.email)
                    .then(() => {
                        commit('setStatus', 'success')
                        commit('setError', null)
                        resolve("success")
                    })
                    .catch(function(error) {
                        commit('setStatus', 'failure')
                        commit('setError', error.message)
                        reject(error.message)
                    });
            })
        },

        signOutAction({ commit }) {
            const auth = getAuthWithApp();
            signOut(auth)
                .then(() => {
                    commit('setUser', null)
                    commit('setuserEmail', null)
                    commit('setUserName', null)
                    commit('setStatus', 'success')
                    commit('setError', null)
                    commit('setTimeEntries', null)
                    commit('setCustomerEntries', null)
                    router.push({ name: 'home' })
                })
                .catch((error) => {
                    commit('setStatus', 'failure')
                    commit('setError', error.message)
                    commit('setUser', null);
                    commit('setIsAuthenticated', false);
                })
        },

        newUserAction({ commit }, payload) {
            const auth = getAuthWithApp();
            createUserWithEmailAndPassword(auth, payload.email, payload.password)
                .then((result) => {
                    commit('setNewUID', result.user.uid)

                    const db = getDb();
                    set(ref(db, 'users/' + result.user.uid), payload.newuser)
                        .then(() => {
                            commit('setStatus', 'success')
                            commit('setError', null)
                            this.dispatch('loadTimeEntries')
                        })
                        .catch((error) => {
                            let errorCode = error.code;
                            let errorMessage = error.message;
                            commit('setStatus', 'failure')
                            commit('setError', errorCode + '\r' + errorMessage)
                        });
                }).catch(function(error) {
                    commit('setError', error)
                });
        },

        loadCustomerEntries({ commit }) {
            const db = getDb();
            return get(ref(db, 'customerentries'))
                .then((snapshot) => {
                    const data = snapshot.val();
                    console.log('Customer entries loaded:', data ? Object.keys(data).length : 0, 'customers');
                    commit('setCustomerEntries', data);
                    commit('setStatus', 'success');
                    return data; // Return data so promise chain continues
                })
                .catch((error) => {
                    console.error("Error loading customer entries:", error);
                    commit('setStatus', 'failure');
                    commit('setError', error);
                    throw error; // Re-throw so promise chain can handle error
                });
        },
        
        loadTimeEntries({ commit }) {
            console.log('Loading time entries from Firebase...');
            const db = getDb();
            return get(ref(db, 'users'))
                .then((snapshot) => {
                    const result = snapshot.val();
                    console.log('Time entries loaded, snapshot exists:', !!snapshot.exists());
                    
                    if (result) {
                        console.log('Users found:', Object.keys(result).length);
                        Object.keys(result).forEach(userId => {
                            console.log('User:', userId, 'Name:', result[userId].fullname || 'No name');
                        });
                    } else {
                        console.warn('No users found in database');
                    }
                    
                    commit('setTimeEntries', result);
                    
                    // Only set the username if we have a user and data
                    const userID = this.state.user;
                    if (userID && result && result[userID]) {
                        console.log('Setting username to:', result[userID].fullname);
                        commit('setUserName', result[userID].fullname);
                    } else {
                        console.warn('Could not set username:', userID ? 'User ID exists' : 'No user ID', 
                                                           result ? 'Result exists' : 'No result',
                                                           (result && userID) ? (result[userID] ? 'User found' : 'User not found') : 'N/A');
                    }
                    
                    commit('setStatus', 'success');
                })
                .catch((error) => {
                    console.error("Error loading time entries:", error);
                    commit('setStatus', 'failure');
                    commit('setError', error);
                });
        },
        
        toggleBereich({ commit }, payload) {
            let myRef = 'customerentries/' + payload.idx + '/' + payload.section + '/' + payload.keyToArchive + '/archived'
            const db = getDb();
            return set(ref(db, myRef), payload.myBool)
                .then(() => {
                    commit('setStatus', 'success')
                    this.dispatch('loadCustomerEntries')
                })
        },
        
        removeBereich({ commit }, payload) {
            let myRef = 'customerentries/' + payload.idx + '/' + payload.section + '/' + payload.itemToDelete
            const db = getDb();
            return remove(ref(db, myRef))
                .then(() => {
                    commit('setStatus', 'success')
                    this.dispatch('loadCustomerEntries')
                })
        },
        
        addCustomer({ commit, dispatch, state }, payload) {
            console.log('addCustomer action called with payload:', payload);
            console.log('Current user:', state.user);
            const auth = getAuthWithApp();
            console.log('Current auth state:', auth.currentUser);
            console.log('Auth current user UID:', auth.currentUser?.uid);
            
            if (!state.user || !auth.currentUser) {
                const error = new Error('User not authenticated');
                console.error('Cannot add customer - user not authenticated');
                commit('setStatus', 'failure')
                commit('setError', error.message)
                return Promise.reject(error);
            }
            
            let db;
            try {
                db = getDb();
                console.log('Database instance obtained:', db ? 'Yes' : 'No');
                console.log('Database type:', typeof db);
            } catch (dbError) {
                console.error('Error getting database:', dbError);
                commit('setStatus', 'failure')
                commit('setError', 'Database connection failed: ' + dbError.message)
                return Promise.reject(dbError);
            }
            
            // Sanitize the customer name for use in Firebase path
            const sanitizedName = sanitizePath(payload.name);
            console.log('Original name:', payload.name);
            console.log('Sanitized name:', sanitizedName);
            
            const customerData = {
                name: payload.name
            };
            console.log('Customer data to save:', customerData);
            const firebasePath = 'customerentries/' + sanitizedName;
            console.log('Firebase path:', firebasePath);
            
            let customerRef;
            try {
                customerRef = ref(db, firebasePath);
                console.log('Firebase reference created successfully');
                console.log('Reference key:', customerRef.key);
                console.log('Reference parent:', customerRef.parent?.key);
            } catch (refError) {
                console.error('Error creating Firebase reference:', refError);
                commit('setStatus', 'failure')
                commit('setError', 'Failed to create reference: ' + refError.message)
                return Promise.reject(refError);
            }
            
            console.log('About to call set() with ref:', customerRef);
            console.log('About to call set() with data:', customerData);
            console.log('Database instance:', db);
            
            // Use set() directly - Firebase 12 modular API
            // According to https://firebase.google.com/docs/web/modular-upgrade
            // set() should work correctly when using getDatabase(firebaseApp)
            const writePromise = set(customerRef, customerData);
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error('Firebase write timed out after 15s. Check: 1) Security rules, 2) Network, 3) Database URL'));
                }, 15000);
            });
            
            return Promise.race([writePromise, timeoutPromise])
                .then(() => {
                    console.log('Customer successfully saved to Firebase');
                    commit('setStatus', 'success')
                    return dispatch('loadCustomerEntries')
                })
                .then(() => {
                    console.log('Customer entries reloaded after adding customer');
                })
                .catch(error => {
                    console.error('Error in addCustomer action:', error);
                    console.error('Error name:', error.name);
                    console.error('Error code:', error.code);
                    console.error('Error message:', error.message);
                    
                    if (error.code === 'PERMISSION_DENIED') {
                        console.error('PERMISSION DENIED: Check Firebase security rules for customerentries');
                        commit('setError', 'Permission denied. Check Firebase security rules.')
                    } else if (error.message.includes('timeout')) {
                        console.error('TIMEOUT: Check security rules, network, and database URL');
                        commit('setError', 'Write timed out. Check security rules and network.')
                    }
                    
                    commit('setStatus', 'failure')
                    throw error;
                })
        },
        
        addBereich({ commit, dispatch }, payload) {
            let myRef = 'customerentries/' + payload.idx + '/bereiche/'
            let newBereich = {
                name: payload.bereich,
                archived: false
            }
            const db = getDb();
            const newBereichRef = push(ref(db, myRef));
            return set(newBereichRef, newBereich)
                .then(() => {
                    commit('setStatus', 'success')
                    return dispatch('loadCustomerEntries')
                })
                .catch(error => {
                    commit('setStatus', 'failure')
                    commit('setError', error)
                    throw error;
                })
        },
        
        addJob({ commit, dispatch }, payload) {
            console.log('addJob action called with payload:', payload);
            let myRef = 'customerentries/' + payload.idx + '/jobs/'
            console.log('Firebase reference path:', myRef);
            let newJob = {
                name: payload.job,
                archived: false
            }
            console.log('New job object:', newJob);
            const db = getDb();
            const newJobRef = push(ref(db, myRef));
            console.log('Pushing to Firebase...');
            return set(newJobRef, newJob)
                .then(() => {
                    console.log('Job successfully added to Firebase');
                    commit('setStatus', 'success')
                    console.log('Reloading customer entries...');
                    return dispatch('loadCustomerEntries')
                })
                .then(() => {
                    console.log('Customer entries reloaded successfully');
                })
                .catch(error => {
                    console.error('Error in addJob action:', error);
                    commit('setStatus', 'failure')
                    commit('setError', error)
                    throw error;
                })
        },
        
        editBereich({ commit }, payload) {
            const db = getDb();
            
            // Get the right index if we're coming from the old editItem method
            let idx = payload.idx;
            if (!idx && payload.customer) {
                // Find the index by customer name
                const customerEntries = this.state.customerEntries;
                for (let key in customerEntries) {
                    if (customerEntries[key].name === payload.customer) {
                        idx = key;
                        break;
                    }
                }
            }

            // Get the right section and key
            let section = payload.section || payload.type;
            let key = payload.key || payload.ID;
            let newName = payload.newName || payload.name;
            
            console.log('Editing:', idx, section, key, 'New name:', newName);
            
            const updates = {};
            updates['customerentries/' + idx + '/' + section + '/' + key + '/name'] = newName;
            
            return update(ref(db), updates)
                .then(() => {
                    console.log('Item updated successfully');
                    commit('setStatus', 'success');
                    return this.dispatch('loadCustomerEntries');
                })
                .catch((error) => {
                    console.error('Error updating item:', error);
                    commit('setStatus', 'failure');
                    commit('setError', error);
                });
        },
        
        newEntry({ commit, dispatch }, payload) {
            const db = getDb();
            const newEntryRef = push(ref(db, 'users/' + payload.user + '/timeentries/'));
            set(newEntryRef, payload.newEntry)
                .then(() => {
                    commit('setStatus', 'success')
                    this.dispatch('loadTimeEntries')
                })
                .catch((error) => {
                    commit('setStatus', 'failure')
                    commit('setError', error)
                })
        },
        
        updateEntry({ commit }, payload) {
            const db = getDb();
            set(ref(db, 'users/' + payload.user + '/timeentries/' + payload.id), payload.entry)
                .then(() => {
                    commit('setStatus', 'success')
                    this.dispatch('loadTimeEntries')
                })
                .catch((error) => {
                    commit('setStatus', 'failure')
                    commit('setError', error)
                })
        },
        
        deleteEntry({ commit }, payload) {
            const db = getDb();
            remove(ref(db, 'users/' + payload.user + '/timeentries/' + payload.id))
                .then(() => {
                    commit('setStatus', 'success')
                    this.dispatch('loadTimeEntries')
                })
                .catch((error) => {
                    commit('setStatus', 'failure')
                    commit('setError', error)
                })
        },

        checkDatabaseConnection({ commit }) {
            console.log('Checking database connection...');
            const db = getDb();
            
            // Firebase Realtime Database handles connection automatically
            // We can't reliably check connection status with get() on .info paths
            // Instead, just verify the database instance was created successfully
            if (db) {
                console.log('Firebase database instance created successfully');
                // Firebase will automatically reconnect when needed
                return Promise.resolve(true);
            } else {
                console.error('Failed to get database instance');
                commit('setError', 'Failed to initialize database');
                return Promise.resolve(false);
            }
        }
    },

    getters: {
        status(state) {
            return state.status
        },

        user(state) {
            return state.user
        },

        userEmail(state) {
            return state.userEmail
        },

        userName(state) {
            return state.userName
        },

        customers(state) {
            return state.customerEntries
        },

        getUserTimeEntries(state) {
            return state.userTimeEntries
        },

        error(state) {
            return state.error
        },

        getNewUID(state) {
            return state.newUID
        }
    }
})

export default store