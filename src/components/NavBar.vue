<template>
    <nav class="navbar is-white is-fixed-top">
        <div class="container">
            <div class="navbar-brand">
                <router-link class="navbar-item" to="/">
                <img src="../assets/logo.png" width="112" height="27">
                </router-link>
                <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarThyme" v-on:click="showNav = !showNav" v-bind:class="{ 'is-active':showNav }">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarThyme" class="navbar-menu" v-bind:class="{ 'is-active':showNav }">
                <div class="navbar-start" v-if="userLoggedIn">
                    <router-link v-for="navitem in navitems" :key="navitem.title" :to="navitem.link" class="navbar-item">
                        <b-icon :icon="navitem.icon" size="is-small" :type="navitem.type"> </b-icon>
                        <span>{{navitem.title}}</span>
                    </router-link>
                </div>

                <div class="navbar-end">
                    <div class="navbar-item">
                        <div class="buttons">
                            <b-button icon-left="user" class="button is-light" @click="openLogin()" v-if="!userLoggedIn">Anmelden</b-button>
                            <b-button icon-left="user" class="button is-warning" @click="logoutFromFirebase" v-if="userLoggedIn">Abmelden</b-button>
                            <b-button icon-left="user-plus" class="button is-default" @click="addNewUser" v-if="userLoggedIn"></b-button>

                            <!-- <b-button icon-left="tools" class="button" tag="router-link" to="/admin" type="is-default" v-if="userLoggedIn"></b-button> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
import SigninVue from '@/components/auth/SignIn.vue'
import AdduserVue from '@/components/auth/AddUser.vue'
export default {
    name: "NavBar",
    props: ['hideNavLogins'],
    data() {
        return {
            showNav: false,
            navLogin: true
        }
    },
    watch: {
        '$route' () {
            this.hideNav()
        }
    },
    computed: {
        navitems () {
            let menuItems = [
            {
                title: 'Kunden editieren',
                icon: 'pen',
                link: '/jobs',
                type: 'is-danger'
            },
            {
                title: 'Zeiteingabe',
                icon: 'plus',
                link: '/entry',
                type: 'is-success'
            },
            {
                title: 'Zeitübersicht',
                icon: 'calendar',
                link: '/list',
                type: 'is-primary'
            },
            {
                title: 'Über',
                icon: 'info',
                link: '/about',
                type: 'is-dark'
            }
            ]
            return menuItems
        },
        userLoggedIn () {
            return this.$store.getters.user
        }
    },
    mounted() {
        this.navLogin = this.hideNavLogins
        if(this.hideNavLogins == undefined) {
            this.navLogin = true
        }
    },
    methods: {
        logoutFromFirebase () {
            this.$store.dispatch('signOutAction')
        },
        openLogin() {
            this.$modal.open({
                parent: this,
                component: SigninVue,
                hasModalCard: true,
                props: {
                }
            })
            this.hideNav()
        },
        addNewUser() {
            this.$modal.open({
                parent: this,
                component: AdduserVue,
                hasModalCard: true,
                props: {
                }
            })
        },
        hideNav() {
            this.showNav = false
        }
    }
}
</script>

<style>
@media screen and (min-width: 1024px) {
    .navbar.is-white #navbarThyme .navbar-start>a.navbar-item.router-link-active {
        background-color: #f2f2f2;
        color: #0a0a0a;
    }
}
.icon.is-small {
    margin-right: 0.25em;
}
</style>
