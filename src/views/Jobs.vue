<template>
    <div id="is-jobs-editor" class="section is-view">
        <div class="container">
            <div class="columns">
                <div class="column is-8 is-offset-2">
                    <div class="card">
                        <form action="#">
                            <header class="card-header">
                                <p class="card-header-title">Edit Client, Area &amp; Jobs</p>
                            </header>
                            <div class="card-content">
                                <div class="columns">
                                    <div class="column">
                                        <!-- TODO: These will come from the db -->
                                        <b-field label="Choose or Add Client">
                                            <b-autocomplete v-model="kunde" ref="kunde" open-on-focus
                                                :data="filteredKundenArray" placeholder="e.g. Forest Inc"
                                                icon="building" @select="option => selected = option">
                                                <template slot="empty">
                                                    <a @click="showAddKunde">
                                                        <span> Add new client "{{kunde}}" </span>
                                                    </a>
                                                </template>
                                            </b-autocomplete>
                                        </b-field>

                                        <b-field label="Add Area" v-if="kunde !== '' && kundeExists">
                                            <form @submit.prevent="addBereich">
                                                <b-field>
                                                    <b-input icon="folder-open" expanded v-model="newbereich"></b-input>
                                                    <p class="control">
                                                        <b-button type="is-primary" outlined @click="addBereich">Submit
                                                        </b-button>
                                                    </p>
                                                </b-field>
                                            </form>
                                        </b-field>

                                        <b-message type="is-primary" v-if="kunde !== '' && kundeExists" class="has-text-left">
                                            <b-field grouped group-multiline>
                                                <div class="control" v-for="option in visibleBereicheObject" :key="option.name">
                                                    <b-taglist attached>
                                                        <b-tag rounded type="is-dark" size="is-medium">
                                                            <b-button class="is-edit" type="is-dark" size="is-small" @click.prevent="editItem('bereiche', option)">{{ option.name }}</b-button></b-tag>
                                                        <b-tag rounded type="is-dark" size="is-medium">
                                                            <a @click.prevent="showToggleArchive('bereiche', option)"><b-button icon-left="angle-down" size="is-small" type="is-dark"></b-button></a></b-tag>
                                                    </b-taglist>
                                                </div>
                                            </b-field>
                                        </b-message>
                                        <article class="message is-white">
                                            <b-button  v-if="kunde !== '' && kundeExists && !isEmpty(archivedBereicheObject)" type="is-warning is-outlined" @click="bereicheArchActive=!bereicheArchActive" expanded >Archived areas</b-button>
                                            <b-message v-if="kunde !== '' && kundeExists && !isEmpty(archivedBereicheObject)" class="has-text-left" type="is-warning" :active.sync="bereicheArchActive">
                                                <b-field grouped group-multiline>
                                                    <div class="control" v-for="option in archivedBereicheObject" :key="option.name">
                                                        <b-taglist attached>
                                                            <b-tag rounded type="is-dark" size="is-medium">
                                                                <b-button class="is-edit" type="is-dark" size="is-small" @click.prevent="editItem('bereiche', option)">{{ option.name }}</b-button></b-tag>
                                                            <b-tag rounded type="is-dark" size="is-medium">
                                                                <a @click.prevent="showToggleArchive('bereiche', option)"><b-button icon-left="angle-up" size="is-small" type="is-dark"></b-button></a></b-tag>
                                                        </b-taglist>
                                                    </div>
                                                </b-field>
                                            </b-message>
                                        </article>

                                        <b-field label="Add Job" v-if="kunde !== '' && kundeExists">
                                            <form @submit.prevent="addJob">
                                                <b-field>
                                                    <b-input icon="file-alt" expanded v-model="newjob"></b-input>
                                                    <p class="control">
                                                        <b-button type="is-primary" outlined @click="addJob">Submit
                                                        </b-button>
                                                    </p>
                                                </b-field>
                                            </form>
                                        </b-field>

                                        <b-message type="is-primary" v-if="kunde !== '' && kundeExists" class="has-text-left">
                                            <b-field grouped group-multiline>
                                                <div class="control" v-for="option in visibleJobsObject" :key="option.name">
                                                    <b-taglist attached>
                                                        <b-tag rounded type="is-dark" size="is-medium">
                                                            <b-button class="is-edit" type="is-dark" size="is-small" @click.prevent="editItem('jobs', option)">{{ option.name }}</b-button></b-tag>
                                                        <b-tag rounded type="is-dark" size="is-medium">
                                                            <a @click.prevent="showToggleArchive('jobs', option)"><b-button icon-left="angle-down" size="is-small" type="is-dark"></b-button></a></b-tag>
                                                    </b-taglist>
                                                </div>
                                            </b-field>
                                        </b-message>

                                        <article class="message is-white">
                                            <b-button  v-if="kunde !== '' && kundeExists && !isEmpty(archivedJobsObject)" type="is-warning is-outlined" @click="jobsArchActive=!jobsArchActive" expanded >Archived Jobs</b-button>
                                            <b-message v-if="kunde !== '' && kundeExists && !isEmpty(archivedJobsObject)" class="has-text-left" type="is-warning" :active.sync="jobsArchActive">
                                                <b-field grouped group-multiline>
                                                    <div class="control" v-for="option in archivedJobsObject" :key="option.name">
                                                        <b-taglist attached>
                                                            <b-tag rounded type="is-dark" size="is-medium">
                                                                <b-button class="is-edit" type="is-dark" size="is-small" @click.prevent="editItem('jobs', option)">{{ option.name }}</b-button></b-tag>
                                                            <b-tag rounded type="is-dark" size="is-medium">
                                                                <a @click.prevent="showToggleArchive('jobs', option)"><b-button icon-left="angle-up" size="is-small" type="is-dark"></b-button></a></b-tag>
                                                        </b-taglist>
                                                    </div>
                                                </b-field>
                                            </b-message>
                                        </article>
                                    </div>
                                </div>
                            </div>
                            <footer class="card-footer"></footer>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                // data,
                kunde: '',
                idx: '',
                todaysdate: new Date(),
                newbereich: '',
                newjob: '',
                bereicheArchActive: false,
                jobsArchActive: false
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
            allBereicheObject() {
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
            visibleBereicheObject() {
                let allBereiche = this.allBereicheObject
                let returnBereiche = {}
                for (let bereich in allBereiche) {
                    // console.log(bereich)
                    if (allBereiche[bereich].archived == false) {
                        // console.log(allBereiche[bereich].archived)
                        returnBereiche[`${bereich}`] = allBereiche[bereich]
                    }
                }
                // returnBereiche = allBereiche
                return returnBereiche
            },
            archivedBereicheObject() {
                let allBereiche = this.allBereicheObject
                let returnBereiche = {}
                for (let bereich in allBereiche) {
                    if (allBereiche[bereich].archived == true) {
                        // console.log(allBereiche[bereich].archived)
                        returnBereiche[`${bereich}`] = allBereiche[bereich]
                    }
                }
                // returnBereiche = allBereiche
                // console.log(returnBereiche)
                return returnBereiche
            },
            allJobsObject() {
                let kunde = this.kunde
                let custObject = this.customerEntries
                let allJobs = {}
                for (let entry in custObject) {
                    if (custObject[entry].name === kunde) {
                        allJobs = custObject[entry].jobs
                    }
                }
                return allJobs
            },
            visibleJobsObject() {
                let allJobs = this.allJobsObject
                let returnJobs = {}
                for (let job in allJobs) {
                    // console.log(job)
                    if (allJobs[job].archived == false) {
                        // console.log(allJobs[job].archived)
                        returnJobs[`${job}`] = allJobs[job]
                    }
                }
                // returnJobs = allJobs
                return returnJobs
            },
            archivedJobsObject() {
                let allJobs = this.allJobsObject
                let returnJobs = {}
                for (let job in allJobs) {
                    if (allJobs[job].archived == true) {
                        // console.log(allJobs[job].archived)
                        returnJobs[`${job}`] = allJobs[job]
                    }
                }
                // returnJobs = allJobs
                // console.log(returnJobs)
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
                let bereicheObj = this.allBereicheObject
                let be = -1;
                // console.log(bereicheObj);
                if (bereicheObj!==null && bereicheObj !== undefined) {
                    let bereicheArray = Object.values(bereicheObj)
                    be = bereicheArray.findIndex(k => k.name.toLowerCase()==bereich.toLowerCase());
                }
                if (be !== -1) {
                    return true
                } else {
                    return false
                }
            },
            jobExists() {
                let job = this.newjob
                // console.log(job)
                let jobsObj = this.allJobsObject
                // console.log(jobsObj)
                let je = -1;
                // console.log(jobsArray)
                if (jobsObj !== null && jobsObj !== undefined) {
                    let jobsArray = Object.values(jobsObj)
                    je = jobsArray.findIndex(k => k.name.toLowerCase()==job.toLowerCase());
                }
                if (je !== -1) {
                    return true
                } else {
                    return false
                }
            },
        },
        methods: {
            migrate() {
                this.$store.dispatch('migrateDatabase')
            },
            loadCustomerData() {
                this.$store.dispatch('loadCustomerEntries')
            },
            showAddKunde() {
                this.$buefy.dialog.prompt({
                    message: `<p class="label">Kunde hinzufügen</p>`,
                    inputAttrs: {
                        placeholder: 'e.g. fuxpax',
                        maxlength: 20,
                        value: this.kunde
                    },
                    confirmText: 'Hinzufügen',
                    onConfirm: (value) => {
                        this.kunden.push(value)
                        this.$refs.kunde.setSelected(value)
                        this.$store.dispatch('addCustomer', {
                            name: value
                        }).then(
                            this.$buefy.toast.open({
                            duration: 5000,
                            message: '"' + value + '" als Kunde hinzugefügt!',
                            position: 'is-bottom',
                            type: 'is-success'
                        })
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
                    let myBereiche = this.allBereicheObject
                    myIndex = this.getKeyByValue(myBereiche, thingToDelete)
                } else if (section === 'jobs') {
                    let myJobs = this.allJobsObject
                    myIndex = this.getKeyByValue(myJobs, thingToDelete)
                }
                return myIndex
            },
            getKeyByValue(object, value) {
              return Object.keys(object).find(key => object[key] === value);
            },
            showToggleArchive(section, thingToToggle) {
                // console.log(thingToToggle)
                let myKey
                if (section === 'bereiche') {
                        myKey = this.getKeyByValue(this.allBereicheObject, thingToToggle)
                } else if (section === 'jobs') {
                        myKey = this.getKeyByValue(this.allJobsObject, thingToToggle)
                }
                // console.log(myKey)
                let myValue = thingToToggle.archived
                let myFeedback = myValue?'ctivate':'rchive'
                // console.log(myFeedback)
                let message1 = 'Are you sure you want to <b> a' + myFeedback + '</b> customer ' + this.kunde + '\'s "' + thingToToggle.name + '"? You have the ability to unarchive at a later date.'
                let title = 'A' + myFeedback + '?'
                let confirmText = myValue?'Really reactivate':'Really archive'
                let message2 = '"' + thingToToggle.name + '" ' + (myValue?'activated!':'archived!')
                this.$buefy.dialog.confirm({
                    title: title,
                    message: message1,
                    confirmText: confirmText,
                    type: 'is-warning',
                    hasIcon: true,
                    onConfirm: () => {
                        this.$store.dispatch('toggleBereich', {
                            idx: this.getIDXfromCustomer(this.kunde),
                            customer: this.kunde,
                            section: section,
                            keyToArchive: myKey,
                            myBool: !myValue
                        }).then(
                            this.$buefy.toast.open({
                            duration: 5000,
                            message: message2,
                            position: 'is-bottom',
                            type: 'is-success'
                        })
                        )
                    }
                })
            },
            showDeleteConfirmation(section, thingToDelete) {
                let myKey
                if (section === 'bereiche') {
                    myKey = this.getKeyByValue(this.allBereicheObject, thingToDelete)
                } else if (section === 'jobs') {
                    myKey = this.getKeyByValue(this.allJobsObject, thingToDelete)
                }
                this.$buefy.dialog.confirm({
                    title: 'Delete?',
                    message: 'Are you sure you want to delete ' + this.kunde + "'s " + thingToDelete + '"? You can re-add this later.',
                    confirmText: 'Really delete',
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
                            this.$buefy.toast.open({
                            duration: 5000,
                            message: `"${thingToDelete}" deleted!`,
                            position: 'is-bottom',
                            type: 'is-success'
                        })
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
                        this.$buefy.toast.open({
                            duration: 5000,
                            message: `"${this.newbereich}" added!`,
                            position: 'is-bottom',
                            type: 'is-success'
                        })
                    ).then(
                        this.newbereich = ""
                    )
                } else if (this.newbereich !== "") {
                    this.$buefy.toast.open({
                            duration: 5000,
                            message: `Arera " ${this.newbereich}" already exists.`,
                            position: 'is-bottom',
                            type: 'is-danger'
                        })
                } else {
                    this.$buefy.toast.open({
                            duration: 5000,
                            message:`Please enter a new Area name.`,
                            position: 'is-bottom',
                            type: 'is-danger'
                        })
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
                        this.$buefy.toast.open({
                            duration: 5000,
                            message: `"${this.newjob}" added!`,
                            position: 'is-bottom',
                            type: 'is-success'
                        })
                    ).then(
                        this.newjob = ""
                    )
                } else if (this.newjob !== "") {
                    this.$buefy.toast.open({
                            duration: 5000,
                            message: `Job "${this.newjob}" already exists.`,
                            position: 'is-bottom',
                            type: 'is-danger'
                        })
                } else {
                    this.$buefy.toast.open({
                            duration: 5000,
                            message: `Please enter a new Job name.`,
                            position: 'is-bottom',
                            type: 'is-danger'
                        })
                }
            },
            editItem(type, item){
                // call an edit component
                // let kunde = this.kunde
                // console.log(kunde)
                // console.log(type)
                // console.log(item)
                let ID
                if (type == 'jobs') {
                    ID = this.getKeyByValue(this.allJobsObject, item)
                } else if (type == 'bereiche') {
                    ID = this.getKeyByValue(this.allBereicheObject, item)
                }

                this.$buefy.dialog.prompt({
                    message: `<p class="label">Edit</p>`,
                    inputAttrs: {
                        placeholder: item.name,
                        value: item.name
                    },
                    confirmText: 'Change',
                    onConfirm: (value) => {
                        if (item.name !== value) {
                            // this.kunden.push(value)
                            // this.$refs.kunde.setSelected(value)

                            this.$store.dispatch('editBereich', {
                                customer: this.kunde,
                                type: type,
                                ID: ID,
                                name: value
                            }).then(
                                this.$buefy.toast.open({
                                    duration: 5000,
                                    message: `"${item.name}" in "${value}" changed!`,
                                    position: 'is-bottom',
                                    type: 'is-warning'
                                })
                                // close dialog
                            )
                        } else {
                            this.$buefy.toast.open({
                                duration: 5000,
                                message: `Nothing changed.`,
                                position: 'is-bottom',
                                type: 'is-warning'
                            })
                        }
                    }
                })
            },
            // disableItem(type, item){
                // call an edit component
                // let kunde = this.kunde
                // console.log(kunde)
                // console.log(type)
                // console.log(item)
            // },
            // enableItem(type, item){
                // call an edit component
                // let kunde = this.kunde
                // console.log(kunde)
                // console.log(type)
                // console.log(item)
            // },
            isEmpty(obj) {
                for(var key in obj) {
                    if(Object.prototype.hasOwnProperty.call(obj, key))
                        return false;
                }
                return true;
            },
        },
        mounted() {
            this.loadCustomerData()
        }
    }
</script>
