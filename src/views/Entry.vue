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

                                        <b-field label="Bereich" v-if="kunde !== ''">
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

                                        <b-field label="Job" v-if="kunde !== ''">
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

                                        <b-field label="Zeitspanne">
                                                <b-input placeholder='01h 05m' class="duration" :value="duration" v-cleave="masks.duration" @input.native="onInput" icon="clock"/>
                                        </b-field>

                                        <b-field label="Notiz">
                                            <b-input type="textarea" v-model="note"></b-input>
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

    import Cleave from 'cleave.js'

    const cleave = {
        name: 'cleave',
        bind(el, binding) {
            const duration = el.querySelector('.duration input')
            duration._vCleave = new Cleave(duration, binding.value)
        },
        unbind(el) {
            const duration = el.querySelector('.duration input')
            duration._vCleave.destroy()
        }
    }

    export default {
        directives: { cleave },
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
                duration: '',
                rawDuration: '',
                masks: {
                    duration: {
                        delimiters: ['h ', 'm'],
                        blocks: [2, 2, 0],
                        numericOnly: true
                    }
                },
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
            onInput(event) {
                this.rawDuration = event.target._vCleave.getRawValue()
                this.duration = event.target._vCleave.getFormattedValue()
            }
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