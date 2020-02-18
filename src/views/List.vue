<template>
    <!-- START CALENDAR VIEW -->
    <div id="is-time-calendar" class="section is-view">
        <div class="container">
            <div class="hero is-small is-warning">
                <div class="hero-body">
                    <h2 class="title">Filter:</h2>
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
                    <b-field label="Job auswählen:" >
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
                    <button class="button is-link" @click.prevent="addHours">Berechne Stunden</button>
                    <p> Zeit Gesamt: {{hoursAll}}</p>
                </div>
            </div>
        </div>
        <div class="container">
            <b-table
                :data="currentTimeEntries"
                :columns="columns"
                default-sort-direction="asc"
                default-sort="date"></b-table>
        </div>
    </div>
    <!-- END CALENDAR VIEW -->
</template>

<script>
/** This has the most work to do.
 * Figuring out/making all these filter possibilities.
 * First we should sketch it out.
 * TODO: Filterable List
 * 
 */
    export default {
        data() {
            return {
                kunde: '',
                defaultFilter: 0,
                job: '',
                columns: [
                    {
                        field: 'customer',
                        label: 'Kunde',
                        sortable: true,
                    },
                    {
                        field: 'area',
                        label: 'Bereich',
                        sortable: true
                    },
                    {
                        field: 'job',
                        label: 'Job',
                        sortable: true
                    },
                    {
                        field: 'date',
                        label: 'Datum',
                        sortable: true
                    },
                    {
                        field: 'time',
                        label: 'Zeit',
                    },
                    {
                        field: 'note',
                        label: 'Notiz'
                    },
                    {
                        field: 'user',
                        label: 'Nutzer'
                    }
                ],
            }
        },
        computed: {
            /*
            hoursPerUser() {
                for(let k in currentTimeEntries){

                }
                return 0
            },*/
            hoursAll(){
                // doesn't work yet
                let sum = 0
                for(let k in this.currentTimeEntries){
                    sum+=this.currentTimeEntries[k].time
                }
                return sum
            },
            filteredKundenArray() {
                return this.kunden.filter((option) => {
                    return option
                        .toString()
                        .toLowerCase()
                })
            },
            kunden() {
                let myKundenReturn = []
                for (let entry in this.customerEntries) {
                    myKundenReturn.push(this.customerEntries[entry].name)
                }
                return myKundenReturn
            },
            filteredJobsArray() {
                return this.jobs.filter((option) => {
                    return option
                        .toString()
                        .toLowerCase()
                })
            },
            userID() {
                return this.$store.getters.user
            },
            timeEntries() {
                return this.$store.getters.usertimes
            },
            customerEntries() {
                return this.$store.state.customerEntries
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
            currentUserName() {
                // get user's name with the id this.$store.getters.user
                let userID = this.userID
                // let timeEntries = this.timeEntries
                let currentUserName = this.timeEntries[userID].fullname
                // console.log(userID)
                // console.log(currentUserName)
                return currentUserName
            },
            currentTimeEntries() { 
                let allTimeEntriesArray = this.getAllTimeEntries()
                
                if(this.job!='') {
                    // return special List
                   
                    let returnArray = [];
                    for (let key in allTimeEntriesArray) {
                        if(allTimeEntriesArray[key].job == this.job && allTimeEntriesArray[key].customer== this.kunde){
                             returnArray.push(allTimeEntriesArray[key])
                        }
                    }
                    return returnArray
                }

                // return All Time Entries 
                /*
                allTimeEntriesArray.forEach((v, i) =>
                    allTimeEntriesArray[i].date = this.dateToHuman(allTimeEntriesArray[i].date)
                );

                allTimeEntriesArray.forEach((v, i) =>
                    allTimeEntriesArray[i].time = this.secondsToHrsMins(allTimeEntriesArray[i].time)
                ); 
                */                
                return allTimeEntriesArray
            }
        },
        methods: {
            clearJobs() {
                this.bereich = ''
                this.job = ''
            },
            resetData(){
                this.kunde = '',
                this.job = ''
            },
            loadAllData() {
                this.$store.dispatch('loadCustomerEntries')
                this.$store.dispatch('loadTimeEntries')
                .then(() => {
                    this.timeEntries = this.$store.state.userTimeEntries
                    this.userName = this.currentUserName
                })
            },
            getAllTimeEntries(){
                let timeEntries = this.timeEntries
                let userObject = 0
                let currentTimeEntriesObject = 0
                let currentTimeEntriesArray = [];
                let allTimeEntriesArray = [];
                
                for (let key in timeEntries) {
                    userObject = timeEntries[key]
                    let user = userObject.fullname
                    
                    if(userObject.hasOwnProperty('timeentries') ) {
                        currentTimeEntriesObject = userObject.timeentries
                        if(Object.keys(currentTimeEntriesObject).length > 0) {
                            currentTimeEntriesArray = this.json2array(currentTimeEntriesObject)
                            currentTimeEntriesArray.forEach((v, i) =>
                                currentTimeEntriesArray[i].date = this.dateToHuman(currentTimeEntriesArray[i].date)
                            );

                            currentTimeEntriesArray.forEach((v, i) =>
                                currentTimeEntriesArray[i].time = this.secondsToHrsMins(currentTimeEntriesArray[i].time)
                            );
                            for (let j in currentTimeEntriesArray){
                                currentTimeEntriesArray[j]["user"] = user
                            }

                            console.log(currentTimeEntriesArray)
                            allTimeEntriesArray = allTimeEntriesArray.concat(currentTimeEntriesArray)
                        }
                    }
                }

                return allTimeEntriesArray
            },
            json2array(json){
                var result = [];
                var keys = Object.keys(json);
                keys.forEach(function(key){
                    result.push(json[key]);
                });
                return result;
            },
            dateToHuman(dateString) {
                let date = new Date(dateString)
                let dateHuman
                let year    = date.getFullYear();
                let month   = date.getMonth() + 1;
                let day     = date.getDate();
                dateHuman = day + '.' + month + '.' + year
                return dateHuman
            },
            secondsToHrsMins(seconds) {
                let mins = seconds / 60
                let hrs = Math.floor(mins / 60)
                mins = mins % 60
                return hrs + 'hrs ' + mins + 'mins'
            }
        },
        mounted() {
            this.loadAllData()
            
        }
    }
</script>
