<template>
    <!-- START CALENDAR VIEW -->
    <div id="is-time-calendar" class="section is-view">
        <div class="container">
            <div class="hero is-small is-warning">
                <div class="hero-body">
                    <h2 class="title">Just a test page</h2>
                    <p>(but with real data from user {{currentUserName}})</p>
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
                // timeEntries: {},
                columns: [
                    {
                        field: 'customer',
                        label: 'Kunde'
                    },
                    {
                        field: 'area',
                        label: 'Bereich'
                    },
                    {
                        field: 'job',
                        label: 'Job'
                    },
                    {
                        field: 'date',
                        label: 'Datum'
                    },
                    {
                        field: 'time',
                        label: 'Zeit'
                    },
                    {
                        field: 'note',
                        label: 'Notiz'
                    }
                ],
            }
        },
        computed: {
            userID() {
                return 'ZVhFit5urSeId1YrbJXHMFWKVeq2'
            },
            timeEntries() {
                return this.$store.getters.usertimes
            },
            currentUserName() {
                // get user's name with the id this.$store.getters.user
                let userID = this.userID
                // let timeEntries = this.timeEntries
                let currentUserName = this.timeEntries[userID].fullname
                // console.log(currentUserName)
                return currentUserName
            },
            currentTimeEntries() {
                let userID = this.userID
                // console.log(userID)
                let timeEntries = this.timeEntries
                // console.log(timeEntries)
                let userObject = timeEntries[userID]
                // console.log(userObject)
                let currentTimeEntriesObject = userObject.timeentries
                // console.log(currentTimeEntriesObject)
                let currentTimeEntriesArray = this.json2array(currentTimeEntriesObject)
                // also iterate through array: change dates to readable format
                // & change time to hours & mins
                currentTimeEntriesArray.forEach((v, i) =>
                    currentTimeEntriesArray[i].date = this.dateToHuman(currentTimeEntriesArray[i].date)
                );
                currentTimeEntriesArray.forEach((v, i) =>
                    currentTimeEntriesArray[i].time = this.secondsToHrsMins(currentTimeEntriesArray[i].time)
                );
                return currentTimeEntriesArray
            }
        },
        methods: {
            loadAllData() {
                this.$store.dispatch('loadCustomerEntries')
                this.$store.dispatch('loadTimeEntries')
                .then(() => {
                    this.timeEntries = this.$store.state.userTimeEntries
                    this.userName = this.currentUserName
                })
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
