<template>
    <!-- START CALENDAR VIEW -->
    <div id="is-time-calendar" class="section is-view">
        <div class="container">
            <div class="hero is-small is-light">
                <div class="hero-body">

                    <div class="columns is-vcentered is-multiline">
                        <div class="column is-one-fifth-desktop is-full-touch">
                            <h1 class="title has-text-left">Filter:</h1>
                        </div>
                        <div class="column is-one-fifth-desktop is-full-mobile is-half-tablet">
                            <b-field label="Nutzer:">
                                <b-select expanded placeholder="Name auswählen" name="userName" v-model="userName">
                                    <option v-for="option in userList" :value="option" :key="option">
                                        {{ option }}
                                    </option>
                                </b-select>
                            </b-field>
                        </div>
                        <div class="column is-one-fifth-desktop is-full-mobile is-half-tablet">
                            <b-field label="Kunde:">
                                <b-autocomplete expanded name="kunde" v-model="kunde" ref="kunde" open-on-focus
                                    :data="filteredKundenArray" placeholder="e.g. Metropolis" icon="building"
                                    @select="option => selected = option" @input="clearJobs" key="kunde">
                                    <template slot="empty">Keine Kunden namens {{kunde}}</template>
                                </b-autocomplete>
                            </b-field>
                        </div>
                        <div class="column is-one-fifth-desktop is-full-mobile is-half-tablet">
                            <b-field label="Bereich:">
                                <b-autocomplete expanded name="area" v-model="area" open-on-focus
                                    :data="filteredBereicheArray" placeholder="Bereich Wählen" icon="folder-open"
                                    @select="option => selected = option" key="bereich" :disabled="!kunde||kunde=='Alle Kunden'">
                                    <template slot="empty">Keine Bereiche namens "{{area}}"</template>
                                </b-autocomplete>
                            </b-field>
                        </div>
                        <div class="column is-one-fifth-desktop is-full-mobile is-half-tablet">
                            <b-field label="Job:">
                                <b-autocomplete expanded name="job" v-model="job" open-on-focus
                                    :data="filteredJobsArray" placeholder="Job Wählen" icon="file-alt"
                                    @select="option => selected = option" key="job" :disabled="!kunde||kunde=='Alle Kunden'">
                                    <template slot="empty">Keine Jobs namens "{{job}}"</template>
                                </b-autocomplete>
                            </b-field>
                        </div>
                    </div>
                    <transition  name="fade" mode="out-in" appear>
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
                    </transition>
                </div>
                <div class="hero-foot has-padding-15em">
                    <nav class="level" v-if="kunde != ''">
                        <div class="level-item has-text-centered">
                            <b-field label="Datum auswählen" :custom-class="anyTimeEntries||datesSelected?'has-text-dark':'has-text-grey-light'" label-position="on-border">
                                <b-datepicker placeholder="Klicken..." v-model="dates" range :max-date="now" :mobile-native="false" :disabled="!anyTimeEntries && !datesSelected">
                                    <div class="buttons is-right">
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
                                    @click.prevent="exportTableToCSV" :disabled="!anyTimeEntries">Exportieren</b-button>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
        <div class="container" v-if="kunde != ''">
            <b-table ref="table" :data="currentTimeEntries" striped default-sort-direction="asc" default-sort="date"
                detailed detail-key="ID" :show-detail-icon=false :opened-detailed="isToggled?detailed:[]"
                    :selected.sync="selected">
                <template slot-scope="props">
                    <b-table-column field="customer" label="Kunde" sortable>{{ props.row.customer }}</b-table-column>
                    <b-table-column field="area" label="Bereich" sortable>{{ props.row.area }}</b-table-column>
                    <b-table-column field="job" label="Job" sortable>{{ props.row.job }}</b-table-column>
                    <b-table-column field="user" label="Nutzer" sortable>{{ props.row.user }} </b-table-column>
                    <b-table-column field="date" label="Datum" sortable>{{ props.row.date | dateToHuman }}
                    </b-table-column>
                    <b-table-column field="time" label="Zeit">{{ props.row.time | secondsToHrsMins }}</b-table-column>
                    <b-table-column field="ID" label="Notiz">
                        <template slot="header" slot-scope="{ column }">
                            <b-tooltip
                                :label="isToggled?'Schließe ' + column.label + 'en':'Öffne ' + column.label + 'en'">
                                <a @click="toggleAll()"> {{ column.label }} <b-icon icon="angle-right"
                                        :class="isToggled?'open':'closed'" size="is-small"></b-icon></a>
                            </b-tooltip>
                        </template>
                        <a @click="toggle(props.row)" v-if="props.row.note">
                            <b-icon icon="angle-right" :class="showRow(props.row)"></b-icon>
                        </a>
                        <b-icon icon="angle-down" type="is-light" v-else></b-icon>
                    </b-table-column>
                    <b-table-column labe="Edit">
                        <b-button icon-left="pen" type="is-primary is-outlined is-inverted" @click="showEditModal" :disabled="selected.ID!==props.row.ID"></b-button>
                    </b-table-column>
                </template>
                <template slot="detail" slot-scope="props">
                    <article class="media">
                        <div class="media-content">
                            <div class="content">
                                <p>
                                    {{ props.row.note }}
                                </p>
                            </div>
                        </div>
                    </article>
                </template>
                <template slot="empty">
                    <section class="section">
                        <div class="content has-text-grey has-text-centered">
                            <p>
                                <b-icon icon="sad-tear" size="is-large">
                                </b-icon>
                            </p>
                            <p>Nothing here.</p>
                        </div>
                    </section>
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

import EditItem from '@/components/EditItem.vue'

export default {
    data() {
        return {
            kunde: 'Alle Kunden',
            defaultFilter: 0,
            job: '',
            area: '',
            userName: '',
            userTimeEntries: [],
            myselected: null,
            dates: [],
            now: new Date,
            isToggled: false,
            selected: {},
        }
    },
    computed: {
        hoursAll() {
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
                    .indexOf(this.kunde.toLowerCase()) >= 0
            })
        },
        kunden() {
            let myKundenReturn = ["Alle Kunden"]
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
                    .indexOf(this.job.toLowerCase()) >= 0
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
            if (this.kunde !== '' && this.kunde !== 'Alle Kunden') {
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
                // return special List
                let returnArray = []
                for (let key in userNameTimeEntries) {
                    let item = userNameTimeEntries[key].date
                    let itemArray = item.split(".")
                    let itemDate = new Date(itemArray[0], itemArray[1]-1, itemArray[2])
                    let itemTime = itemDate.getTime()
                    let selStartDate = new Date(this.dates[0])
                    let selStart = selStartDate.getTime()
                    let selEndDate = new Date(this.dates[1])
                    let selEnd = selEndDate.getTime()
                    // console.log(itemDate, selStartDate, selEndDate)
                    // console.log(itemTime, selStart, selEnd)
                    if ( itemTime >= selStart && itemTime <= selEnd) {
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
        },
        detailed() {
            let currentTimeEntries = this.currentTimeEntries
            let detailedArray = []
            for (let i in currentTimeEntries) {
                if (currentTimeEntries[i].note.length !== 0 ) {
                    detailedArray.push(currentTimeEntries[i].ID)
                }
            }
            return detailedArray
        },
        anyTimeEntries() {
            let entries = this.currentTimeEntries.length
            if (entries > 0) {
                return true
            } else {
                return false
            }
        },
        datesSelected() {
            return this.dates.length!==0?true:false
        }
    },
    methods: {
        toggle(row) {
            this.$refs.table.toggleDetails(row)
        },
        toggleAll() {
            this.isToggled = !this.isToggled
        },
        clearJobs() {
            this.area = ''
            this.job = ''
        },
        resetData() {
            this.kunde = '',
                this.job = ''
        },
        showRow(row) {
            let isOpen = undefined!==this.$refs.table?this.$refs.table.isActiveDetailRow(row):false
            let myClass = isOpen?"open":"closed"
            return myClass
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
                        // include the key of the object...
                        currentTimeEntriesArray = this.json2array(currentTimeEntriesObject)
                        for (let j in currentTimeEntriesArray) {
                            currentTimeEntriesArray[j]["user"] = user
                        }
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
            var result = []
            var keys = Object.keys(json)
            keys.forEach(function (key) {
                let jsonWithKey = json[key]
                jsonWithKey["ID"] = key
                result.push(jsonWithKey)
                // console.log(key)
                // console.log(jsonWithKey)
            });
            return result
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
            let rows = document.querySelectorAll("table tr");
            if (rows.length > 1) {
                let csv = [];
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
                    let dateStart = this.dates[0]
                    let dateEnd = this.dates[1]
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
                let lastrow = "Zeit Gesamt,,,,," + this.secondsToHrsMins(this.hoursAll) + ","
                // add last row with total time
                csv.push(lastrow)

                // Download CSV file
                this.downloadCSV(csv.join("\n"), filename);
            } else {
                this.$buefy.toast.open({
                message: 'Macht das Sinn, etwas leeres zu exportieren?!',
                type: 'is-warning',
                position: 'is-bottom'
                })
            }
        },
        focusInput() {
            this.$refs.kunde.focus()
        },
        secondsToHrsMins(seconds) {
            if (!seconds) return ''
            let mins = seconds / 60
            let hrs = Math.floor(mins / 60)
            mins = mins % 60
            return hrs + 'hrs ' + mins + 'mins'
        },
        showEditModal() {
            // console.log("Where's the modal?")
            this.$buefy.modal.open({
                parent: this,
                component: EditItem,
                hasModalCard: true,
                customClass: 'custom-class custom-class-2',
                trapFocus: true,
                props: {
                    userList: this.userList,
                    userIdList: this.userIdList,
                    selected: this.selected
                }
            })
        },
    },
    filters: {
        secondsToHrsMins(seconds) {
            if (!seconds) return '0 hrs 0 mins'
            let mins = seconds / 60
            let hrs = Math.floor(mins / 60)
            mins = mins % 60
            return hrs + 'hrs ' + mins + 'mins'
        },
        dateToHuman(dateString) {
            // Make date into string based on locale
            let dateArray = dateString.split(".")
            let day = dateArray[2]
            let month = dateArray[1] - 1
            let year = dateArray[0]
            let date = new Date(year,month,day)
            let dateHuman = date.toLocaleDateString()
            return dateHuman
        },
    },
    mounted() {
        this.loadAllData()
        this.focusInput()
    }
}
</script>
<style is-scoped>
.has-padding-15em {
    padding: 1.5em !important;
}
.icon.open {
    transform: rotate(90deg);
}
.icon.closed {
    transform: none;
}
/* for date click */
input.input[readonly] {
    cursor: pointer;
}
</style>