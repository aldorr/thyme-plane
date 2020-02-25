<template>
    <!-- START CALENDAR VIEW -->
    <div id="is-time-calendar" class="section is-view">
        <div class="container">
            <div class="hero is-small is-light">
                <div class="hero-body">

                    <div class="columns">
                        <h2 class="title column is-2 has-text-left">Filter:</h2>
                        <div class="column">
                            <b-field label="Nutzer:" :type="{'is-danger': errors.has('userName')}" :message="errors.first('userName')">
                                        <b-select expanded
                                                placeholder="Name auswählen"
                                                name="userName"
                                                v-model="userName"
                                                v-validate="'required'" mode="eager" icon="user">
                                            <option
                                                v-for="option in userList"
                                                :value="option"
                                                :key="option">
                                                {{ option }}
                                            </option>
                                        <template slot="empty">Leider keine Benutzer namens {{userName}}</template>
                                        </b-select>
                                    </b-field>
                        </div>
                        <div class="column">
                            <b-field label="Kunde:" :type="{'is-danger': errors.has('kunde')}"
                                :message="errors.first('kunde')">
                                <b-autocomplete expanded name="kunde" v-model="kunde" ref="autocomplete" open-on-focus
                                    :data="filteredKundenArray" placeholder="e.g. Metropolis" icon="building"
                                    @select="option => selected = option" @input="clearJobs" v-validate="'required'"
                                    key="customer-input">
                                    <template slot="empty">Leider keine Kunden namens {{kunde}}</template>
                                </b-autocomplete>
                            </b-field>
                        </div>
                        <div class="column">
                            <b-field label="Bereich:" v-if="kunde !== ''" :type="{'is-danger': errors.has('area')}"
                                :message="errors.first('area')">
                                <b-autocomplete expanded name="area" v-model="area" ref="autocomplete" open-on-focus
                                    :data="filteredBereicheArray" placeholder="Bereich Wählen" icon="folder-open"
                                    @select="option => selected = option" key="area-input">
                                    <template slot="empty">Leider keinen Bereich namens "{{area}}"</template>
                                </b-autocomplete>
                            </b-field>
                        </div>
                        <div class="column">
                            <b-field label="Job:" v-if="kunde !== ''" :type="{'is-danger': errors.has('job')}"
                                :message="errors.first('job')">
                                <b-autocomplete expanded name="job" v-model="job" ref="autocomplete" open-on-focus
                                    :data="filteredJobsArray" placeholder="Job Wählen" icon="file-alt"
                                    @select="option => selected = option" key="job-input">
                                    <template slot="empty">Leider keinen Job namens "{{job}}"</template>
                                </b-autocomplete>
                            </b-field>
                        </div>
                    </div>
                    <button class="button is-link" @click.prevent="addHours">Berechne Stunden</button>
                    <p> Zeit Gesamt: {{hoursAll | secondsToHrsMins}}</p>
                </div>
            </div>
        </div>
        <div class="container" v-if="kunde != ''">
            <!-- <b-table :data="currentTimeEntries" :columns="columns" striped default-sort-direction="asc" default-sort="date">
            </b-table> -->
            <b-table :data="currentTimeEntries" striped default-sort-direction="asc" default-sort="date">
                <template slot-scope="props">
                    <b-table-column field="customer" label="Kunde" sortable>{{ props.row.customer }}</b-table-column>
                    <b-table-column field="area" label="Bereich" sortable>{{ props.row.area }}</b-table-column>
                    <b-table-column field="job" label="Job" sortable>{{ props.row.job }}</b-table-column>
                    <b-table-column field="date" label="Datum" sortable>{{ props.row.date | dateToHuman }}</b-table-column>
                    <b-table-column field="time" label="Zeit">{{ props.row.time | secondsToHrsMins }}</b-table-column>
                    <b-table-column field="note" label="Notiz">{{ props.row.note }} </b-table-column>
                    <b-table-column field="user" label="Nutzer" sortable>{{ props.row.user }} </b-table-column>
                </template>
            </b-table>
                   
        </div>
        <div class="container">
            <section class="hero is-info" v-if="kunde == ''">
                <div class="hero-body">
                    <div class="container">
                    <h1 class="title">
                        Zeitberechnung…
                    </h1>
                    <h2 class="subtitle">
                        Zum loslegen, oben bitte einen Benutzer und einen Kunden auswählen.
                    </h2>
                    </div>
                </div>
            </section>
        </div>
    </div>
    <!-- END CALENDAR VIEW -->
</template>

<script>
    export default {
        data() {
            return {
                kunde: '',
                defaultFilter: 0,
                job: '',
                area: '',
                userName: '',
                columns: [{
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
            hoursAll() {
                // doesn't work yet
                let sum = 0
                for (let k in this.currentTimeEntries) {
                    sum += this.currentTimeEntries[k].time
                }
                return sum
            },
            currentUserName() {
                // get user's name with the id this.$store.getters.user
                let userID = this.userID
                let currentUserName = this.timeEntries[userID].fullname
                return currentUserName
            },
            userList() {
                // get all users' names and ids
                let userList = ["Alle Nutzer"]
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
            filteredBereicheArray() {
                return this.bereiche.filter((option) => {
                    return option
                        .toString()
                        .toLowerCase()
                        .indexOf(this.area.toLowerCase()) >= 0
                })
            },
            bereiche() {
                let myBereicheReturn = []
                // check in each array if it has that one
                for (let entry in this.customerEntries) {
                    if (this.customerEntries[entry].name === this.kunde) {
                        for (let area in this.customerEntries[entry].bereiche) {
                            myBereicheReturn.push(this.customerEntries[entry].bereiche[area])
                        }
                    }
                }
                return myBereicheReturn
            },
            userID() {
                return this.$store.getters.user
            },
            timeEntries() {
                return this.$store.getters.getUserTimeEntries
            },
            customerEntries() {
                return this.$store.state.customerEntries
            },
            currentTimeEntries() {
                let allTimeEntriesArray = this.getAllTimeEntries()
                console.log("All time entries for use by: ")
                console.log(allTimeEntriesArray)

                /*  here we need to filter in this order:
                    by User (with ability to select all users)
                    ---- by Customer (only one at a time - no need to show all customer's listings together?)
                    -------- by Job (unselected, it shows time entries from all jobs from customer)
                    -------- by Area (unselected, it shows time entries from all areas from customer)
                    there's gotta be a smarter way to do this!
                 */
                if (this.job != '' && this.area != '') {
                    // return special List
                    let returnArray = []
                    for (let key in allTimeEntriesArray) {
                        if (allTimeEntriesArray[key].job == this.job && allTimeEntriesArray[key].customer == this.kunde && allTimeEntriesArray[key].area == this.area && allTimeEntriesArray[key].user == this.userName) {
                            returnArray.push(allTimeEntriesArray[key])
                        }
                    }
                    return returnArray
                } else if (this.job != '') {

                    let returnArray = []
                    // return special List
                    for (let key in allTimeEntriesArray) {
                        if (allTimeEntriesArray[key].job == this.job && allTimeEntriesArray[key].customer == this.kunde && allTimeEntriesArray[key].user == this.userName) {
                            returnArray.push(allTimeEntriesArray[key])
                        }
                    }
                    return returnArray

                } else if (this.area != '') {

                    // return special List
                    let returnArray = []
                    for (let key in allTimeEntriesArray) {
                        if (allTimeEntriesArray[key].area == this.area && allTimeEntriesArray[key].customer == this.kunde && allTimeEntriesArray[key].user == this.userName) {
                            returnArray.push(allTimeEntriesArray[key])
                        }
                    }
                    return returnArray

                } else if (this.customer != '') {
                    // return list only from customer chosen
                    let returnArray = []
                    for (let key in allTimeEntriesArray) {
                        if (allTimeEntriesArray[key].customer == this.kunde && allTimeEntriesArray[key].user == this.userName) {
                            returnArray.push(allTimeEntriesArray[key])
                        }
                    }
                    return returnArray
                } else if (this.userName != "Alle Nutzer") {
                    let returnArray = []
                    for (let key in allTimeEntriesArray) {
                        if (allTimeEntriesArray[key].user == this.userName) {
                            returnArray.push(allTimeEntriesArray[key])
                        }
                    }
                    return returnArray
                } else if (this.userName == "Alle Nutzer"){
                    return allTimeEntriesArray
                } else {
                    return allTimeEntriesArray
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
                // return allTimeEntriesArray
            }
        },
        methods: {
            clearJobs() {
                this.area = ''
                this.job = ''
            },
            resetData() {
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
            getAllTimeEntries() {
                let timeEntries = this.timeEntries
                let userObject = 0
                let currentTimeEntriesObject = 0
                let currentTimeEntriesArray = [];
                let allTimeEntriesArray = [];

                for (let key in timeEntries) {
                    userObject = timeEntries[key]
                    let user = "Alle Nutzer"
                    if (userObject.fullname != user) {
                        user = userObject.fullname
                    }

                    if (userObject.hasOwnProperty('timeentries')) {
                        currentTimeEntriesObject = userObject.timeentries
                        if (Object.keys(currentTimeEntriesObject).length > 0) {
                            currentTimeEntriesArray = this.json2array(currentTimeEntriesObject)
                            // currentTimeEntriesArray.forEach((v, i) =>
                            //     currentTimeEntriesArray[i].date = this.dateToHuman(currentTimeEntriesArray[i].date)

                            // );

                            // currentTimeEntriesArray.forEach((v, i) =>
                            //     currentTimeEntriesArray[i].time = this.secondsToHrsMins(currentTimeEntriesArray[i].time)
                            // );
                                for (let j in currentTimeEntriesArray) {
                                    currentTimeEntriesArray[j]["user"] = user
                                }
                            console.log("Current Time Entries for user " + user)
                            console.log(currentTimeEntriesArray)
                            allTimeEntriesArray = allTimeEntriesArray.concat(currentTimeEntriesArray)
                        }
                    }
                }

                return allTimeEntriesArray
            },
            json2array(json) {
                var result = [];
                var keys = Object.keys(json);
                keys.forEach(function (key) {
                    result.push(json[key]);
                });
                return result;
            },
            dateToHuman(dateString) {
                let date = new Date(dateString)
                let dateHuman
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
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
        filters: {
            secondsToHrsMins(seconds) {
                if (!seconds) return ''
                let mins = seconds / 60
                let hrs = Math.floor(mins / 60)
                mins = mins % 60
                return hrs + 'hrs ' + mins + 'mins'
            },
            dateToHuman(dateString) {
                let date = new Date(dateString)
                let dateHuman
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                dateHuman = day + '.' + month + '.' + year
                return dateHuman
            },
        },
        mounted() {
            this.loadAllData()

        }
    }
</script>
