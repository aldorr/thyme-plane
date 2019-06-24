<template>
<!-- START SINGLE ADD -->
    <div id="is-time-add" class="section is-view">
        <div class="container">
            <div class="columns">
                <div class="column is-8 is-offset-2">
                    <div class="card">
                        <form action="#">
                            <header class="card-header">
                                <p class="card-header-title">Add Entry</p>
                            </header>
                            <div class="card-content">
                                <div class="columns">
                                    <div class="column">
<!--                                         <b-field label="Kunde">
                                            <b-select placeholder="Kunde auswählen" icon="building" v-model="kunde" expanded> -->
                                                <!-- TODO: get from db -->
<!--                                                 <option v-for="option in data.entries" :value="option.name" :key="option.id">
                                                    {{ option.name }}
                                                </option>
                                            </b-select>
                                        </b-field> -->
                                        <b-field label="Kunde auswählen">
                                            <b-autocomplete
                                                v-model="kunde"
                                                ref="autocomplete"
                                                open-on-focus
                                                :data="filteredKundenArray"
                                                placeholder="e.g. Metropolis"
                                                icon="building"
                                                @select="option => selected = option"
                                                @input="clearJobs">
                                                <template slot="empty">Leider keine Kunden namens {{kunde}}</template>
                                            </b-autocomplete>
                                        </b-field>

                                        <b-field label="Bereich" v-if="kunde !== null">
                                            <b-autocomplete
                                            expanded
                                                v-model="bereich"
                                                ref="autocomplete"
                                                open-on-focus
                                                :data="filteredBereicheArray"
                                                placeholder="Bereich Wählen"
                                                icon="folder-open"
                                                @select="option => selected = option">
                                                <template slot="empty">No results for "{{bereich}}"</template>
                                            </b-autocomplete>
                                        </b-field>

                                        <b-field label="Job" v-if="kunde !== null">
                                            <b-autocomplete
                                            expanded
                                                v-model="job"
                                                ref="autocomplete"
                                                open-on-focus
                                                :data="filteredJobsArray"
                                                placeholder="Job Wählen"
                                                icon="file-alt"
                                                @select="option => selected = option">
                                                <template slot="empty">No results for "{{job}}"</template>
                                            </b-autocomplete>
                                        </b-field>

                                        <!-- <b-field label="Bereich" v-if="kunde !== null">
                                            <b-select placeholder="Bereich Wählen" icon="folder-open" expanded>
                                                <option v-for="option in getBereicheArray(kunde)" :value="option" :key="option">
                                                    {{ option }}
                                                </option>

                                            </b-select>
                                        </b-field> -->
                                        
                                        <!-- <b-field label="Job" v-if="kunde !== null">
                                            <b-select placeholder="Job Wählen" icon="file-alt" expanded>
                                                <option v-for="option in getJobsArray(kunde)" :value="option" :key="option">
                                                    {{ option }}
                                                </option>

                                            </b-select>
                                        </b-field> -->

                                    </div>
                                    <div class="column">
                                        <b-field label="Datum">
                                            <b-datepicker
                                                placeholder="Click to select..."
                                                icon="calendar" class="is-small" v-model="date" expanded
                                                :max-date="maxDate">
<div class="buttons is-right">
                                                <button class="button is-primary is-fullwidth"
                                                    @click.prevent="date = new Date()">
                                                    <b-icon icon="calendar-alt"></b-icon>
                                                    <span>Heute</span>
                                                </button>
                                                <button class="button is-danger is-fullwidth"
                                                    @click.prevent="date = null">
                                                    <b-icon icon="times-circle"></b-icon>
                                                    <span>Zurücksetzen</span>
                                                </button>
</div>
                                            </b-datepicker>
                                        </b-field>

                                        <div class="field">
                                            <label for="time" class="label">Zeitspanne</label>
                                            <div class="control has-icons-left">
                                                <input type="text" size="10" maxlength="10" placeholder = '11h 11m' class="input duration" v-model="time"/>
                                                <span class="icon is-small is-left">
                                                    <i class="fas fa-clock"></i>
                                                </span>
                                            </div>
                                        </div>

                                        <b-field label="Notiz">
                                            <b-input maxlength="200" type="textarea" v-model="note"></b-input>
                                        </b-field>
                                        
                                    </div>
                                </div>
                            </div>
                            <div class="card-footer is-right">
                                <div class="field is-grouped is-grouped-right" style="margin-left:auto;">
                                    <div class="control card-footer-item">
                                        <button class="button is-text" @click.prevent="addEntry">Cancel</button>
                                    </div>
                                    <div class="control card-footer-item is-link">
                                        <button class="button is-link" @click.prevent="addEntry">Submit</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- END SINGLE ADD -->
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
            const today = new Date()

            return {
                // data,
                kunde: '',
                idx: '',
                bereich: '',
                job: '',
                // bereiche: [],
                // jobs: []
                date: new Date(),
                maxDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                time: '',
                note: ''
            }
        },
        computed: {
            // currentBereiche() {
            //     return this.getBereicheArray(this.data.kunde)
            // },

            
            filteredKundenArray() {
                return this.kunden.filter((option) => {
                    return option
                        .toString()
                        .toLowerCase()
                        .indexOf(this.kunde.toLowerCase()) >= 0
                })
            },

            filteredBereicheArray() {
                // console.log(this.bereiche)
                return this.bereiche.filter((option) => {
                    return option
                        .toString()
                        .toLowerCase()
                        .indexOf(this.bereich.toLowerCase()) >= 0
                })
            },
            filteredJobsArray() {
                return this.jobs.filter((option) => {
                    return option
                        .toString()
                        .toLowerCase()
                        .indexOf(this.job.toLowerCase()) >= 0
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
            bereiche() {
                let myBereicheReturn = []
                // check in each array if it has that one
                for (let entry in this.customerEntries) {
                    // console.log(this.customerEntries[entry].name)
                    if (this.customerEntries[entry].name === this.kunde) {
                        // console.log(this.customerEntries[entry].bereiche)
                        for (let bereich in this.customerEntries[entry].bereiche) {
                            myBereicheReturn.push(this.customerEntries[entry].bereiche[bereich])
                        }
                    }
                }
                return myBereicheReturn
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
            idxs() {
                var keys = [], i = 0;
                for (keys[i++] in this.customerEntries) {}
                return keys
            }
        },
        methods: {
            addEntry() {
                this.$toast.open({duration: 5000,
                    message: `Not active, yet!`,
                    position: 'is-bottom',
                    type: 'is-warning'
                })
            },
            loadCustomerData() {
                this.$store.dispatch('loadCustomerEntries')
            },
            setKundeSubs() {
                this.bereiche = this.bereiche
                console.log(this.bereiche)
            },
            getKunde() {
                return this.data.kunde
            },
            getKundeBool() {
                if ( this.data.kunde != null ) {
                    return true
                } else {
                    return false
                }
            },
            clearJobs() {
                this.bereich = ''
                this.job = ''
            },
            to_seconds(dd,hh,mm) {
                var d = parseInt(dd);
                var h = parseInt(hh);
                var m = parseInt(mm);
                if (isNaN(d)) d = 0;
                if (isNaN(h)) h = 0;
                if (isNaN(m)) m = 0;
              
                var t = d * 24 * 60 * 60 +
                    h * 60 * 60 +
                    m * 60;
                return t;
            },
            // expects 1d 11h 11m, or 1d 11h,
            // or 11h 11m, or 11h, or 11m, or 1d
            // returns a number of seconds.
            parseDuration(sDuration) {
                if (sDuration == null || sDuration === '') return 0;
                var mrx = new RegExp(/([0-9][0-9]?)[ ]?m/);
                var hrx = new RegExp(/([0-9][0-9]?)[ ]?h/);
                var drx = new RegExp(/([0-9])[ ]?d/);
                var days = 0;
                var hours = 0;
                var minutes = 0;
                if (mrx.test(sDuration)) {
                    minutes = mrx.exec(sDuration)[1];
                }
                if (hrx.test(sDuration)) {
                    hours = hrx.exec(sDuration)[1];
                }
                if (drx.test(sDuration)) {
                    days = drx.exec(sDuration)[1];
                }
                
                return to_seconds(days, hours, minutes);
            },
            // outputs a duration string based on
            // the number of seconds provided.
            // rounded off to the nearest 1 minute.
            toDurationString(iDuration) {
                var result;
                if (iDuration <= 0) return "";
                var m = Math.floor((iDuration/60)%60);
                var h = Math.floor((iDuration/3600)%24);
                var d = Math.floor(iDuration/86400);
                result = "";
                if (d > 0) result = result + d + "d ";
                if (h > 0) result  = result + h + "h ";
                if (m > 0) result  = result + m + "m ";
                return result.substring(0, result.length - 1);
            },
    /*
            var input_duration = document.querySelector("form input.duration");
            input_duration.addEventListener("change", function(event) {
                event.preventDefault();
                var sd = input_duration.value;
                var seconds = parseDuration(sd);
                if (sd !== "" && seconds === 0) {
                    input_duration.classList.add("is-warning");
                    input_duration.classList.remove("is-success");
                    input_duration.focus();
                } else {
                    input_duration.value = toDurationString(seconds);
                    input_duration.classList.add("is-success");
                    input_duration.classList.remove("is-warning");
                }
            });
    */
        },
        mounted() {
            this.loadCustomerData()
        }
    }
</script>

<style>
label.label {
    text-align: left;
}
</style>