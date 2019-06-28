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
                                                ref="autocomplete"
                                                open-on-focus
                                                :data="filteredKundenArray"
                                                placeholder="e.g. Metropolis"
                                                icon="building"
                                                @select="option => selected = option">
                                                <template slot="footer">
                                                    <a @click="showAddKunde">
                                                        <span> Neuer Kunde… </span>
                                                    </a> 
                                                </template>
                                                <template slot="empty">Leider keine Kunden namens {{kunde}}</template>
                                            </b-autocomplete>
                                        </b-field>

                                        <b-field label="Bereich hinzufügen" v-if="kunde !== ''">
                                            <b-field>
                                                <b-input icon="folder-open" expanded v-model="newbereich"></b-input><p class="control"><b-button type="is-primary" outlined @click="addBereich">Submit</b-button></p>
                                            </b-field>
                                        </b-field>

                                        <b-message v-if="kunde !== ''" class="has-text-left">
                                            <!-- TODO: add @close to get confirmation, and then delete -->
                                            <b-taglist>
                                                <b-tag v-for="option in getBereicheArray(kunde)" :value="option" :key="option" rounded type="is-dark" closable @close="showDeleteConfirmation(kunde, 'bereiche', option)">{{ option }}</b-tag>
                                            </b-taglist>
                                        </b-message>

                                        <b-field label="Job hinzufügen" v-if="kunde !== ''">
                                            <b-field>
                                                <b-input icon="file-alt" expanded v-model="newjob"></b-input><p class="control"><b-button type="is-primary" outlined @click="addJob">Submit</b-button></p>
                                            </b-field>
                                        </b-field>

                                        <b-message v-if="kunde !== ''" class="has-text-left">
                                            <b-taglist>
                                                <b-tag v-for="option in getJobsArray(kunde)" :value="option" :key="option" rounded type="is-dark" closable @close="showDeleteConfirmation(kunde, 'jobs', option)">{{ option }}</b-tag>
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
                for (keys[i++] in this.customerEntries) {}
                return keys
            }
        },
        methods: {
            loadCustomerData() {
                this.$store.dispatch('loadCustomerEntries')
            },
            getBereicheArray(kunde) {
                // check in each array if it has that one
                for (let entry in this.customerEntries) {
                    if (this.customerEntries[entry].name === kunde) {
                        return this.customerEntries[entry].bereiche
                    }
                }
            },
            getJobsArray(kunde) {
                for (let entry in this.customerEntries) {
                    if (this.customerEntries[entry].name === kunde) {
                        return this.customerEntries[entry].jobs
                    }
                }
            },
            showAddKunde() {
                this.$dialog.prompt({
                    message: `Kunde hinzufügen`,
                    inputAttrs: {
                        placeholder: 'e.g. fuxpax',
                        maxlength: 20,
                        value: this.kunde
                    },
                    confirmText: 'Add',
                    onConfirm: (value) => {
                        this.kunden.push(value)
                        this.$refs.autocomplete.setSelected(value)
                        this.$store.dispatch('addCustomer', {
                            name: value
                        }).then(
                            this.$toast.open('"' + value + '" als Kunde hinzugefügt!')
                            // close dialog
                        )
                    }
                })
            },
            getIDXfromCustomer(customer) {
                // console.log(customer)
                let myIndex = this.kunden.indexOf(customer)
                // console.log(myIndex)
                let myIDX = this.idxs[myIndex]
                return myIDX
            },
            getIndex(kunde, section, thingToDelete) {
                let myIndex
                if (section === 'bereiche') {
                    let myBereiche = this.getBereicheArray(kunde)
                    // console.log(myBereiche)
                    // console.log(thingToDelete)

                    myIndex = this.getKeyByValue(myBereiche, thingToDelete)
                    //myBereiche.indexOf(thingToDelete)
                    // console.log(myIndex)
                } else if (section === 'jobs') {
                    let myJobs = this.getJobsArray(kunde)
                    // console.log(myJobs)
                    myIndex = this.getKeyByValue(myJobs, thingToDelete)
                    // myJobs.indexOf(thingToDelete)
                    // console.log(myIndex)
                }
                return myIndex
            },
            getKeyByValue(object, value) {
              return Object.keys(object).find(key => object[key] === value);
            },
            showDeleteConfirmation(kunde, section, thingToDelete) {
                let myKey
                if (section === 'bereiche') {
                    myKey = this.getKeyByValue(this.getBereicheArray(kunde), thingToDelete)
                } else if (section === 'jobs') {
                    myKey = this.getKeyByValue(this.getJobsArray(kunde), thingToDelete)
                }
                this.$dialog.confirm({
                    title: 'Löschen?',
                    message: 'Bist du sicher, du willst ' + kunde + 's "' + thingToDelete + '" <b>löschen</b>? Du kannst es später immer noch wieder neue hinzufügen.',
                    confirmText: 'Wirklich löschen',
                    type: 'is-danger',
                    hasIcon: true,
                    onConfirm: () => {
                        this.$store.dispatch('removeBereich', {
                            idx: this.getIDXfromCustomer(kunde),
                            customer: kunde,
                            section: section,
                            keyToDelete: myKey,
                            itemToDelete: this.getIndex(kunde, section, thingToDelete)
                        }).then(
                            this.$toast.open('"' + thingToDelete + '" gelöscht!')
                        )
                    }
                })
            },
            addBereich() {
                // console.log("add " + this.newbereich + " bereich?")
                // first dispatch new bereich to store
                // we want to send the kunde chosen, as well
                this.$store.dispatch('addBereich', {
                    idx: this.getIDXfromCustomer(this.kunde),
                    bereich: this.newbereich
                })
                // then show succes toast
                .then(
                    this.$toast.open('"' + this.newbereich + '" added!')
                ).then(
                    this.newbereich = ""
                )
            },
            addJob() {
                // console.log("add " + this.newjob + " job?")
                // first dispatch new job to store
                // we want to send the kunde chosen, as well
                this.$store.dispatch('addJob', {
                    idx: this.getIDXfromCustomer(this.kunde),
                    job: this.newjob
                })
                // then show succes toast
                .then(
                    this.$toast.open('"' + this.newjob + '" added!')
                ).then(
                    this.newjob = ""
                )
            }
        },
        mounted() {
            this.loadCustomerData()
        }
    }
</script>