/**
 * States, mutations and actions that should be available to multiple components 
 * 
 */
import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import router from '@/router';
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({

    state: {
        user: null,
        userEmail: '',
        status: null,
        error: null,
        customerEntries: null,
        userTimeEntries: null
    },

    plugins: [createPersistedState()],

    mutations: {
        setUser(state, payload) {
            state.user = payload
        },

        setuserEmail(state, payload) {
            state.userEmail = payload
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
        }
    },

    actions: {
        signInAction({ commit }, payload) {
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function() {
                firebase
                    .auth()
                    .signInWithEmailAndPassword(payload.email, payload.password)
                    .then((response) => {
                        // console.log(response)
                        commit('setUser', response.user.uid)
                        commit('setuserEmail', response.user.email)
                        commit('setStatus', 'success')
                        commit('setError', null)
                        localStorage.user = true;
                        router.push('/about');
                        this.dispatch('loadCustomerEntries')
                        this.dispatch('loadTimeEntries')
                    })
                    .catch((error) => {
                        commit('setStatus', 'failure')
                        commit('setError', error.message)
                        router.push('/')
                    })
            })
        },

        signOutAction({ commit }) {
            firebase.auth().signOut()
                .then(() => {
                    commit('setUser', null)
                    commit('setStatus', 'success')
                    commit('setError', null)
                    router.push('/')
                })
                .catch((error) => {
                    commit('setStatus', 'failure')
                    commit('setError', error.message)
                    commit('setUser', null);
                    commit('setIsAuthenticated', false);
                    router.push('/');
                })
        },

        newUserAction({ commit }, payload) {
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
            firebase
                .database()
                .ref('users')
                .push(payload.newuser)
                .then(() => {
                    commit('setStatus', 'success')
                    commit('setError', null)
                    this.dispatch('loadTimeEntries')
                })
                .catch((error) => {
                    // Handle Errors here.
                    let errorCode = error.code;
                    let errorMessage = error.message;
                    commit('setStatus', 'failure')
                    commit('setError', errorCode + '\r' + errorMessage)
                });
        },

        loadCustomerEntries({ commit }) {
            return firebase
                .database()
                .ref('customerentries')
                .once('value', snapshot => {
                    commit('setCustomerEntries', snapshot.val());
                })
                .then(() => {
                    commit('setStatus', 'success')
                })
                .catch((error) => {
                    commit('setStatus', 'failure')
                    commit('setError', error)
                })
        },
        loadTimeEntries({ commit }) {
            // get all of the customer entries
            return firebase
                .database()
                .ref('users')
                .once('value', snapshot => {
                    commit('setTimeEntries', snapshot.val());
                })
                .then(() => {
                    commit('setStatus', 'success')
                })
                .catch((error) => {
                    commit('setStatus', 'failure')
                    commit('setError', error)
                })
        },
        removeBereich({ commit }, payload) {
            let myRef = 'customerentries/' + payload.idx + '/' + payload.section + '/' + payload.itemToDelete
                // console.log(myRef)
                // console.log(state.customerEntries);
            return firebase
                .database()
                .ref(myRef)
                .remove()
                .then(() => {
                    commit('setStatus', 'success')
                        // just reload customers after committing to firebase
                    this.dispatch('loadCustomerEntries')
                })
                // console.log(payload)
        },
        addCustomer({ commit }, payload) {
            firebase
                .database()
                .ref('customerentries')
                .push(payload)
                .then(() => {
                    commit('setStatus', 'success')
                    this.dispatch('loadCustomerEntries')
                })
        },
        addBereich({ commit }, payload) {
            let myRef = 'customerentries/' + payload.idx + '/bereiche/'
                // console.log(myRef)
                // let myKey = Math.floor(Date.now() + Math.random())
            return firebase
                .database()
                .ref(myRef)
                .push(payload.bereich)
                .then(() => {
                    commit('setStatus', 'success')
                        // console.log(this.state.customerEntries[payload.idx].bereiche)
                        // this.state.customerEntries[payload.idx].bereiche[myKey]=payload.bereich
                    this.dispatch('loadCustomerEntries')
                })
        },
        addJob({ commit }, payload) {
            let myRef = 'customerentries/' + payload.idx + '/jobs/'
                // console.log(myRef)
                // let myKey = Math.floor(Date.now() + Math.random())
            return firebase
                .database()
                .ref(myRef)
                .push(payload.job)
                .then(() => {
                    commit('setStatus', 'success')
                        // console.log(this.state.customerEntries[payload.idx].jobs + ": " + myKey)
                        // this.state.customerEntries[payload.idx].jobs[myKey]=payload.job
                    this.dispatch('loadCustomerEntries')
                })
        },
        /**
         * TODO: need
         * load Jobs
         * load user's entries (per time frame?)
         */
        // eslint-disable-next-line
        // removeEntry({ state, commit, dispatch }, payload) {
        //     // delete i.e. -LeZ82YdBYt8rfz25bSq
        //     let toDelete = payload.idx
        //     // console.log(toDelete);
        //     firebase
        //         .database()
        //         .ref('users')
        //         .child(state.user.user.uid)
        //         .ref(toDelete)
        //         .remove()
        // },
        // eslint-disable-next-line
        newEntry({ commit }, payload) {
            let myRef = 'users/' + payload.user + '/timeentries/'
            console.log(myRef)
            console.log(payload.newEntry)
            return firebase
                .database()
                .ref('users')
                .child(payload.user)
                .child('timeentries')
                .push(payload.newEntry)
                .then(() => {
                    commit('setStatus', 'success')
                })
        },
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

        customers(state) {
            return state.customerEntries
        },

        usertimes(state) {
            return state.userTimeEntries
        },

        error(state) {
            return state.error
        }
    }
})

export default store