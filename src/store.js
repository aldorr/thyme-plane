/* eslint-disable no-unused-vars */
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
        signInAction({ commit }, payload) {
            return new Promise((resolve, reject) => {
                firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function() {
                    firebase
                        .auth()
                        .signInWithEmailAndPassword(payload.email, payload.password)
                        .then((response) => {
                            commit('setUser', response.user.uid)
                            commit('setuserEmail', response.user.email)
                            commit('setStatus', 'success')
                            commit('setError', null)
                            localStorage.user = true;
                            // this.dispatch('loadCustomerEntries')
                            // this.dispatch('loadTimeEntries')
                            // router.push('about')
                            router.push({ name: 'about' })
                            resolve(response)
                        })
                        .catch((error) => {
                            commit('setStatus', 'failure')
                            commit('setError', error.message)
                                // router.push('/')
                            reject(error.message)
                        })
                })
            })

        },

        passwordResetAction({ commit }, payload) {
            // return new Promise((resolve, reject) => {
            //         resolve("success")
            //     })
            return new Promise((resolve, reject) => {
                firebase
                    .auth()
                    .sendPasswordResetEmail(payload.email)
                    .then(() => {
                        commit('setStatus', 'success')
                        commit('setError', null)
                            // Email sent.
                        resolve("success")
                    })
                    .catch(function(error) {
                        commit('setStatus', 'failure')
                        commit('setError', error.message)
                            // router.push('/')
                        reject(error.message)
                    });

            })
        },

        signOutAction({ commit }) {
            firebase.auth().signOut()
                .then(() => {
                    commit('setUser', null)
                    commit('setuserEmail', null)
                    commit('setUserName', null)
                    commit('setStatus', 'success')
                    commit('setError', null)
                    commit('setTimeEntries', null)
                    router.push({ name: 'home' })
                })
                .catch((error) => {
                    commit('setStatus', 'failure')
                    commit('setError', error.message)
                    commit('setUser', null);
                    commit('setIsAuthenticated', false);
                    // router.push('/');
                })
        },

        newUserAction({ commit }, payload) {
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
                .then(function(result) {
                    // result.user.tenantId should be ‘TENANT_PROJECT_ID’.
                    // console.log(result.user)
                    // console.log(result.user.uid)
                    commit('setNewUID', result.user.uid)

                    // do we get something in return, that we can then use in the database path to create new user
                    // that way we can associate logged in user with their own data
                    firebase
                        .database()
                        .ref('users/' + result.user.uid)
                        .set(payload.newuser)
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
                }).catch(function(error) {
                    // Handle error.
                    commit('setError', error)
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
                    let result = snapshot.val()
                    commit('setTimeEntries', result)
                        // get username from timeEntries based on the UID
                        // i.e. here from Component... not working
                })
                .then(() => {
                    let userID = this.state.user
                    let userTimeEntries = this.state.userTimeEntries
                        // console.log(userID)
                        // console.log(userTimeEntries)
                        // console.log(userTimeEntries[userID])
                    commit('setUserName', userTimeEntries[userID].fullname)
                    commit('setStatus', 'success')
                })
                .catch((error) => {
                    commit('setStatus', 'failure')
                    commit('setError', error)
                })
        },
        toggleBereich({ commit }, payload) {
            let myRef = 'customerentries/' + payload.idx + '/' + payload.section + '/' + payload.keyToArchive + '/archived'
            console.log(myRef)
            console.log(payload.myBool)
            return firebase
                .database()
                .ref(myRef)
                .set(payload.myBool)
                .then(() => {
                    commit('setStatus', 'success')
                    this.dispatch('loadCustomerEntries')
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
                .ref('customerentries/' + payload.name)
                .set(payload)
                .then(() => {
                    commit('setStatus', 'success')
                    this.dispatch('loadCustomerEntries')
                })
        },
        addBereich({ commit }, payload) {
            let myRef = 'customerentries/' + payload.idx + '/bereiche/'
                // console.log(myRef)
                // let myKey = Math.floor(Date.now() + Math.random())
            let newBereich = {
                name: payload.bereich,
                archived: false
            }
            return firebase
                .database()
                .ref(myRef)
                .push(newBereich)
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
            let newJob = {
                name: payload.job,
                archived: false
            }
            return firebase
                .database()
                .ref(myRef)
                .push(newJob)
                .then(() => {
                    commit('setStatus', 'success')
                        // console.log(this.state.customerEntries[payload.idx].jobs + ": " + myKey)
                        // this.state.customerEntries[payload.idx].jobs[myKey]=payload.job
                    this.dispatch('loadCustomerEntries')
                })
        },
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
        newEntry({ commit }, payload) {
            // let myRef = 'users/' + payload.user + '/timeentries/'
            // console.log(myRef)
            // console.log(payload.newEntry)
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