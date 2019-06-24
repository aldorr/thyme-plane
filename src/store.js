import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import router from '@/router';

Vue.use(Vuex)

const store = new Vuex.Store({

  state: {
    user: null,
    status: null,
    error: null,
    customerEntries: null
  },

  mutations: {
    setUser (state, payload) {
      state.user = payload
    },

    removeUser (state) {
      state.user = null
    },

    setCustomerEntries (state, payload) {
      state.customerEntries = payload
    }
    ,
    setStatus (state, payload) {
      state.status = payload
    },

    setError (state, payload) {
      state.error = payload
    }
  },

  actions: {
    signInAction ({ commit }, payload) {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function(){
        firebase
          .auth()
          .signInWithEmailAndPassword(payload.email, payload.password)
        .then((response) => {
          commit('setUser', response.user.uid)
          commit('setStatus', 'success')
          commit('setError', null)
          localStorage.user = true;
          router.push('/about');
        })
        .catch((error) => {
          commit('setStatus', 'failure')
          commit('setError', error.message)
          router.push('/')
        })
      })
    },

    signOutAction ({ commit }) {
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
    loadCustomerEntries({ commit }) {
        return firebase
          .database()
          .ref('customerentries')
          .once('value', snapshot => {
            commit('setCustomerEntries', snapshot.val());
        })
        .catch(() => {
          // eslint-disable-next-line
          console.log("Sorry, couldn't get customers")
        })
    },
    removeBereich({ state, commit }, payload) {
      let myRef = 'customerentries/' + payload.idx + '/' + payload.section + '/' + payload.itemToDelete
      // console.log(myRef)
      // console.log(state.customerEntries);
      return firebase
        .database()
        .ref(myRef)
        .remove()
        .then(
          // just reload customers after committing to firebase
          this.dispatch('loadCustomerEntries')
        )
      // console.log(payload)
    },
    addCustomer({ state, commit }, payload) {
      firebase
        .database()
        .ref('customerentries')
        .push(payload)
        .then(
          this.dispatch('loadCustomerEntries')
        )
    },
    addBereich({ state, commit }, payload) {
      let myRef = 'customerentries/' + payload.idx + '/bereiche/'
      // console.log(myRef)
      let myKey = Math.floor(Date.now() + Math.random())
      return firebase
        .database()
        .ref(myRef)
        .push(payload.bereich)
        .then(
          // console.log(this.state.customerEntries[payload.idx].bereiche)
          // this.state.customerEntries[payload.idx].bereiche[myKey]=payload.bereich
          this.dispatch('loadCustomerEntries')
        )
    },
    addJob({ state, commit }, payload) {
      let myRef = 'customerentries/' + payload.idx + '/jobs/'
      // console.log(myRef)
      let myKey = Math.floor(Date.now() + Math.random())
      return firebase
        .database()
        .ref(myRef)
        .push(payload.job)
        .then(
          // console.log(this.state.customerEntries[payload.idx].jobs + ": " + myKey)
          // this.state.customerEntries[payload.idx].jobs[myKey]=payload.job
          this.dispatch('loadCustomerEntries')
        )
    }
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
    // newEntry({ state }, payload) {
    //   firebase
    //       .database()
    //       .ref('users')
    //       .child(state.user.user.uid)
    //       .push(payload)
    // },
    // eslint-disable-next-line
    // loadEntries({ state, commit }) {
    //     return firebase
    //         .database()
    //         .ref('users')
    //         .child(state.user.user.uid)
    //         .once('value', snapshot => {
    //             commit('setEntries', snapshot.val());
    //         })
    // },
  },

  getters: {
    status (state) {
      return state.status
    },

    user (state) {
      return state.user
    },

    customers (state) {
      return state.customerEntries
    },

    error (state) {
      return state.error
    }
  }
})

export default store