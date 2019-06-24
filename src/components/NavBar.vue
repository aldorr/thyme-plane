<template>
    <nav class="navbar is-white is-fixed-top">
        <div class="container">
            <div class="navbar-brand">
                <router-link class="navbar-item" to="/">
                <img src="../assets/logo.png" width="112" height="27">
                </router-link>
                <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBreeder" v-on:click="showNav = !showNav" v-bind:class="{ 'is-active' : showNav }">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarBreeder" class="navbar-menu" v-bind:class="{ 'is-active' : showNav }">
                <div class="navbar-start" v-if="userLoggedIn">
                    <router-link v-for="navitem in navitems" :key="navitem.title" :to="navitem.link" class="navbar-item">
                        <b-icon :icon="navitem.icon" size="is-small" :type="navitem.type"> </b-icon>
                        <span>{{navitem.title}}</span>
                    </router-link>
                </div>

                <div class="navbar-end">
                    <div class="navbar-item">
                        <div class="buttons">
                            <b-button icon-left="user" class="button is-light" @click="openLogin()" v-if="!userLoggedIn">Sign In</b-button>
                            <b-button icon-left="user" class="button is-warning" @click="logoutFromFirebase" v-if="userLoggedIn">Sign Out</b-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
import SigninVue from '@/components/auth/SignIn.vue';
export default {
    name: "NavBar",
    props: ['hideNavLogins'],
    data() {
        return {
            showNav: false,
            navLogin: true
        }
    },
    computed: {
        navitems () {
            let menuItems = [
            {
                title: 'Edit Jobs',
                icon: 'pen',
                link: '/jobs',
                type: 'is-danger'
            },
            {
                title: 'Single Entry',
                icon: 'plus',
                link: '/entry',
                type: 'is-success'
            },
            {
                title: 'Monthly Overview',
                icon: 'calendar',
                link: '/list',
                type: 'is-primary'
            },
            {
                title: 'About',
                icon: 'info',
                link: '/about',
                type: 'is-dark'
            }
            ]
            return menuItems
        },
        metaitems () {
            let menuItems = [{
                title: 'Sign In',
                icon: 'user',
                link: 'openLogin()'
            }]
            return menuItems
        },
        userLoggedIn () {
            return this.$store.getters.user
        }
    },
    mounted() {
        this.navLogin = this.hideNavLogins
        if(this.hideNavLogins == undefined) {
            this.navLogin = true;
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
        }
    }
}
</script>

<style>
.icon.is-small {
    margin-right: 0.25em;
}
</style>
