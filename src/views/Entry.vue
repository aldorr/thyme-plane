<template>
<!-- START SINGLE ADD -->
    <div id="is-time-add" class="section is-view">
        <div class="container">
            <div class="columns">
                <div class="column is-8 is-offset-2">
                    <div class="card">
                        <form action="#">
                            <header class="card-header">
                                <p class="card-header-title">
                                    Zeit erfassen für &nbsp; 
                                    <b-field :type="{'is-danger': errors.has('userName')}" :message="errors.first('userName')">
                                        <b-select placeholder="Name auswählen"
                                                name="userName"
                                                v-model="userName"
                                                v-validate="'required'" mode="eager" icon="user">
                                            <option
                                                v-for="option in userList"
                                                :value="option"
                                                :key="option">
                                                {{ option }}
                                            </option>
                                        </b-select>
                                    </b-field>
                                </p>
                            </header>
                            <div class="card-content">
                                <div class="columns">
                                    <div class="column">
                                        <b-field label="Kunde auswählen" :type="{'is-danger': errors.has('kunde')}" :message="errors.first('kunde')">
                                            <b-autocomplete
                                            expanded
                                                name="kunde"
                                                v-model="kunde"
                                                ref="autocomplete"
                                                open-on-focus
                                                :data="filteredKundenArray"
                                                placeholder="e.g. Metropolis"
                                                icon="building"
                                                @select="option => selected = option"
                                                @input="clearJobs"
                                                 v-validate="'required'" key="customer-input">
                                                <template slot="empty">Leider keine Kunden namens {{kunde}}</template>
                                            </b-autocomplete>
                                        </b-field>

                                        <b-field label="Bereich" v-if="kunde !== ''" :type="{'is-danger': errors.has('bereich')}" :message="errors.first('bereich')">
                                            <b-autocomplete
                                            expanded
                                                name="bereich"
                                                v-model="bereich"
                                                ref="autocomplete"
                                                open-on-focus
                                                :data="filteredBereicheArray"
                                                placeholder="Bereich Wählen"
                                                icon="folder-open"
                                                @select="option => selected = option"
                                                 v-validate="'required'" key="bereich-input">
                                                <template slot="empty">No results for "{{bereich}}"</template>
                                            </b-autocomplete>
                                        </b-field>

                                        <b-field label="Job" v-if="kunde !== ''" :type="{'is-danger': errors.has('job')}" :message="errors.first('job')">
                                            <b-autocomplete
                                            expanded
                                                name="job"
                                                v-model="job"
                                                ref="autocomplete"
                                                open-on-focus
                                                :data="filteredJobsArray"
                                                placeholder="Job Wählen"
                                                icon="file-alt"
                                                @select="option => selected = option"
                                                 v-validate="'required'" key="job-input">
                                                <template slot="empty">No results for "{{job}}"</template>
                                            </b-autocomplete>
                                        </b-field>
                                    </div>
                                    
                                    <div class="column">
                                        <b-field label="Datum" :type="{'is-danger':errors.has('date')}" :message="errors.first('date')">
                                            <b-datepicker
                                                name="date"
                                                placeholder="Click to select..."
                                                icon="calendar" class="is-small" v-model="date" expanded
                                                :max-date="maxDate"
                                                 v-validate="'required'" key="date-input">
                                                <div class="buttons is-right">
                                                    <button class="button is-primary is-fullwidth"
                                                        @click.prevent="date = new Date()">
                                                        <b-icon icon="calendar-alt"></b-icon>
                                                        <span>Heute</span>
                                                    </button>
                                                    <button class="button is-danger is-fullwidth"
                                                        @click.prevent="date = null">
                                                        <b-icon icon="times-circle"></b-icon>
                                                        <span>Zurücksetzen</span>
                                                    </button>
                                                </div>
                                            </b-datepicker>
                                        </b-field>

                                        <b-field label="Zeitspanne" :type="{'is-danger':errors.has('duration')}" :message="errors.first('duration')">
                                                <b-input name="duration" placeholder='01h 05m' class="duration" :value="duration | durationFilter" v-cleave="masks.duration" v-validate="'required'" v-on:keyup.native="onInput" icon="clock"
                                                key="time-input"/>
                                        </b-field>

                                        <b-field label="Notiz">
                                            <b-input type="textarea" v-model="note"></b-input>
                                        </b-field>
                                        
                                    </div>
                                </div>
                            </div>
                            <div class="card-footer is-right">
                                <div class="field is-grouped is-grouped-right" style="margin-left:auto;">
                                    <div class="control card-footer-item">
                                        <button class="button is-text" @click.prevent="addEntry">Cancel</button>
                                    </div>
                                    <div class="control card-footer-item is-link">
                                        <button class="button is-link" @click.prevent="addEntry">Submit</button>
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
</template>

<script>

    import Cleave from 'cleave.js'

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
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        this.$dialog.confirm({
                            title: 'Eingaben nochmals überprüfen',
                            message: 'Mitarbeiter: ' + this.userName +'<br>Kunde: ' + this.kunde + '<br>Bereich: ' + this.bereich + '<br>Job: ' + this.job + '<br>Datum: ' + this.dateToHuman + '<br>Zeitspanne: ' + this.duration + '<br>Notiz: ' + this.note,
                            confirmText: 'Okay',
                            type: 'is-default',
                            hasIcon: true,
                            icon: 'calendar',
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
                                    this.$toast.open({duration: 5000,
                                        message: `Added!`,
                                        position: 'is-bottom',
                                        type: 'is-success'
                                    }),
                                    this.resetData()
                                )
                            }
                        })
                    } else {
                      this.$toast.open({
                        message: 'It seems your form is missing something! Please check the fields.',
                        type: 'is-danger',
                        position: 'is-bottom'
                      })
                    }
                })
            },
            resetData(){
                this.kunde = '',
                this.bereich = '',
                this.job = '',
                this.date = new Date(),
                this.duration = '',
                this.note = ''
            },
            loadAllData() {
                this.$store.dispatch('loadCustomerEntries')
                this.$store.dispatch('loadTimeEntries')
                .then(() => {
                    this.timeEntries = this.$store.state.userTimeEntries
                    this.userName = this.currentUserName
                })
            },
            setKundeSubs() {
                this.bereiche = this.bereiche
            },
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
label.label {
    text-align: left;
}
</style>