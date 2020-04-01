<template>
    <nav class="navbar is-white is-fixed-top">
        <div class="container">
            
            <div class="navbar-brand">
                <router-link class="navbar-item" :to="userLoggedIn?'/':'/login'">
                <img src="../assets/logo.png" width="140" height="27">
                </router-link>

                <div class="navbar-item navbar-meta">
                    <div class="buttons is-right">
                        <b-button icon-left="user" class="button is-light" @click="openLogin()" v-if="!userLoggedIn">Anmelden</b-button>
                        <b-button icon-left="user-slash" class="button is-warning" outlined @click="logoutFromFirebase" v-if="userLoggedIn"></b-button>
                        <b-button icon-left="user-plus" class="button is-success" inverted @click="addNewUser" v-if="userLoggedIn"></b-button>
<!-- TODO: Disabled - needs work -->
                        <!-- <b-button icon-left="tools" class="button" tag="router-link" to="/admin" type="is-default" v-if="userLoggedIn"></b-button> -->
                    </div>
                </div>

                <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarThyme" v-on:click="showNav = !showNav" v-bind:class="{ 'is-active':showNav }" v-if="userLoggedIn">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarThyme" class="navbar-menu" v-bind:class="{ 'is-active':showNav }">
                <div class="navbar-start has-text-right-touch" v-if="userLoggedIn">
                    <router-link v-for="navitem in navitems" :key="navitem.title" :to="navitem.link" class="navbar-item">
                        <b-icon :icon="navitem.icon" size="is-small" :type="navitem.type"> </b-icon>
                        <span>{{navitem.title}}</span>
                    </router-link>
                </div>
            </div>

            <div id="navbarMeta" class="navbar navbar-menu">
                <div class="navbar-end">
                    <div class="navbar-item">
                        <div class="buttons is-right">
                            <b-button icon-left="user" class="button is-light" @click="openLogin()" v-if="!userLoggedIn">Anmelden</b-button>
                            <b-button icon-left="user-slash" class="button is-warning" outlined @click="logoutFromFirebase" v-if="userLoggedIn">Abmelden</b-button>
                            <b-button icon-left="user-plus" class="button is-success" inverted @click="addNewUser" v-if="userLoggedIn"></b-button>
<!-- TODO: Disabled - needs work -->
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
            }
            ]
            return menuItems
        },
        userLoggedIn () {
            return this.$store.getters.user
        }
    },
    mounted() {
        if(this.hideNavLogins == undefined) {
            this.navLogin = true
        } else {
            this.navLogin = this.hideNavLogins
        }
    },
    methods: {
        logoutFromFirebase () {
            // first show a confirmation thing

            this.$buefy.dialog.confirm({
                title: 'Komm bald wieder',
                message: 'Kein Problem. <br>Wir warten hier auf dich.',
                confirmText: 'Tschüß',
                type: 'is-warning',
                hasIcon: true,
                icon: 'hand-paper',
                cancelText: 'Bleib hier',
                onConfirm: () => {
                    this.$store.dispatch('signOutAction')
                    .then(() => {
                        this.$buefy.toast.open({
                            message: 'Komm bald wieder!',
                            type: 'is-primary',
                            position: 'is-bottom'
                        })
                    })
                }
            })

        },
        openLogin() {
            this.$buefy.modal.open({
                parent: this,
                component: SigninVue,
                hasModalCard: true,
                trapFocus: true
            })
            this.hideNav()
        },
        addNewUser() {
            this.$buefy.modal.open({
                parent: this,
                component: AdduserVue,
                hasModalCard: true,
                trapFocus: true
            })
        },
        hideNav() {
            this.showNav = false
        }
    }
}
</script>

<style>
.navbar-brand .navbar-item.navbar-meta {
    margin-left: auto;
}
.navbar-brand .navbar-burger {
    margin-left: unset;
}
@media screen and (min-width: 1024px) {
    .navbar.is-white #navbarThyme .navbar-start>a.navbar-item.router-link-active {
        background-color: #f2f2f2;
        color: #0a0a0a;
    }
    .navbar-brand .navbar-item.navbar-meta {
        display: none;
    }
}

.icon.is-small {
    margin-right: 0.25em;
}
</style>
