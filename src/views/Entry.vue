<template>
    <ValidationObserver ref="observer">
        <!-- START SINGLE ADD -->
        <div id="is-time-add" class="section is-view">
            <div class="container">
                <div class="columns">
                    <div class="column is-8 is-offset-2">
                        <div class="card">
                            <form action="#">
                                <header class="card-header">
                                    <p class="card-header-title">
                                        <span class="column is-narrow">
                                            Add time entry for &nbsp;
                                        </span>
                                        <span class="column is-narrow">
                                            <b-field>
                                                <b-select placeholder="Find name" v-model="userName" mode="eager"
                                                    icon="user">
                                                    <!-- Only show fallback if no users are loaded -->
                                                    <option v-if="userList.length === 0"
                                                        :value="getCurrentUserNameFallback()">
                                                        {{ getCurrentUserNameFallback() }}
                                                    </option>
                                                    <option v-for="option in userList" :value="option" :key="option">
                                                        {{ option }}
                                                    </option>
                                                </b-select>
                                            </b-field>
                                        </span>
                                    </p>
                                </header>
                                <div class="card-content">
                                    <div class="columns">
                                        <div class="column">
                                            <ValidationProvider v-model="kunde" name="kunde" rules="required"
                                                v-slot="slotProps">
                                                <b-field label="Choose Client"
                                                    :type="{ 'is-danger': !!slotProps?.errors?.[0], 'is-success': !!slotProps?.valid }"
                                                    :message="String(slotProps?.errors?.[0] || '')">
                                                    <b-autocomplete expanded v-model="kunde" open-on-focus
                                                        :data="filteredKundenArray" placeholder="e.g. Forest Inc."
                                                        icon="building" @select="option => selected = option"
                                                        @input="clearJobs" key="customer" ref="kunde">
                                                        <template #default="option">
                                                            {{ option.option || option }}
                                                        </template>
                                                        <template v-slot:empty>No client named
                                                            {{ kunde }}</template>
                                                    </b-autocomplete>
                                                </b-field>
                                            </ValidationProvider>

                                            <ValidationProvider v-model="bereich" name="bereich" rules="required"
                                                v-slot="slotProps">
                                                <b-field label="Choose Area"
                                                    :type="{ 'is-danger': !!(slotProps?.errors?.[0] && kunde), 'is-success': !!slotProps?.valid, 'is-unselectable': !kunde }"
                                                    :message="kunde ? String(slotProps?.errors?.[0] || '') : ''">
                                                    <b-autocomplete expanded :disabled="!kunde" v-model="bereich"
                                                        open-on-focus :data="filteredBereicheArray"
                                                        placeholder="Find area" icon="folder-open"
                                                        @select="option => selected = option" key="bereich">
                                                        <template #default="option">
                                                            {{ option.option || option }}
                                                        </template>
                                                        <template v-slot:empty>No area named
                                                            "{{ bereich }}"</template>
                                                    </b-autocomplete>
                                                </b-field>
                                            </ValidationProvider>

                                            <ValidationProvider v-model="job" name="job" rules="required" v-slot="slotProps">
                                                <b-field label="Choose Job"
                                                    :type="{ 'is-danger': !!(slotProps?.errors?.[0] && kunde), 'is-success': !!slotProps?.valid }"
                                                    :message="kunde ? String(slotProps?.errors?.[0] || '') : ''">
                                                    <b-autocomplete expanded :disabled="!kunde" v-model="job"
                                                        open-on-focus :data="filteredJobsArray" placeholder="Find job"
                                                        icon="file-alt" @select="option => selected = option" key="job">
                                                        <template #default="option">
                                                            {{ option.option || option }}
                                                        </template>
                                                        <template v-slot:empty>No job named
                                                            "{{ job }}"</template>
                                                    </b-autocomplete>
                                                </b-field>
                                            </ValidationProvider>
                                        </div>

                                        <div class="column">
                                            <ValidationProvider v-model="date" name="date" rules="required" v-slot="slotProps">
                                                <b-field label="Choose Date Range"
                                                    :type="{ 'is-danger': !!slotProps?.errors?.[0], 'is-success': !!slotProps?.valid }"
                                                    message="Default: Today">
                                                    <b-datepicker placeholder="Click to select..." icon="calendar"
                                                        class="is-small" v-model="date" expanded :max-date="maxDate"
                                                        key="date">
                                                        <div class="buttons is-right">
                                                            <button class="button is-primary is-fullwidth"
                                                                @click.prevent="date = new Date()">
                                                                <b-icon icon="calendar-alt"></b-icon>
                                                                <span>Today</span>
                                                            </button>
                                                            <!-- <button class="button is-danger is-fullwidth"
                                                            @click.prevent="date = null">
                                                            <b-icon icon="times-circle"></b-icon>
                                                            <span>Zurücksetzen</span>
                                                        </button> -->
                                                        </div>
                                                    </b-datepicker>
                                                </b-field>
                                            </ValidationProvider>
                                            <ValidationProvider v-model="durationSeconds" name="duration" rules="min_duration"
                                                v-slot="slotProps">
                                                <b-field label="Duration"
                                                    :type="{ 'is-danger': !!slotProps?.errors?.[0], 'is-success': !!slotProps?.valid }"
                                                    :message="String(slotProps?.errors?.[0] || 'Use the steppers or a preset')">
                                                    <DurationPicker v-model="durationSeconds" />
                                                </b-field>
                                            </ValidationProvider>
                                            <b-field label="Note">
                                                <b-input type="textarea" v-model="note"></b-input>
                                            </b-field>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer is-right">
                                    <div class="field is-grouped is-grouped-right" style="margin-left:auto;">
                                        <div class="control card-footer-item">
                                            <button class="button is-text" @click.prevent="resetData">Reset</button>
                                        </div>
                                        <div class="control card-footer-item is-link">
                                            <button class="button is-primary"
                                                @click.prevent="validateAndSubmit">Submit</button>
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
    </ValidationObserver>
</template>

<script>

import { defineRule } from 'vee-validate';
import { required } from '@vee-validate/rules';
import ValidationObserver from '@/components/ValidationObserver.vue'
import ValidationProvider from '@/components/ValidationProvider.vue'
import DurationPicker from '@/components/DurationPicker.vue'
import { formatDurationLabel } from '@/utils/formatters'

// Add the required rule
defineRule('required', (value) => {
    if (!required(value)) {
        return 'Nicht vergessen…';
    }
    return true;
});

defineRule('min_duration', (value) => {
    if (Number(value) >= 60) {
        return true;
    }
    return 'Pick a duration';
});

export default {
    name: 'entryEditor',
    components: {
        ValidationObserver,
        ValidationProvider,
        DurationPicker
    },
    data() {
        const today = new Date()

        return {
            kunde: '',
            idx: '',
            bereich: '',
            job: '',
            date: new Date(),
            maxDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            durationSeconds: 0,
            note: '',
            userName: '',
            timeEntries: {},
            currentUserName: ''
        }
    },
    computed: {
        userList() {
            console.log('Computing userList');
            const userTimeEntries = this.$store.state.userTimeEntries;
            if (!userTimeEntries) {
                console.log('No userTimeEntries found');
                return [];
            }

            const users = [];
            for (const userId in userTimeEntries) {
                if (userTimeEntries[userId].fullname) {
                    console.log('Found user:', userTimeEntries[userId].fullname);
                    users.push(userTimeEntries[userId].fullname);
                }
            }

            console.log('User list computed:', users);
            return users;
        },
        userIdList() {
            try {
                // Get all users' names and ids
                const userIdList = [];
                const timeEntries = this.timeEntries || {};

                // Safely iterate over entries
                for (const id in timeEntries) {
                    if (Object.prototype.hasOwnProperty.call(timeEntries, id)) {
                        userIdList.push(id);
                    }
                }

                console.log('userIdList computed:', userIdList.length, 'users');
                return userIdList;
            } catch (error) {
                console.error('Error in userIdList computed property:', error);
                return [];
            }
        },
        currentUserId() {
            // Get the current user's ID directly from store
            const userId = this.$store.getters.user;
            console.log('Current user ID:', userId);
            return userId;
        },
        filteredKundenArray() {
            return this.kunden.filter((option) => {
                return option
                    .toString()
                    .toLowerCase()
                    .indexOf(this.kunde.toLowerCase()) >= 0
            })
        },

        filteredBereicheArray() {
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
            try {
                const myKundenReturn = [];
                const customerEntries = this.customerEntries || {};

                for (const entry in customerEntries) {
                    if (customerEntries[entry] && customerEntries[entry].name) {
                        myKundenReturn.push(customerEntries[entry].name);
                    }
                }

                console.log('Customers found:', myKundenReturn.length);
                return myKundenReturn;
            } catch (error) {
                console.error('Error in kunden computed property:', error);
                return [];
            }
        },
        bereiche() {
            try {
                const myBereicheReturn = [];
                const customerEntries = this.customerEntries || {};

                // Return empty array if no client selected
                if (!this.kunde) {
                    return [];
                }

                // Check in each array if it has that one
                for (const entry in customerEntries) {
                    if (customerEntries[entry] && customerEntries[entry].name === this.kunde) {
                        const bereiche = customerEntries[entry].bereiche || {};

                        for (const bereich in bereiche) {
                            if (bereiche[bereich] && bereiche[bereich].archived === false) {
                                myBereicheReturn.push(bereiche[bereich].name);
                            }
                        }
                    }
                }

                console.log('Areas found for', this.kunde + ':', myBereicheReturn.length);
                return myBereicheReturn;
            } catch (error) {
                console.error('Error in bereiche computed property:', error);
                return [];
            }
        },
        jobs() {
            try {
                const myJobsReturn = [];
                const customerEntries = this.customerEntries || {};

                // Return empty array if no client selected
                if (!this.kunde) {
                    return [];
                }

                for (const entry in customerEntries) {
                    if (customerEntries[entry] && customerEntries[entry].name === this.kunde) {
                        const jobs = customerEntries[entry].jobs || {};

                        for (const job in jobs) {
                            if (jobs[job] && jobs[job].archived === false) {
                                myJobsReturn.push(jobs[job].name);
                            }
                        }
                    }
                }

                console.log('Jobs found for', this.kunde + ':', myJobsReturn.length);
                return myJobsReturn;
            } catch (error) {
                console.error('Error in jobs computed property:', error);
                return [];
            }
        },
        idxs() {
            let keys = [], i = 0;
            for (keys[i++] in this.customerEntries) {
                // do nothing?
            }
            return keys
        },
        rawDuration() {
            return this.durationSeconds
        },
        dateToString() {
            // This format is better for sorting
            // 2016.10.15
            let date = this.date
            let dateString
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let month0 = month < 10 ? "0" + month : month
            let day = date.getDate();
            let day0 = day < 10 ? "0" + day : day
            dateString = year + '.' + month0 + '.' + day0
            return dateString
            // return this.date.toString()
        },
        dateToHuman() {
            // Maybe in this format is better
            // 2016-10-15 13:43:27
            let date = this.date
            let dateHuman
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            dateHuman = day + '.' + month + '.' + year
            return dateHuman
        }
    },
    methods: {
        getCurrentUserNameFallback() {
            // This is a fallback method to get the current user's name if no users are loaded
            // First try from store getters
            const userName = this.$store.getters.userName;
            if (userName) {
                console.log('Getting username from store getter:', userName);
                return userName;
            }

            // Then try from email
            const userEmail = this.$store.getters.userEmail;
            if (userEmail) {
                console.log('Getting username from email:', userEmail);
                return userEmail.split('@')[0]; // Use the part before @ as a name
            }

            console.warn('Could not get any username');
            return 'Unknown User';
        },
        addEntry() {
            this.$buefy.dialog.confirm({
                title: 'Please Check your Entries',
                message: '<table class="table is-striped is-fullwidth"><tbody><tr><th>User</th><td> ' + this.userName + '</td></tr><tr><th>Client</th><td>' + this.kunde + '</td></tr><tr><th>Area</th><td>' + this.bereich + '</td></tr><tr><th>Job</th><td>' + this.job + '</td></tr><tr><th>Date</th><td>' + this.dateToHuman + '</td></tr><tr><th>Duration</th><td>' + formatDurationLabel(this.durationSeconds) + '</td></tr><tr><th>Note</th><td>' + this.note + "</td></tr></tbody></table>",
                confirmText: 'Save',
                type: 'is-primary',
                trapFocus: true,
                hasIcon: true,
                icon: 'calendar',
                cancelText: 'Edit',
                onConfirm: () => {
                    let user = this.currentUserId
                    let newEntry = {
                        customer: this.kunde,
                        area: this.bereich,
                        job: this.job,
                        date: this.dateToString,
                        time: this.rawDuration,
                        note: this.note
                    }
                    this.$store.dispatch('newEntry', {
                        user: user,
                        newEntry: newEntry
                    }).then(
                        this.$buefy.toast.open({
                            duration: 5000,
                            message: `Added!`,
                            position: 'is-bottom',
                            type: 'is-success'
                        }),
                        this.resetData()
                    )
                }
            })
        },
        validateAndSubmit() {
            // Use the validateForm from the slot scope
            if (this.$refs.observer && this.$refs.observer.validate) {
                this.$refs.observer.validate().then(({ valid }) => {
                    if (valid) {
                        this.addEntry();
                    }
                });
            } else {
                // Fallback if observer ref is not available
                this.addEntry();
            }
        },
        resetData() {
            this.kunde = '',
                this.bereich = '',
                this.job = '',
                this.date = new Date(),
                this.durationSeconds = 0,
                this.note = ''
            requestAnimationFrame(() => {
                if (this.$refs.observer) {
                    if (typeof this.$refs.observer.reset === 'function') {
                        this.$refs.observer.reset();
                    } else if (typeof this.$refs.observer.resetForm === 'function') {
                        this.$refs.observer.resetForm();
                    }
                }
            });
        },
        loadAllData() {
            console.log('Loading all data in Entry view');

            // Initialize currentUserName first to avoid undefined errors
            const fallbackName = this.getCurrentUserNameFallback();
            this.currentUserName = fallbackName;
            this.userName = fallbackName;
            console.log('Initially set currentUserName to:', this.currentUserName);

            // Load both data sources in parallel
            Promise.all([
                this.$store.dispatch('loadCustomerEntries'),
                this.$store.dispatch('loadTimeEntries')
            ])
                .then(() => {
                    console.log('All data loaded in Entry view');

                    // Set timeEntries from store
                    this.timeEntries = this.$store.state.userTimeEntries;
                    console.log('Time entries set:', this.timeEntries ? 'Yes' : 'No');

                    // Set userName to current user's name
                    if (this.$store.getters.userName) {
                        this.userName = this.$store.getters.userName;
                        this.currentUserName = this.$store.getters.userName;
                        console.log('Set userName from store:', this.userName);
                    } else {
                        // Use our fallback method
                        this.userName = this.getCurrentUserNameFallback();
                        this.currentUserName = this.userName;
                        console.log('Set userName from fallback:', this.userName);
                    }
                })
                .catch(error => {
                    console.error('Error loading data:', error);
                    // Even if we have an error, ensure userName is set
                    if (!this.userName) {
                        this.userName = this.getCurrentUserNameFallback();
                        this.currentUserName = this.userName;
                        console.log('Set userName from fallback after error:', this.userName);
                    }
                });
        },
        // setKundeSubs() {
        //     this.bereiche = this.bereiche
        // },
        getKunde() {
            return this.data.kunde
        },
        getKundeBool() {
            if (this.data.kunde != null) {
                return true
            } else {
                return false
            }
        },
        clearJobs() {
            this.bereich = ''
            this.job = ''
            requestAnimationFrame(() => {
                if (this.$refs.observer) {
                    if (typeof this.$refs.observer.reset === 'function') {
                        this.$refs.observer.reset();
                    } else if (typeof this.$refs.observer.resetForm === 'function') {
                        this.$refs.observer.resetForm();
                    }
                }
            });
        },
        focusInput() {
            if (this.$refs.kunde && this.$refs.kunde.focus) {
                this.$refs.kunde.focus()
            }
        }
    },
    created() {
        console.log('Entry view created');
        // Call our improved loadAllData method
        this.loadAllData();
    },
    mounted() {
        // Just focus the input, data loading is handled in created
        this.focusInput();
    }
}
</script>

<style>
span>.field {
    margin-bottom: 1em;
}

label.label {
    text-align: left;
}

.modal .media {
    width: 100%;
}
</style>
