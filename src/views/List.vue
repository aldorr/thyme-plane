<template>
    <!-- START CALENDAR VIEW -->
    <div id="is-time-calendar" class="section is-view">
        <div class="container">
            <div class="hero is-small is-light">
                <div class="hero-body">

                    <div class="columns is-vcentered">
                        <div class="column is-2">
                            <h1 class="title has-text-left">Filter:</h1>
                        </div>
                        <div class="column">
                            <b-field label="Nutzer:">
                                <b-select expanded placeholder="Name auswählen" name="userName" v-model="userName">
                                    <option v-for="option in userList" :value="option" :key="option">
                                        {{ option }}
                                    </option>
                                    <template slot="empty">Leider keine Benutzer namens {{userName}}</template>
                                </b-select>
                            </b-field>
                        </div>
                        <div class="column">
                            <b-field label="Kunde:">
                                <b-autocomplete expanded name="kunde" v-model="kunde" ref="autocomplete" open-on-focus
                                    :data="filteredKundenArray" placeholder="e.g. Metropolis" icon="building"
                                    @select="option => selected = option" @input="clearJobs" key="customer-input">
                                    <template slot="empty">Leider keine Kunden namens {{kunde}}</template>
                                </b-autocomplete>
                            </b-field>
                        </div>
                        <div class="column">
                            <b-field label="Bereich:" v-if="kunde !== ''">
                                <b-autocomplete expanded name="area" v-model="area" ref="autocomplete" open-on-focus
                                    :data="filteredBereicheArray" placeholder="Bereich Wählen" icon="folder-open"
                                    @select="option => selected = option" key="area-input">
                                    <template slot="empty">Leider keinen Bereich namens "{{area}}"</template>
                                </b-autocomplete>
                            </b-field>
                        </div>
                        <div class="column">
                            <b-field label="Job:" v-if="kunde !== ''">
                                <b-autocomplete expanded name="job" v-model="job" ref="autocomplete" open-on-focus
                                    :data="filteredJobsArray" placeholder="Job Wählen" icon="file-alt"
                                    @select="option => selected = option" key="job-input">
                                    <template slot="empty">Leider keinen Job namens "{{job}}"</template>
                                </b-autocomplete>
                            </b-field>
                        </div>
                    </div>
                    <div class="section" v-if="kunde != ''">
                        <nav class="level">
                            <div class="level-item has-text-centered">
                                <div>
                                    <!-- <p class="heading"><b-button icon-left="clipboard" class="button is-link" @click.prevent="addHours">Berechne Stunden</b-button></p> -->
                                    <p class="title">Zeit Gesamt: {{hoursAll | secondsToHrsMins}}</p>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
                <div class="hero-foot has-padding-15em">
                    <nav class="level" v-if="kunde != ''">
                        <div class="level-item has-text-centered">
                            <b-field label="Datum auswählen">
                                <b-datepicker placeholder="Klicken..." v-model="dates" range>
                                    <div class="buttons is-right">
                                        <!-- <button class="button is-primary is-fullwidth"
                                                            @click.prevent="date = new Date()">
                                                            <b-icon icon="calendar-alt"></b-icon>
                                                            <span>Heute</span>
                                                        </button> -->
                                        <button class="button is-danger is-fullwidth" @click.prevent="dates = []">
                                            <b-icon icon="times-circle"></b-icon>
                                            <span>Zurücksetzen</span>
                                        </button>
                                    </div>
                                </b-datepicker>
                            </b-field>
                        </div>
                        <div class="level-item has-text-centered">
                            <div class="buttons">
                                <b-button expanded icon-left="file-alt" class="button is-info"
                                    @click.prevent="exportTableToCSV">Exportieren</b-button>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
        <div class="container" v-if="kunde != ''">
            <!-- <b-table :data="currentTimeEntries" :columns="columns" striped default-sort-direction="asc" default-sort="date">
            </b-table> -->
            <b-table :data="currentTimeEntries" striped default-sort-direction="asc" default-sort="date"
                :selected.sync="myselected">
                <template slot-scope="props">
                    <b-table-column field="customer" label="Kunde" sortable>{{ props.row.customer }}</b-table-column>
                    <b-table-column field="area" label="Bereich" sortable>{{ props.row.area }}</b-table-column>
                    <b-table-column field="job" label="Job" sortable>{{ props.row.job }}</b-table-column>
                    <b-table-column field="date" label="Datum" sortable>{{ props.row.date | dateToHuman }}
                    </b-table-column>
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
            userTimeEntries: [],
            myselected: null,
            dates: [],
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
            // get () {
                return this.$store.state.userTimeEntries
            // },
            // set(value) {
            //     this.$tore.state.commit('setTimeEntries', value)
            // }
        },
        customerEntries() {
            return this.$store.state.customerEntries
        },
        // chain for each, based on all time entries,
        // byKundeTimeEntries -- if kunde !== '' return filtered list, otherwise return value,
        byKundeTimeEntries() {
            let allTimeEntries = this.getAllTimeEntries()
            if (this.kunde != '') {
                // return list only from customer chosen
                let returnArray = []
                for (let key in allTimeEntries) {
                    if (allTimeEntries[key].customer == this.kunde) {
                        returnArray.push(allTimeEntries[key])
                    }
                }
                return returnArray
            } else {
                return allTimeEntries
            }
        },
        // byJobTimeEntries -- if job !== '' return filtered list, otherwise return value,
        byJobTimeEntries() {
            let kundeTimeEntries = this.byKundeTimeEntries
            if (this.job != '') {
                let returnArray = []
                for (let key in kundeTimeEntries) {
                    if (kundeTimeEntries[key].job == this.job) {
                        returnArray.push(kundeTimeEntries[key])
                    }
                }
                return returnArray
            } else {
                return kundeTimeEntries
            }
        },
        // byAreaTimeEntries -- if area !== '' return filtered list, otherwise return value,
        byAreaTimeEntries() {
            let jobTimeEntries = this.byJobTimeEntries
            if (this.area != '') {
                // return special List
                let returnArray = []
                for (let key in jobTimeEntries) {
                    if (jobTimeEntries[key].area == this.area) {
                        returnArray.push(jobTimeEntries[key])
                    }
                }
                // console.log("Returning just for area: " + this.area)
                return returnArray
            } else {
                return jobTimeEntries
            }
        },
        // byUserNameTimeEntries -- if userName !== '' return filtered list, otherwise return value
        byUserNameTimeEntries() {
            let areaTimeEntries = this.byAreaTimeEntries
            if (this.userName !== 'Alle Nutzer') {
                // return special List
                let returnArray = []
                for (let key in areaTimeEntries) {
                    if (areaTimeEntries[key].user == this.userName) {
                        returnArray.push(areaTimeEntries[key])
                    }
                }
                return returnArray
            } else {
                return areaTimeEntries
            }
        },
        byDateTimeEntries() {
            let userNameTimeEntries = this.byUserNameTimeEntries
            // console.log(this.dates)
            if (0 !== this.dates.length) {
                // console.log(this.dates)
                // console.log(this.dates[0])
                // console.log(this.dates[1])
                // return special List
                let returnArray = []
                for (let key in userNameTimeEntries) {
                    // console.log(userNameTimeEntries[key].date)
                    let itemDate = new Date(userNameTimeEntries[key].date)
                    let selStart = new Date(this.dates[0])
                    let selEnd = new Date(this.dates[1])
                    if ( itemDate > selStart && itemDate < selEnd) {
                        returnArray.push(userNameTimeEntries[key])
                    }
                }
                return returnArray
            } else {
                return userNameTimeEntries
            }
        },
        // displayTimeEntries -- if 
        currentTimeEntries() {
            let allTimeEntriesArray = this.byDateTimeEntries
            return allTimeEntriesArray
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
                    this.userTimeEntries = this.$store.state.userTimeEntries
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
                let user
                if (userObject.fullname != user) {
                    user = userObject.fullname
                }
                if (Object.prototype.hasOwnProperty.call(userObject, 'timeentries')) {
                    // if (userObject.hasOwnProperty('timeentries')) {
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
                        // console.log("Current Time Entries for user " + user)
                        // console.log(currentTimeEntriesArray)
                        allTimeEntriesArray = allTimeEntriesArray.concat(currentTimeEntriesArray)
                    }
                }
            }

            return allTimeEntriesArray
        },
        setSelected(entry) {
            this.myselected = this.currentTimeEntries[entry]
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
        },
        downloadCSV(csv, filename) {
            let csvFile;
            let downloadLink;

            // CSV file
            csvFile = new Blob([csv], {
                type: "text/csv"
            });

            // Download link
            downloadLink = document.createElement("a");

            // File name
            downloadLink.download = filename;

            // Create a link to the file
            downloadLink.href = window.URL.createObjectURL(csvFile);

            // Hide download link
            downloadLink.style.display = "none";

            // Add the link to DOM
            document.body.appendChild(downloadLink);

            // Click download link
            downloadLink.click();
        },
        exportTableToCSV() {
            let csv = [];
            let rows = document.querySelectorAll("table tr");
            let filename = this.userName
            if (this.kunde) {
                filename += "-" + this.kunde
            }
            if (this.area) {
                filename += "-" + this.area
            }
            if (this.job) {
                filename += "-" + this.job
            }
            if (0 !== this.dates.length) {
                let dateStart = this.dateToHuman(this.dates[0])
                let dateEnd = this.dateToHuman(this.dates[1])
                filename += "-" + dateStart + "-" + dateEnd
            }
            filename += ".csv"

            for (let i = 0; i < rows.length; i++) {
                let row = [],
                    cols = rows[i].querySelectorAll("td, th");

                for (let j = 0; j < cols.length; j++)
                    row.push(cols[j].innerText);

                csv.push(row.join(","));
            }

            // Download CSV file
            this.downloadCSV(csv.join("\n"), filename);
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
<style>
.has-padding-15em {
    padding: 1.5em !important;
}
</style>