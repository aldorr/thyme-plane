<template>
  <ValidationObserver ref="observer">
    <form @submit.prevent="validateForm">
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Edit Entry</p>
        </header>
        <section class="modal-card-body">
          <b-field label="Name">
            <b-input type="text" :value="user" required disabled icon="user"></b-input>
          </b-field>
          <b-field label="Kunde">
            <b-input type="text" :value="customer" required disabled icon="building"></b-input>
          </b-field>
          <ValidationProvider v-model="area" name="area" rules="required" v-slot="slotProps">
            <b-field label="Bereich ändern"
              :type="{'is-danger': !!(slotProps?.errors?.[0] && customer), 'is-success': !!slotProps?.valid, 'is-unselectable': !customer}"
              :message="customer ? String(slotProps?.errors?.[0] || '') : ''">
              <b-autocomplete expanded :disabled="!customer" v-model="area" open-on-focus :data="filteredBereicheArray"
                placeholder="Choose Area" icon="folder-open" @select="option => selected = option" key="bereich">
                <template slot="empty">No Area named: 
                  "{{area}}"</template>
              </b-autocomplete>
            </b-field>
          </ValidationProvider>
          <ValidationProvider v-model="job" name="job" rules="required" v-slot="slotProps">
            <b-field label="Job ändern" :type="{'is-danger': !!(slotProps?.errors?.[0] && customer), 'is-success': !!slotProps?.valid}"
              :message="customer ? String(slotProps?.errors?.[0] || '') : ''">
              <b-autocomplete expanded :disabled="!customer" v-model="job" open-on-focus :data="filteredJobsArray"
                placeholder="Choose Job" icon="file-alt" @select="option => selected = option" key="job">
                <template slot="empty">No Job named:
                  "{{job}}"</template>
              </b-autocomplete>
            </b-field>
          </ValidationProvider>
          <ValidationProvider v-model="date" name="date" rules="required" v-slot="slotProps">
            <b-field label="Change date" :type="{'is-danger': !!slotProps?.errors?.[0], 'is-success': !!slotProps?.valid}"
              :message="'Original: ' + dateToHuman($attrs.selected.date)">
              <b-datepicker placeholder="Click to select..." icon="calendar" class="is-small" v-model="date" expanded
                :max-date="maxDate" key="date">
                <div class="buttons is-right">
                  <button class="button is-primary is-fullwidth" @click.prevent="date = maxDate">
                    <b-icon icon="calendar-alt"></b-icon>
                    <span>Today</span>
                  </button>
                </div>
              </b-datepicker>
            </b-field>
          </ValidationProvider>
          <ValidationProvider v-model="durationSeconds" name="duration" rules="min_duration" v-slot="slotProps">
            <b-field label="Duration" :type="{'is-danger': !!slotProps?.errors?.[0], 'is-success': !!slotProps?.valid}"
              :message="String(slotProps?.errors?.[0] || 'Use the steppers or a preset')">
              <DurationPicker v-model="durationSeconds" />
            </b-field>
          </ValidationProvider>

          <b-field label="Notiz">
            <b-input type="textarea" v-model="note"></b-input>
          </b-field>

        </section>
        <footer class="modal-card-foot level">
            <!-- Left side -->
            <div class="level-left">
              <div class="level-item">
              <button class="button" type="button" @click="closeModal" ref="cancel">Cancel</button>
              </div>
              <div class="level-item">
              <button class="button is-primary">Submit Changes</button>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
              <button class="button is-danger" @click.prevent="deleteEntry()">Delete</button>
              </div>
            </div>
        </footer>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
    import { defineRule } from 'vee-validate'
    import { required } from '@vee-validate/rules'
    import ValidationObserver from '@/components/ValidationObserver.vue'
    import ValidationProvider from '@/components/ValidationProvider.vue'
    import DurationPicker from '@/components/DurationPicker.vue'

    // Add the required rule
    defineRule('required', (value) => {
        if (!required(value)) {
            return 'Don\'t forget…';
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
  name: 'EditItem',
  components: {
      ValidationObserver,
      ValidationProvider,
      DurationPicker
  },
  data() {
    const today = new Date()
    return {
      ID: this.$attrs.selected.ID,
      user: this.$attrs.selected.user,
      customer: this.$attrs.selected.customer,
      job: this.$attrs.selected.job,
      area: this.$attrs.selected.area,
      date: this.dateToObj(this.$attrs.selected.date),
      origDate: this.dateToObj(this.$attrs.selected.date),
      durationSeconds: Number(this.$attrs.selected.time) || 0,
      note: this.$attrs.selected.note,
      maxDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    }
  },
  computed: {
    userID() {
      let userIndex = this.$attrs.userList.indexOf(this.user)
      return this.$attrs.userIdList[userIndex - 1]
    },
    filteredBereicheArray() {
        return this.bereiche.filter((option) => {
            return option
                .toString()
                .toLowerCase()
                .indexOf(this.area.toLowerCase()) >= 0
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
    bereiche() {
        let myBereicheReturn = []
        // check in each array if it has that one
        for (let entry in this.customerEntries) {
            if (this.customerEntries[entry].name === this.customer) {
                for (let bereich in this.customerEntries[entry].bereiche) {
                  if (this.customerEntries[entry].bereiche[bereich].archived == false) {
                    myBereicheReturn.push(this.customerEntries[entry].bereiche[bereich].name)
                  }
                }
            }
        }
        return myBereicheReturn
    },
    jobs() {
        let myJobsReturn = []
        for (let entry in this.customerEntries) {
            if (this.customerEntries[entry].name === this.customer) {
                for (let job in this.customerEntries[entry].jobs) {
                  if (this.customerEntries[entry].jobs[job].archived == false) {
                    myJobsReturn.push(this.customerEntries[entry].jobs[job].name)
                  }
                }
            }
        }
        return myJobsReturn
    },
    dateToString() {
        // This format is better for sorting
        // 2016.10.15
        let date = this.date
        let dateString
        let year    = date.getFullYear();
        let month   = date.getMonth() + 1;
        let month0  = month<10?"0" + month:month
        let day     = date.getDate();
        let day0    = day<10?"0" + day:day
        dateString = year + '.' + month0 + '.' + day0
        return dateString
    },
    rawDuration() {
        return this.durationSeconds
    },
    anyChanges() {
      if (this.area !== this.$attrs.selected.area || this.job !== this.$attrs.selected.job || this.dateToString !== this.$attrs.selected.date || this.durationSeconds !== this.$attrs.selected.time || this.note !== this.$attrs.selected.note) {
        return true
      } else {
        return false
      }
    },
  },
  methods: {
    validateForm() {
      if (this.$refs.observer && this.$refs.observer.validate) {
        this.$refs.observer.validate().then(({ valid }) => {
          if (valid) {
            this.changeEntry();
          }
        });
      } else {
        this.changeEntry();
      }
    },
    changeEntry() {
      if (this.anyChanges) {

        this.$buefy.dialog.confirm({
          title: 'Really?',
          message: 'This will overwrite the data with your changes!',
          confirmText: 'Submit Changes',
          type: 'is-warning',
          trapFocus: true,
          hasIcon: true,
          icon: 'pen',
          cancelText: 'Edit',
          onConfirm: () => {
            let userID = this.userID
            let ID = this.ID
            let sendObject = {
              customer: this.customer,
              area: this.area,
              job: this.job,
              date: this.dateToString,
              time: this.rawDuration,
              note: this.note,
            }
            // console.log("Changing Entry?")
            // console.log(userID, ID, sendObject)
            this.$store.dispatch('updateEntry', {
                user: userID,
                entryID: ID,
                updatedEntry: sendObject
            })
            .then(
                this.$buefy.toast.open({duration: 5000,
                    message: `Changed!`,
                    position: 'is-bottom',
                    type: 'is-success'
                }),
              this.$emit('close')
            )
          }
        })
      } else {
        this.$buefy.toast.open({
          message: 'No changes?!',
          type: 'is-warning',
          position: 'is-bottom'
        })
      }
    },
    deleteEntry() {

        this.$buefy.dialog.confirm({
          title: 'Really Delete?',
          message: 'This will completely delete the entry… forever!',
          confirmText: 'Löschen',
          type: 'is-danger',
          trapFocus: true,
          hasIcon: true,
          icon: 'trash',
          cancelText: 'Cancel',
          focusOn: 'cancel',
          onConfirm: () => {
            this.$buefy.dialog.confirm({
              title: 'Really really?',
              message: 'Are you really really sure? You can not undo this!',
              confirmText: 'Löschen',
              type: 'is-danger',
              trapFocus: true,
              hasIcon: true,
              icon: 'trash',
              cancelText: 'Cancel',
              focusOn: 'cancel',
              onConfirm: () => {
                let userID = this.userID
                let ID = this.ID
                // console.log("deleting Entry?")
                // console.log(userID, ID, sendObject)
                this.$store.dispatch('deleteEntry', {
                    user: userID,
                    entryID: ID,
                })
                .then(
                    this.$buefy.toast.open({duration: 5000,
                        message: `Deleted!`,
                        position: 'is-bottom',
                        type: 'is-success'
                    }),
                  this.$emit('close')
                )
              }
            })
            this.$emit('close')
          }
        })

    },
    closeModal() {
      this.$emit('close')
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
    dateToObj(dateString) {
        let dateArray = dateString.split(".")
        let day = dateArray[2]
        let month = dateArray[1] - 1
        let year = dateArray[0]
        let date = new Date(year,month,day)
        return date
    },
  },

  mounted() {
    this.durationSeconds = Number(this.$attrs.selected.time) || 0
  }
}
</script>

<style>
.table tbody tr:last-child td, .table tbody tr:last-child th, table td:not([align]), table th:not([align]) {
  vertical-align: middle;
}
.modal-card-foot.level {
  justify-content: space-between;
}
</style>
