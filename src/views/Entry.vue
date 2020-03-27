<template>
  <ValidationObserver ref="observer" v-slot="{ passes }">
    <!-- START SINGLE ADD -->
    <div id="is-time-add" class="section is-view">
        <div class="container">
            <div class="columns">
                <div class="column is-8 is-offset-2">
                    <div class="card">
                        <form action="#">
                            <header class="card-header">
                                <p class="card-header-title">
                                    <span class="column is-narrow">
                                    Zeit erfassen für &nbsp;
                                    </span>
                                    <span class="column is-narrow">
                                        <b-field>
                                            <b-select placeholder="Name auswählen" v-model="userName" mode="eager" icon="user">
                                                <option v-for="option in userList" :value="option" :key="option">
                                                    {{ option }}
                                                </option>
                                            </b-select>
                                        </b-field>
                                    </span>
                                </p>
                            </header>
                            <div class="card-content">
                                <div class="columns">
                                    <div class="column">
                                        <ValidationProvider name="kunde" rules="required" v-slot="{ errors, valid }">
                                            <b-field label="Kunde wählen" :type="{'is-danger': errors[0], 'is-success': valid}"
                                                :message="errors">
                                                <b-autocomplete expanded v-model="kunde" ref="autocomplete"
                                                    open-on-focus :data="filteredKundenArray"
                                                    placeholder="e.g. Metropolis" icon="building"
                                                    @select="option => selected = option" @input="clearJobs" key="customer">
                                                    <template slot="empty">Noch keine Kunden namens
                                                        {{kunde}}</template>
                                                </b-autocomplete>
                                            </b-field>
                                        </ValidationProvider>

                                        <ValidationProvider name="bereich" rules="required" v-slot="{ errors, valid }">
                                            <b-field label="Bereich wählen"
                                            :type="{'is-danger': errors[0] && kunde, 'is-success': valid, 'is-unselectable': !kunde}"
                                            :message="kunde?errors:''">
                                                <b-autocomplete expanded :disabled="!kunde" v-model="bereich" ref="autocomplete"
                                                    open-on-focus :data="filteredBereicheArray"
                                                    placeholder="Bereich Wählen" icon="folder-open"
                                                    @select="option => selected = option" key="bereich">
                                                    <template slot="empty">Noch keinen Bereich namens "{{bereich}}"</template>
                                                </b-autocomplete>
                                            </b-field>
                                        </ValidationProvider>

                                        <ValidationProvider name="job" rules="required" v-slot="{ errors, valid }">
                                            <b-field label="Job wählen"
                                                :type="{'is-danger': errors[0] && kunde, 'is-success': valid}" :message="kunde?errors:''">
                                                <b-autocomplete expanded :disabled="!kunde" v-model="job" ref="autocomplete"
                                                    open-on-focus :data="filteredJobsArray" placeholder="Job Wählen"
                                                    icon="file-alt" @select="option => selected = option"
                                                    key="job">
                                                    <template slot="empty">Noch keinen Job namens "{{job}}"</template>
                                                </b-autocomplete>
                                            </b-field>
                                        </ValidationProvider>
                                    </div>

                                    <div class="column">
                                        <ValidationProvider name="date" rules="required" v-slot="{ errors, valid }">
                                            <b-field label="Datum ändern" :type="{'is-danger': errors[0], 'is-success': valid}"
                                                message="Standard: Heute">
                                                <b-datepicker placeholder="Click to select..."
                                                    icon="calendar" class="is-small" v-model="date" expanded
                                                    :max-date="maxDate" key="date">
                                                    <div class="buttons is-right">
                                                        <button class="button is-primary is-fullwidth"
                                                            @click.prevent="date = new Date()">
                                                            <b-icon icon="calendar-alt"></b-icon>
                                                            <span>Heute</span>
                                                        </button>
                                                        <!-- <button class="button is-danger is-fullwidth"
                                                            @click.prevent="date = null">
                                                            <b-icon icon="times-circle"></b-icon>
                                                            <span>Zurücksetzen</span>
                                                        </button> -->
                                                    </div>
                                                </b-datepicker>
                                            </b-field>
                                        </ValidationProvider>
                                        <ValidationProvider name="duration" rules="required" v-slot="{ errors, valid }">
                                            <b-field label="Zeitspanne eingeben" :type="{'is-danger':errors[0], 'is-success': valid}"
                                                :message="{[errors]: errors[0], 'Im Format: 01h 05m': !errors[0]}">
                                                <b-input placeholder='01h 05m' class="duration"
                                                    :value="duration | durationFilter" v-cleave="masks.duration"
                                                    v-on:keyup.native="onInput" icon="clock"
                                                    key="time-input" />
                                            </b-field>
                                        </ValidationProvider>
                                        <b-field label="Notiz">
                                            <b-input type="textarea" v-model="note"></b-input>
                                        </b-field>
                                    </div>
                                </div>
                            </div>
                            <div class="card-footer is-right">
                                <div class="field is-grouped is-grouped-right" style="margin-left:auto;">
                                    <div class="control card-footer-item">
                                        <button class="button is-text" @click.prevent="resetData">Reset</button>
                                    </div>
                                    <div class="control card-footer-item is-link">
                                        <button class="button is-link" @click="passes(addEntry)">Submit</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- END SINGLE ADD -->
  </ValidationObserver>
</template>

<script>

    import Cleave from 'cleave.js'

    import { extend } from 'vee-validate';
    import { required } from 'vee-validate/dist/rules';
    // Add the required rule
    extend('required', {
        ...required,
        message: 'Nicht vergessen…'
    });

    import { ValidationObserver, ValidationProvider } from 'vee-validate'

    const cleave = {
        name: 'cleave',
        bind(el, binding) {
            const duration = el.querySelector('.duration input')
            duration._vCleave = new Cleave(duration, binding.value)
        },
        unbind(el) {
            const duration = el.querySelector('.duration input')
            duration._vCleave.destroy()
        }
    }

    export default {
        components: {
            ValidationObserver,
            ValidationProvider
        },
        directives: { cleave },
        data() {
            const today = new Date()

            return {
                kunde: '',
                idx: '',
                bereich: '',
                job: '',
                date: new Date(),
                maxDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                duration: '',
                masks: {
                    duration: {
                        delimiters: ['h ', 'm'],
                        blocks: [2, 2, 0],
                        numericOnly: true,
                        noImmediatePrefix: true
                    }
                },
                note: '',
                userName: '',
                timeEntries: {}
            }
        },
        computed: {
            currentUserName() {
                // get user's name with the id this.$store.getters.user
                let userID = this.$store.getters.user
                let currentUserName = this.timeEntries[userID].fullname
                return currentUserName
            },
            userList() {
                // get all users' names and ids
                let userList = []
                let timeEntries = this.timeEntries
                for (let [id] of Object.entries(timeEntries)) {
                    userList.push(timeEntries[id].fullname)
                }
                return userList
            },
            userIdList() {
                // get all users' names and ids
                let userIdList = []
                let timeEntries = this.timeEntries
                for (let [id] of Object.entries(timeEntries)) {
                    userIdList.push(id)
                }
                return userIdList
            },
            currentUserId() {
                let userIndex = this.userList.indexOf(this.userName)
                return this.userIdList[userIndex]
            },
            filteredKundenArray() {
                return this.kunden.filter((option) => {
                    return option
                        .toString()
                        .toLowerCase()
                        .indexOf(this.kunde.toLowerCase()) >= 0
                })
            },

            filteredBereicheArray() {
                return this.bereiche.filter((option) => {
                    return option
                        .toString()
                        .toLowerCase()
                        .indexOf(this.bereich.toLowerCase()) >= 0
                })
            },
            filteredJobsArray() {
                return this.jobs.filter((option) => {
                    return option
                        .toString()
                        .toLowerCase()
                        .indexOf(this.job.toLowerCase()) >= 0
                })
            },
            customerEntries() {
                return this.$store.state.customerEntries
            },
            kunden() {
                let myKundenReturn = []
                for (let entry in this.customerEntries) {
                    myKundenReturn.push(this.customerEntries[entry].name)
                }
                return myKundenReturn
            },
            bereiche() {
                let myBereicheReturn = []
                // check in each array if it has that one
                for (let entry in this.customerEntries) {
                    if (this.customerEntries[entry].name === this.kunde) {
                        for (let bereich in this.customerEntries[entry].bereiche) {
                            myBereicheReturn.push(this.customerEntries[entry].bereiche[bereich])
                        }
                    }
                }
                return myBereicheReturn
            },
            jobs() {
                let myJobsReturn = []
                for (let entry in this.customerEntries) {
                    if (this.customerEntries[entry].name === this.kunde) {
                        for (let job in this.customerEntries[entry].jobs) {
                            myJobsReturn.push(this.customerEntries[entry].jobs[job])
                        }
                    }
                }
                return myJobsReturn
            },
            idxs() {
                let keys = [], i = 0;
                for (keys[i++] in this.customerEntries) {
                    // do nothing?
                }
                return keys
            },
            rawDuration() {
                let mins = this.duration.slice(4, 6)
                let hrs = this.duration.slice(0, 2)
                return hrs * 60 * 60 + mins * 60
            },
            dateToString() {
                return this.date.toString()
            },
            dateToHuman() {
                let date = this.date
                let dateHuman
                let year    = date.getFullYear();
                let month   = date.getMonth() + 1;
                let day     = date.getDate();
                dateHuman = day + '.' + month + '.' + year
                return dateHuman
            }
        },
        methods: {
            addEntry() {
                // this.$validator.validateAll().then((result) => {
                //     if (result) {
                        this.$buefy.dialog.confirm({
                            title: 'Eingaben nochmals überprüfen',
                            message: 'Mitarbeiter: ' + this.userName +'<br>Kunde: ' + this.kunde + '<br>Bereich: ' + this.bereich + '<br>Job: ' + this.job + '<br>Datum: ' + this.dateToHuman + '<br>Zeitspanne: ' + this.duration + '<br>Notiz: ' + this.note,
                            confirmText: 'Speichern',
                            type: 'is-default',
                            hasIcon: true,
                            icon: 'calendar',
                            cancelText: 'Bearbeiten',
                            onConfirm: () => {
                                let user = this.currentUserId
                                let newEntry = {
                                    customer: this.kunde,
                                    area: this.bereich,
                                    job: this.job,
                                    date: this.dateToString,
                                    time: this.rawDuration,
                                    note: this.note
                                }
                                this.$store.dispatch('newEntry', {
                                    user: user,
                                    newEntry: newEntry
                                }).then(
                                    this.$buefy.toast.open({duration: 5000,
                                        message: `Added!`,
                                        position: 'is-bottom',
                                        type: 'is-success'
                                    }),
                                    this.resetData()
                                )
                            }
                        })
                //     } else {
                //       this.$buefy.toast.open({
                //         message: 'It seems your form is missing something! Please check the fields.',
                //         type: 'is-danger',
                //         position: 'is-bottom'
                //       })
                //     }
                // })
            },
            resetData(){
                this.kunde = '',
                this.bereich = '',
                this.job = '',
                this.date = new Date(),
                this.duration = '',
                this.note = ''
                requestAnimationFrame(() => {
                    this.$refs.observer.reset();
                });
            },
            loadAllData() {
                this.$store.dispatch('loadCustomerEntries')
                this.$store.dispatch('loadTimeEntries')
                .then(() => {
                    this.timeEntries = this.$store.state.userTimeEntries
                    this.userName = this.currentUserName
                })
            },
            // setKundeSubs() {
            //     this.bereiche = this.bereiche
            // },
            getKunde() {
                return this.data.kunde
            },
            getKundeBool() {
                if ( this.data.kunde != null ) {
                    return true
                } else {
                    return false
                }
            },
            clearJobs() {
                this.bereich = ''
                this.job = ''
                requestAnimationFrame(() => {
                    this.$refs.observer.reset();
                });
            },
            onInput(event) {
                this.duration = event.target._vCleave.getFormattedValue()
            }
        },
        filters: {
          durationFilter: function (value) {
            let hrs, mins
            if (value.length === 4) {
                hrs = value.slice(0, 2)
                if (hrs > 12) {
                    hrs = 12
                }
                return hrs + "h "
            }
            if (value.length >= 6) {
                mins = value.slice(4, 6)
                hrs = value.slice(0, 2)
                if (hrs > 12) {
                    hrs = 12
                }
                if (mins > 59) {
                    mins = 59
                }
                return hrs + "h " + mins + "m"
            } else {
                return value
            }

          }
        },
        mounted() {
            this.loadAllData()
        }
    }
</script>

<style>
span > .field {
    margin-bottom: 1em;
}
label.label {
    text-align: left;
}

</style>