/**
 * Sets the path for our various tabs.
 * 
 */
import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import store from './store'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/login',
            name: 'home',
            component: Home
        },
        {
            path: '/',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                import ( /* webpackChunkName: "about" */ './views/About.vue'),
            meta: {
                authRequired: true
            }
        },
        {
            path: '/jobs',
            name: 'jobs',
            component: () =>
                import ('./views/Jobs.vue'),
            meta: {
                authRequired: true
            }
        },
        {
            path: '/entry',
            name: 'entry',
            component: () =>
                import ('./views/Entry.vue'),
            meta: {
                authRequired: true
            }
        },
        {
            path: '/list',
            name: 'list',
            component: () =>
                import ('./views/List.vue'),
            meta: {
                authRequired: true
            }
        },
        {
            path: '/admin',
            name: 'admin',
            component: () =>
                import ('./views/Admin.vue'),
            meta: {
                authRequired: true
            }
        }
    ]
})


/**
 * This should also check our auth state, and only show if we are authorized.
 * TODO: When reload, keep auth state!
 * 
 */
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.authRequired)) {
        if (store.state.user == null) {
            next({
                path: '/login'
            })
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router


// const guard = function(to, from, next) {
// check for valid auth token
// console.log(this.$store.status)
// console.log(this.$store.user)
// .then(response => {
//     // Token is valid, so continue
//     next()
// }).catch(error => {
//     // There was an error so redirect
//     window.location.href = "/login"
// })
// }