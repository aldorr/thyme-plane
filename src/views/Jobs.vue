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
                                                <template #default="option">
                                                    {{ option.option || option }}
                                                </template>
                                                <template v-slot:empty>
                                                    <div style="padding: 0.5rem;">
                                                        <a @click.prevent.stop="showAddKunde"
                                                            style="cursor: pointer; color: #3273dc; text-decoration: underline;">
                                                            <span> Add new client "{{ kunde }}" </span>
                                                        </a>
                                                    </div>
                                                </template>
                                            </b-autocomplete>
                                            <p class="help">Type a new client name and click "Add new client" if it
                                                doesn't exist</p>
                                            <button type="button" class="button is-small is-info" @click="showAddKunde"
                                                style="margin-top: 0.5rem;">New
                                                client</button>
                                        </b-field>

                                        <b-field label="Add Area" v-if="kunde !== '' && kundeExists">
                                            <b-field>
                                                <b-input icon="folder-open" expanded v-model="newbereich"
                                                    @keyup.enter="handleAddBereich"></b-input>
                                                <p class="control">
                                                    <button type="button" class="button is-primary is-outlined"
                                                        @click="handleAddBereich">Submit</button>
                                                </p>
                                            </b-field>
                                        </b-field>

                                        <b-message type="is-primary" v-if="kunde !== '' && kundeExists"
                                            class="has-text-left">
                                            <b-field grouped group-multiline>
                                                <div class="control" v-for="option in visibleBereicheObject"
                                                    :key="option.name">
                                                    <b-taglist attached>
                                                        <b-tag rounded type="is-dark" size="is-medium">
                                                            <b-button class="is-edit" type="is-dark" size="is-small"
                                                                @click.prevent="editItem('bereiche', option)">{{
                                                                    option.name }}</b-button></b-tag>
                                                        <b-tag rounded type="is-dark" size="is-medium">
                                                            <a @click.prevent="showToggleArchive('bereiche', option)"><b-button
                                                                    icon-left="angle-down" size="is-small"
                                                                    type="is-dark"></b-button></a></b-tag>
                                                    </b-taglist>
                                                </div>
                                            </b-field>
                                        </b-message>
                                        <article class="message is-white">
                                            <b-button
                                                v-if="kunde !== '' && kundeExists && !isEmpty(archivedBereicheObject)"
                                                type="is-warning is-outlined"
                                                @click="bereicheArchActive = !bereicheArchActive" expanded>Archived
                                                areas</b-button>
                                            <b-message
                                                v-if="kunde !== '' && kundeExists && !isEmpty(archivedBereicheObject)"
                                                class="has-text-left" type="is-warning"
                                                :active.sync="bereicheArchActive">
                                                <b-field grouped group-multiline>
                                                    <div class="control" v-for="option in archivedBereicheObject"
                                                        :key="option.name">
                                                        <b-taglist attached>
                                                            <b-tag rounded type="is-dark" size="is-medium">
                                                                <b-button class="is-edit" type="is-dark" size="is-small"
                                                                    @click.prevent="editItem('bereiche', option)">{{
                                                                        option.name }}</b-button></b-tag>
                                                            <b-tag rounded type="is-dark" size="is-medium">
                                                                <a
                                                                    @click.prevent="showToggleArchive('bereiche', option)"><b-button
                                                                        icon-left="angle-up" size="is-small"
                                                                        type="is-dark"></b-button></a></b-tag>
                                                        </b-taglist>
                                                    </div>
                                                </b-field>
                                            </b-message>
                                        </article>

                                        <b-field label="Add Job" v-if="kunde !== '' && kundeExists">
                                            <b-field>
                                                <b-input icon="file-alt" expanded v-model="newjob"
                                                    @keyup.enter="handleAddJob"></b-input>
                                                <p class="control">
                                                    <button type="button" class="button is-primary is-outlined"
                                                        @click="handleAddJob">Submit</button>
                                                </p>
                                            </b-field>
                                        </b-field>

                                        <b-message type="is-primary" v-if="kunde !== '' && kundeExists"
                                            class="has-text-left">
                                            <b-field grouped group-multiline>
                                                <div class="control" v-for="option in visibleJobsObject"
                                                    :key="option.name">
                                                    <b-taglist attached>
                                                        <b-tag rounded type="is-dark" size="is-medium">
                                                            <b-button class="is-edit" type="is-dark" size="is-small"
                                                                @click.prevent="editItem('jobs', option)">{{ option.name
                                                                }}</b-button></b-tag>
                                                        <b-tag rounded type="is-dark" size="is-medium">
                                                            <a @click.prevent="showToggleArchive('jobs', option)"><b-button
                                                                    icon-left="angle-down" size="is-small"
                                                                    type="is-dark"></b-button></a></b-tag>
                                                    </b-taglist>
                                                </div>
                                            </b-field>
                                        </b-message>

                                        <article class="message is-white">
                                            <b-button v-if="kunde !== '' && kundeExists && !isEmpty(archivedJobsObject)"
                                                type="is-warning is-outlined" @click="jobsArchActive = !jobsArchActive"
                                                expanded>Archived Jobs</b-button>
                                            <b-message
                                                v-if="kunde !== '' && kundeExists && !isEmpty(archivedJobsObject)"
                                                class="has-text-left" type="is-warning" :active.sync="jobsArchActive">
                                                <b-field grouped group-multiline>
                                                    <div class="control" v-for="option in archivedJobsObject"
                                                        :key="option.name">
                                                        <b-taglist attached>
                                                            <b-tag rounded type="is-dark" size="is-medium">
                                                                <b-button class="is-edit" type="is-dark" size="is-small"
                                                                    @click.prevent="editItem('jobs', option)">{{
                                                                        option.name }}</b-button></b-tag>
                                                            <b-tag rounded type="is-dark" size="is-medium">
                                                                <a @click.prevent="showToggleArchive('jobs', option)"><b-button
                                                                        icon-left="angle-up" size="is-small"
                                                                        type="is-dark"></b-button></a></b-tag>
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
    name: 'jobsEditor',
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
    created() {
        // Ensure customer data is loaded
        console.log('Jobs view created')
        this.$store.dispatch('loadCustomerEntries')
            .then(() => {
                console.log('Customer data loaded in Jobs view');
                if (this.$store.state.customerEntries) {
                    console.log('Customer entries found:', Object.keys(this.$store.state.customerEntries).length);
                } else {
                    console.log('No customer entries found in store');
                }
            })
            .catch(error => {
                console.error('Error loading customer data:', error);
            });
    },
    computed: {
        filteredKundenArray() {
            console.log('filteredKundenArray computed - kunden:', this.kunden);
            console.log('filteredKundenArray computed - kunden length:', this.kunden?.length);
            if (!this.kunden || this.kunden.length === 0) {
                console.log('filteredKundenArray returning empty array');
                return [];
            }
            const searchTerm = (this.kunde || '').toLowerCase();
            const filtered = this.kunden.filter((option) => {
                return option
                    .toString()
                    .toLowerCase()
                    .indexOf(searchTerm) >= 0
            });
            console.log('filteredKundenArray filtered result:', filtered);
            return filtered;
        },
        customerEntries() {
            return this.$store.state.customerEntries
        },
        kunden() {
            let myKundenReturn = []
            const customerEntries = this.customerEntries || {};
            console.log('kunden computed - customerEntries:', customerEntries);
            console.log('kunden computed - customerEntries keys:', Object.keys(customerEntries));
            // let idxs = Object.keys(customerEntries)
            // this.idxs = idxs
            for (let entry in customerEntries) {
                if (customerEntries[entry] && customerEntries[entry].name) {
                    myKundenReturn.push(customerEntries[entry].name)
                }
            }
            console.log('kunden computed - returning:', myKundenReturn);
            return myKundenReturn
        },
        idxs() {
            var keys = [], i = 0;
            const customerEntries = this.customerEntries || {};
            // eslint-disable-next-line no-empty
            for (keys[i++] in customerEntries) { }
            return keys
        },
        allBereicheObject() {
            let kunde = this.kunde
            let custObject = this.customerEntries || {}
            let returnBereiche = {}
            for (let entry in custObject) {
                if (custObject[entry] && custObject[entry].name === kunde) {
                    returnBereiche = custObject[entry].bereiche || {}
                }
            }
            return returnBereiche
        },
        visibleBereicheObject() {
            let allBereiche = this.allBereicheObject || {}
            let returnBereiche = {}
            for (let bereich in allBereiche) {
                if (allBereiche[bereich] && allBereiche[bereich].archived == false) {
                    returnBereiche[`${bereich}`] = allBereiche[bereich]
                }
            }
            return returnBereiche
        },
        archivedBereicheObject() {
            let allBereiche = this.allBereicheObject || {}
            let returnBereiche = {}
            for (let bereich in allBereiche) {
                if (allBereiche[bereich] && allBereiche[bereich].archived == true) {
                    returnBereiche[`${bereich}`] = allBereiche[bereich]
                }
            }
            return returnBereiche
        },
        allJobsObject() {
            let kunde = this.kunde
            let custObject = this.customerEntries || {}
            let allJobs = {}
            for (let entry in custObject) {
                if (custObject[entry] && custObject[entry].name === kunde) {
                    allJobs = custObject[entry].jobs || {}
                }
            }
            return allJobs
        },
        visibleJobsObject() {
            let allJobs = this.allJobsObject || {}
            let returnJobs = {}
            for (let job in allJobs) {
                if (allJobs[job] && allJobs[job].archived == false) {
                    returnJobs[`${job}`] = allJobs[job]
                }
            }
            return returnJobs
        },
        archivedJobsObject() {
            let allJobs = this.allJobsObject || {}
            let returnJobs = {}
            for (let job in allJobs) {
                if (allJobs[job] && allJobs[job].archived == true) {
                    returnJobs[`${job}`] = allJobs[job]
                }
            }
            return returnJobs
        },
        kundeExists() {
            if (!this.kunde || this.kunde === '') {
                return false;
            }
            // Check if the selected customer name exists in the kunden array
            const customerEntries = this.customerEntries || {};
            for (let key in customerEntries) {
                if (customerEntries[key] && customerEntries[key].name === this.kunde) {
                    return true;
                }
            }
            return false;
        },
        bereichExists() {
            let bereich = this.newbereich
            let bereicheObj = this.allBereicheObject
            let be = -1;
            // console.log(bereicheObj);
            if (bereicheObj !== null && bereicheObj !== undefined) {
                let bereicheArray = Object.values(bereicheObj)
                be = bereicheArray.findIndex(k => k.name.toLowerCase() == bereich.toLowerCase());
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
                je = jobsArray.findIndex(k => k.name.toLowerCase() == job.toLowerCase());
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
            console.log('showAddKunde called!');
            console.log('Current kunde value:', this.kunde);
            console.log('Buefy available:', !!this.$buefy);
            console.log('Dialog available:', !!this.$buefy?.dialog);

            try {
                this.$buefy.dialog.prompt({
                    message: `<p class="label">Kunde hinzufügen</p>`,
                    inputAttrs: {
                        placeholder: 'e.g. fuxpax',
                        maxlength: 20,
                        value: this.kunde
                    },
                    confirmText: 'Hinzufügen',
                    onConfirm: (value) => {
                        console.log('Dialog confirmed with value:', value);
                        // Sanitize customer name for display
                        const sanitizedValue = value.trim();
                        if (!sanitizedValue) {
                            console.log('Empty value provided');
                            this.$buefy.toast.open({
                                duration: 5000,
                                message: 'Please enter a customer name.',
                                position: 'is-bottom',
                                type: 'is-danger'
                            });
                            return;
                        }

                        console.log('Dispatching addCustomer with:', sanitizedValue);
                        this.$store.dispatch('addCustomer', {
                            name: sanitizedValue
                        }).then(() => {
                            console.log('Customer added successfully');
                            // Wait for the store to reload, then set the selected value
                            this.$nextTick(() => {
                                this.kunde = sanitizedValue;
                                if (this.$refs.kunde && this.$refs.kunde.setSelected) {
                                    this.$refs.kunde.setSelected(sanitizedValue);
                                }
                            });

                            this.$buefy.toast.open({
                                duration: 5000,
                                message: '"' + sanitizedValue + '" als Kunde hinzugefügt!',
                                position: 'is-bottom',
                                type: 'is-success'
                            });
                        }).catch(error => {
                            console.error('Error adding customer:', error);
                            this.$buefy.toast.open({
                                duration: 5000,
                                message: 'Error adding customer: ' + (error.message || error),
                                position: 'is-bottom',
                                type: 'is-danger'
                            });
                        });
                    },
                    onCancel: () => {
                        console.log('Dialog cancelled');
                    }
                });
            } catch (error) {
                console.error('Error opening dialog:', error);
                this.$buefy.toast.open({
                    duration: 5000,
                    message: 'Error opening dialog: ' + (error.message || error),
                    position: 'is-bottom',
                    type: 'is-danger'
                });
            }
        },
        getIDXfromCustomer(customer) {
            // Directly find the Firebase key by searching through customerEntries
            const customerEntries = this.customerEntries || {};
            for (let key in customerEntries) {
                if (customerEntries[key] && customerEntries[key].name === customer) {
                    console.log('Found customer key:', key, 'for customer:', customer);
                    return key;
                }
            }
            console.warn('Could not find customer key for:', customer);
            console.log('Available customers:', Object.keys(customerEntries).map(k => ({ key: k, name: customerEntries[k]?.name })));
            return null;
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
            let myFeedback = myValue ? 'ctivate' : 'rchive'
            // console.log(myFeedback)
            let message1 = 'Are you sure you want to <b> a' + myFeedback + '</b> customer ' + this.kunde + '\'s "' + thingToToggle.name + '"? You have the ability to unarchive at a later date.'
            let title = 'A' + myFeedback + '?'
            let confirmText = myValue ? 'Really reactivate' : 'Really archive'
            let message2 = '"' + thingToToggle.name + '" ' + (myValue ? 'activated!' : 'archived!')
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
        handleAddBereich(event) {
            console.log('handleAddBereich called!', event);
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            this.addBereich();
        },
        addBereich() {
            // first make sure we don't already have this bereich
            if (!this.kunde || !this.kundeExists) {
                this.$buefy.toast.open({
                    duration: 5000,
                    message: 'Please select a customer first.',
                    position: 'is-bottom',
                    type: 'is-danger'
                });
                return;
            }

            if (!this.bereichExists && this.newbereich !== "") {
                const bereichName = this.newbereich.trim();
                const idx = this.getIDXfromCustomer(this.kunde);

                if (!idx) {
                    this.$buefy.toast.open({
                        duration: 5000,
                        message: 'Could not find customer index. Please try again.',
                        position: 'is-bottom',
                        type: 'is-danger'
                    });
                    return;
                }

                // dispatch new bereich to store
                this.$store.dispatch('addBereich', {
                    idx: idx,
                    bereich: bereichName
                })
                    // then show success toast
                    .then(() => {
                        this.$buefy.toast.open({
                            duration: 5000,
                            message: `"${bereichName}" added!`,
                            position: 'is-bottom',
                            type: 'is-success'
                        });
                        this.newbereich = "";
                    })
                    .catch(error => {
                        this.$buefy.toast.open({
                            duration: 5000,
                            message: 'Error adding area: ' + (error.message || error),
                            position: 'is-bottom',
                            type: 'is-danger'
                        });
                    });
            } else if (this.newbereich !== "") {
                this.$buefy.toast.open({
                    duration: 5000,
                    message: `Area "${this.newbereich}" already exists.`,
                    position: 'is-bottom',
                    type: 'is-danger'
                });
            } else {
                this.$buefy.toast.open({
                    duration: 5000,
                    message: 'Please enter a new Area name.',
                    position: 'is-bottom',
                    type: 'is-danger'
                });
            }
        },
        handleAddJob(event) {
            console.log('handleAddJob called!', event);
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            this.addJob();
        },
        addJob() {
            console.log('addJob called');
            console.log('kunde:', this.kunde);
            console.log('kundeExists:', this.kundeExists);
            console.log('newjob:', this.newjob);
            console.log('jobExists:', this.jobExists);

            // first make sure we don't already have this job
            if (!this.kunde || !this.kundeExists) {
                console.log('No customer selected or customer does not exist');
                this.$buefy.toast.open({
                    duration: 5000,
                    message: 'Please select a customer first.',
                    position: 'is-bottom',
                    type: 'is-danger'
                });
                return;
            }

            if (!this.jobExists && this.newjob !== "") {
                const jobName = this.newjob.trim();
                console.log('Job name to add:', jobName);

                const idx = this.getIDXfromCustomer(this.kunde);
                console.log('Customer idx:', idx);
                console.log('Customer entries:', this.customerEntries);
                console.log('idxs array:', this.idxs);
                console.log('kunden array:', this.kunden);

                if (!idx) {
                    console.error('Could not find customer index');
                    this.$buefy.toast.open({
                        duration: 5000,
                        message: 'Could not find customer index. Please try again.',
                        position: 'is-bottom',
                        type: 'is-danger'
                    });
                    return;
                }

                console.log('Dispatching addJob action with payload:', { idx: idx, job: jobName });

                // dispatch new job to store
                this.$store.dispatch('addJob', {
                    idx: idx,
                    job: jobName
                })
                    // then show success toast
                    .then(() => {
                        console.log('Job added successfully');
                        this.$buefy.toast.open({
                            duration: 5000,
                            message: `"${jobName}" added!`,
                            position: 'is-bottom',
                            type: 'is-success'
                        });
                        this.newjob = "";
                    })
                    .catch(error => {
                        console.error('Error adding job:', error);
                        this.$buefy.toast.open({
                            duration: 5000,
                            message: 'Error adding job: ' + (error.message || error),
                            position: 'is-bottom',
                            type: 'is-danger'
                        });
                    });
            } else if (this.newjob !== "") {
                console.log('Job already exists');
                this.$buefy.toast.open({
                    duration: 5000,
                    message: `Job "${this.newjob}" already exists.`,
                    position: 'is-bottom',
                    type: 'is-danger'
                });
            } else {
                console.log('No job name entered');
                this.$buefy.toast.open({
                    duration: 5000,
                    message: 'Please enter a new Job name.',
                    position: 'is-bottom',
                    type: 'is-danger'
                });
            }
        },
        editItem(type, item) {
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
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key))
                    return false;
            }
            return true;
        },
    },
    mounted() {
        console.log('Jobs component mounted');
        console.log('addJob method available:', typeof this.addJob === 'function');
        console.log('addBereich method available:', typeof this.addBereich === 'function');
        this.loadCustomerData()
    }
}
</script>
<style scoped>
.field.has-addons,
.field-body>.field:not(.is-narrow) {
    align-items: center;
    justify-content: space-between;
}
</style>