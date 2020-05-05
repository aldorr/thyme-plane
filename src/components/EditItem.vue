<template>
  <ValidationObserver ref="observer" v-slot="{ passes }">
    <form @submit.prevent="passes(changeEntry)">
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Eintrag ändern</p>
        </header>
        <section class="modal-card-body">
          <b-field label="Name">
            <b-input type="text" :value="user" required disabled icon="user"></b-input>
          </b-field>
          <b-field label="Kunde">
            <b-input type="text" :value="customer" required disabled icon="building"></b-input>
          </b-field>
          <ValidationProvider name="area" rules="required" v-slot="{ errors, valid }">
            <b-field label="Bereich ändern"
              :type="{'is-danger': errors[0] && customer, 'is-success': valid, 'is-unselectable': !customer}"
              :message="customer?errors:''">
              <b-autocomplete expanded :disabled="!customer" v-model="area" open-on-focus :data="filteredBereicheArray"
                placeholder="Bereich Wählen" icon="folder-open" @select="option => selected = option" key="bereich">
                <template slot="empty">Noch keinen Bereich namens
                  "{{area}}"</template>
              </b-autocomplete>
            </b-field>
          </ValidationProvider>
          <ValidationProvider name="job" rules="required" v-slot="{ errors, valid }">
            <b-field label="Job ändern" :type="{'is-danger': errors[0] && customer, 'is-success': valid}"
              :message="customer?errors:''">
              <b-autocomplete expanded :disabled="!customer" v-model="job" open-on-focus :data="filteredJobsArray"
                placeholder="Job Wählen" icon="file-alt" @select="option => selected = option" key="job">
                <template slot="empty">Noch keinen Job namens
                  "{{job}}"</template>
              </b-autocomplete>
            </b-field>
          </ValidationProvider>
          <ValidationProvider name="date" rules="required" v-slot="{ errors, valid }">
            <b-field label="Datum ändern" :type="{'is-danger': errors[0], 'is-success': valid}"
              :message="'Original: ' + dateToHuman($attrs.selected.date)">
              <b-datepicker placeholder="Click to select..." icon="calendar" class="is-small" v-model="date" expanded
                :max-date="maxDate" key="date">
                <div class="buttons is-right">
                  <button class="button is-primary is-fullwidth" @click.prevent="date = maxDate">
                    <b-icon icon="calendar-alt"></b-icon>
                    <span>Heute</span>
                  </button>
                </div>
              </b-datepicker>
            </b-field>
          </ValidationProvider>
          <ValidationProvider name="duration" rules="required" v-slot="{ errors, valid }">
            <b-field label="Zeitspanne eingeben" :type="{'is-danger':errors[0], 'is-success': valid}"
              :message="{[errors]: errors[0], 'Im Format:  01h 05m': !errors[0]}">
              <b-input type="text" :value="duration | durationFilter" required v-cleave="masks.duration"
                class="duration" v-on:keyup.native="onInput" icon="clock" key="duration"></b-input>
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
              <button class="button" type="button" @click="$parent.close()" ref="cancel">Abbrechen</button>
              </div>
              <div class="level-item">
              <button class="button is-primary">Ändern</button>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
              <button class="button is-danger" @click.prevent="deleteEntry()">Löschen</button>
              </div>
            </div>
        </footer>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
    import Cleave from 'cleave.js'
    import { extend } from 'vee-validate';
    import { required } from 'vee-validate/dist/rules';
    // Add the required rule
    extend('required', {
        ...required,
        message: 'Nicht vergessen…'
    });

    import { ValidationObserver, ValidationProvider } from 'vee-validate'

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
  name: 'EditItem',
  directives: { cleave },
  components: {
      ValidationObserver,
      ValidationProvider
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
      duration: 0,
      note: this.$attrs.selected.note,
      maxDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      masks: {
          duration: {
              delimiters: ['h ', 'm'],
              blocks: [2, 2, 0],
              numericOnly: true,
              noImmediatePrefix: true
          }
      },

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
        let mins = this.duration.slice(4, 6)
        let hrs = this.duration.slice(0, 2)
        return hrs * 60 * 60 + mins * 60
    },
    anyChanges() {
      if (this.area !== this.$attrs.selected.area || this.job !== this.$attrs.selected.job || this.dateToString !== this.$attrs.selected.date || this.rawDuration !== this.$attrs.selected.time || this.note !== this.$attrs.selected.note) {
        return true
      } else {
        return false
      }
    },
  },
  methods: {
    changeEntry() {
      if (this.anyChanges) {

        this.$buefy.dialog.confirm({
          title: 'Wirklich?',
          message: 'Hiermit überschreibst du mit deinen Änderungen.',
          confirmText: 'Überschreiben',
          type: 'is-warning',
          trapFocus: true,
          hasIcon: true,
          icon: 'pen',
          cancelText: 'Bearbeiten',
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
                    message: `Geändert!`,
                    position: 'is-bottom',
                    type: 'is-success'
                }),
              this.$parent.close()
            )
          }
        })
      } else {
        this.$buefy.toast.open({
          message: 'Keine Änderungen?!',
          type: 'is-warning',
          position: 'is-bottom'
        })
      }
    },
    deleteEntry() {

        this.$buefy.dialog.confirm({
          title: 'Endgültig löschen?',
          message: 'Hiermit löscht du den Eintrag.',
          confirmText: 'Löschen',
          type: 'is-danger',
          trapFocus: true,
          hasIcon: true,
          icon: 'trash',
          cancelText: 'Abbrechen',
          focusOn: 'cancel',
          onConfirm: () => {
            this.$buefy.dialog.confirm({
              title: 'Wirklich löschen?',
              message: 'Sicher? Das kannst du nicht rückgängig machen!',
              confirmText: 'Löschen',
              type: 'is-danger',
              trapFocus: true,
              hasIcon: true,
              icon: 'trash',
              cancelText: 'Abbrechen',
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
                        message: `Gelöscht!`,
                        position: 'is-bottom',
                        type: 'is-success'
                    }),
                  this.$parent.close()
                )
              }
            })
            this.$parent.close()
          }
        })

    },
    onInput(event) {
        this.duration = event.target._vCleave.getFormattedValue()
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
    secondsToHMs: function(seconds) {
        if (!seconds) return '0 h 0 m'
        let mins = seconds / 60
        let hrs = Math.floor(mins / 60)
        if (hrs<10) hrs = "0" + hrs
        mins = mins % 60
        if (mins<10) mins = "0" + mins
        return hrs + 'h ' + mins + 'm'
    },
  },

  filters: {
    durationFilter: function (value) {
      let hrs, mins
      if (value.length === 4) {
        hrs = value.slice(0, 2)
        if (hrs > 12) {
          hrs = 12
        }
        return hrs + "h "
      }
      if (value.length >= 6) {
        mins = value.slice(4, 6)
        hrs = value.slice(0, 2)
        if (hrs > 12) {
          hrs = 12
        }
        if (mins > 59) {
          mins = 59
        }
        return hrs + "h " + mins + "m"
      } else {
        return value
      }

    }
  },
  mounted() {
    // console.log(this.secondsToHMs(this.$attrs.time))
    this.duration = this.secondsToHMs(this.$attrs.selected.time)
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