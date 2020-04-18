<template>
    <div id="is-jobs-editor" class="section is-view">
        <div class="container">
            <div class="columns">
                <div class="column is-8 is-offset-2">
                    <div class="card">
                        <form action="#">
                            <header class="card-header">
                                <p class="card-header-title">Kunden, Bereiche & Jobs bearbeiten</p>
                            </header>
                            <div class="card-content">
                                <div class="columns">
                                    <div class="column">
                                        <!-- TODO: These will come from the db -->
                                        <b-field label="Kunde auswählen">
                                            <b-autocomplete
                                                v-model="kunde"
                                                ref="kunde"
                                                open-on-focus
                                                :data="filteredKundenArray"
                                                placeholder="e.g. Metropolis"
                                                icon="building"
                                                @select="option => selected = option">
                                                <template slot="empty">
                                                    <a @click="showAddKunde">
                                                        <span> Kunde "{{kunde}}" neu Anlegen? </span>
                                                    </a>
                                                </template>
                                            </b-autocomplete>
                                        </b-field>

                                        <b-field label="Bereich hinzufügen" v-if="kunde !== '' && kundeExists">
                                            <b-field>
                                                <b-input icon="folder-open" expanded v-model="newbereich"></b-input><p class="control"><b-button type="is-primary" outlined @click="addBereich">Submit</b-button></p>
                                            </b-field>
                                        </b-field>

                                        <b-message v-if="kunde !== '' && kundeExists" class="has-text-left">
                                            <b-taglist>
                                                <b-tag v-for="option in getBereicheArray" :value="option" :key="option" rounded type="is-dark" closable @close="showDeleteConfirmation('bereiche', option)">{{ option }}</b-tag>
                                            </b-taglist>
                                        </b-message>

                                        <b-field label="Job hinzufügen" v-if="kunde !== '' && kundeExists">
                                            <b-field>
                                                <b-input icon="file-alt" expanded v-model="newjob"></b-input><p class="control"><b-button type="is-primary" outlined @click="addJob">Submit</b-button></p>
                                            </b-field>
                                        </b-field>

                                        <b-message v-if="kunde !== '' && kundeExists" class="has-text-left">
                                            <b-taglist>
                                                <b-tag v-for="option in getJobsArray" :value="option" :key="option" rounded type="is-dark" closable @close="showDeleteConfirmation('jobs', option)">{{ option }}</b-tag>
                                            </b-taglist>
                                        </b-message>

                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// This was just test data... now getting from firebase
    // const data = {
    //     "entries": {
    //         "-aLajr3939r": {
    //             "id": 0,
    //             "name": "Elbphilharmonie",
    //             "bereiche": ["Broschure E","Monatsprogramm E"],
    //             "jobs": ["Something E","Something else E"]
    //         },
    //         "-aLjr39489rja": {
    //             "id": 1,
    //             "name": "Metropolis Kino",
    //             "bereiche": ["Broschure M", "Monatsprogramm M"],
    //             "jobs": ["Something M", "Something else M"]
    //         }
    //     }
    // }

    export default {
        data() {
            return {
                // data,
                kunde: '',
                idx: '',
                todaysdate: new Date(),
                newbereich: '',
                newjob: ''
            }
        },
        computed: {
            filteredKundenArray() {
                return this.kunden.filter((option) => {
                    return option
                        .toString()
                        .toLowerCase()
                        .indexOf(this.kunde.toLowerCase()) >= 0
                })
            },
            customerEntries() {
                return this.$store.state.customerEntries
            },
            kunden() {
                let myKundenReturn = []
                // let idxs = Object.keys(this.$store.state.customerEntries)
                // this.idxs = idxs
                for (let entry in this.customerEntries) {
                    myKundenReturn.push(this.customerEntries[entry].name)
                }
                return myKundenReturn
            },
            idxs() {
                var keys = [], i = 0;
                // eslint-disable-next-line no-empty
                for (keys[i++] in this.customerEntries) {}
                return keys
            },
            getBereicheArray() {
                let kunde = this.kunde
                let custObject = this.customerEntries
                let returnBereiche = {}
                for (let entry in custObject) {
                    if (custObject[entry].name === kunde) {
                        returnBereiche = custObject[entry].bereiche
                    }
                }
                return returnBereiche
            },
            getJobsArray() {
                let kunde = this.kunde
                let custObject = this.customerEntries
                let returnJobs = {}
                for (let entry in custObject) {
                    if (custObject[entry].name === kunde) {
                        returnJobs = custObject[entry].jobs
                    }
                }
                return returnJobs
            },
            kundeExists() {
                if (this.filteredKundenArray.length > 0) {
                    return true
                } else {
                    return false
                }
            },
            bereichExists() {       
                let bereich = this.newbereich
                let bereicheObj = this.getBereicheArray
                let bereicheArray = Object.values(bereicheObj)
                let be = bereicheArray.findIndex(k => k.toLowerCase()==bereich.toLowerCase());
                if (be !== -1) {
                    return true
                } else {
                    return false
                }
            },
            jobExists() {
                let job = this.newjob
                let jobsObj = this.getJobsArray
                let jobsArray = Object.values(jobsObj)
                let je = jobsArray.findIndex(k => k.toLowerCase()==job.toLowerCase());
                if (je !== -1) {
                    return true
                } else {
                    return false
                }
            }
        },
        methods: {
            loadCustomerData() {
                this.$store.dispatch('loadCustomerEntries')
            },
            showAddKunde() {
                this.$buefy.dialog.prompt({
                    message: `Kunde hinzufügen`,
                    inputAttrs: {
                        placeholder: 'e.g. fuxpax',
                        maxlength: 20,
                        value: this.kunde
                    },
                    confirmText: 'Add',
                    onConfirm: (value) => {
                        this.kunden.push(value)
                        this.$refs.kunde.setSelected(value)
                        this.$store.dispatch('addCustomer', {
                            name: value
                        }).then(
                            this.$buefy.toast.open('"' + value + '" als Kunde hinzugefügt!')
                            // close dialog
                        )
                    }
                })
            },
            getIDXfromCustomer(customer) {
                let myIndex = this.kunden.indexOf(customer)
                let myIDX = this.idxs[myIndex]
                return myIDX
            },
            getIndex(kunde, section, thingToDelete) {
                let myIndex
                if (section === 'bereiche') {
                    let myBereiche = this.getBereicheArray
                    myIndex = this.getKeyByValue(myBereiche, thingToDelete)
                } else if (section === 'jobs') {
                    let myJobs = this.getJobsArray
                    myIndex = this.getKeyByValue(myJobs, thingToDelete)
                }
                return myIndex
            },
            getKeyByValue(object, value) {
              return Object.keys(object).find(key => object[key] === value);
            },
            showDeleteConfirmation(section, thingToDelete) {
                let myKey
                if (section === 'bereiche') {
                    myKey = this.getKeyByValue(this.getBereicheArray, thingToDelete)
                } else if (section === 'jobs') {
                    myKey = this.getKeyByValue(this.getJobsArray, thingToDelete)
                }
                this.$buefy.dialog.confirm({
                    title: 'Löschen?',
                    message: 'Bist du sicher, du willst ' + this.kunde + 's "' + thingToDelete + '" <b>löschen</b>? Du kannst es später immer noch wieder neu hinzufügen.',
                    confirmText: 'Wirklich löschen',
                    type: 'is-danger',
                    hasIcon: true,
                    onConfirm: () => {
                        this.$store.dispatch('removeBereich', {
                            idx: this.getIDXfromCustomer(this.kunde),
                            customer: this.kunde,
                            section: section,
                            keyToDelete: myKey,
                            itemToDelete: this.getIndex(this.kunde, section, thingToDelete)
                        }).then(
                            this.$buefy.toast.open('"' + thingToDelete + '" gelöscht!')
                        )
                    }
                })
            },
            addBereich() {
                // first make sure we don't already have this bereich
                if (!this.bereichExists && this.newbereich !== "") {
                    // dispatch new bereich to store
                    // we want to send the kunde chosen, as well
                    this.$store.dispatch('addBereich', {
                        idx: this.getIDXfromCustomer(this.kunde),
                        bereich: this.newbereich
                    })
                    // then show succes toast
                    .then(
                        this.$buefy.toast.open('"' + this.newbereich + '" added!')
                    ).then(
                        this.newbereich = ""
                    )
                } else if (this.newbereich !== "") {
                    this.$buefy.toast.open('Bereich "' + this.newbereich + '" gibt es schon.')
                } else {
                    this.$buefy.toast.open('Bitte einen neuen Bereich eingeben')
                }
            },
            addJob() {
                // first make sure we don't already have this job
                if (!this.jobExists && this.newjob !== "") {
                    // dispatch new job to store
                    // we want to send the kunde chosen, as well
                    this.$store.dispatch('addJob', {
                        idx: this.getIDXfromCustomer(this.kunde),
                        job: this.newjob
                    })
                    // then show succes toast
                    .then(
                        this.$buefy.toast.open('"' + this.newjob + '" added!')
                    ).then(
                        this.newjob = ""
                    )
                } else if (this.newjob !== "") {
                    this.$buefy.toast.open('Job "' + this.newjob + '" gibt es schon.')
                } else {
                    this.$buefy.toast.open('Bitte einen neuen Job eingeben')
                }
            },
        },
        mounted() {
            this.loadCustomerData()
        }
    }
</script>