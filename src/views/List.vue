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

<!--             <div class="columns">
                <div class="column">
                    <table class="table is-striped is-fullwidth">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Project</th>
                                <th>Category</th>
                                <th>Subcategory</th>
                                <th>Time Entry</th>
                            </tr>
                        </thead>
                        <tfoot>
                            <tr>
                                <th>Date</th>
                                <th>Project</th>
                                <th>Category</th>
                                <th>Subcategory</th>
                                <th>Time Entry</th>
                            </tr>
                        </tfoot>
                        <tbody>
                            <tr>
                                <th>01/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th></th>
                                <td>Project 3</td>
                                <td>Category a</td>
                                <td>Subcategory 3fu</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr class="is-weekend">
                                <th>02/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr class="is-weekend">
                                <th>03/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>04/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>05/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>06/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>07/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>08/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>09/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>10/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>11/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>12/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>13/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>14/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>15/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>16/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>17/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>18/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>19/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>20/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>21/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>22/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>23/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>24/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>25/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>26/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>27/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>28/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>29/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>30/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                            <tr>
                                <th>31/06/2019</th>
                                <td>Project 2</td>
                                <td>Category 2</td>
                                <td>Subcategory 2</td>
                                <td>2h 15m</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div> -->

            <b-table :data="currentTimeEntries" :columns="columns"></b-table>
        </div>
    </div>
    <!-- END CALENDAR VIEW -->
</template>

<script>
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
                return this.$store.getters.user
            },
            timeEntries() {
                return this.$store.getters.usertimes
            },
            currentUserName() {
                // get user's name with the id this.$store.getters.user
                let userID = this.$store.getters.user
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
            // this.timeEntries = this.$store.state.userTimeEntries
        }
    }
</script>
