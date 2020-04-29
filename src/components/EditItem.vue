<template>
    <ValidationObserver ref="observer" v-slot="{ passes }">
  <form @submit.prevent="passes(changeEntry)">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Eintrag ändern</p>
      </header>
      <section class="modal-card-body">
        <b-field label="Name">
          <b-input type="text" :value="user" required disabled></b-input>
        </b-field>
        <b-field label="Kunde">
          <b-input type="text" :value="customer" required disabled></b-input>
        </b-field>
        <ValidationProvider name="area" rules="required"
            v-slot="{ errors, valid }">
            <b-field label="Bereich ändern"
                :type="{'is-danger': errors[0] && customer, 'is-success': valid, 'is-unselectable': !customer}"
                :message="customer?errors:''">
                <b-autocomplete expanded :disabled="!customer" v-model="area"
                    open-on-focus :data="filteredBereicheArray"
                    placeholder="Bereich Wählen" icon="folder-open"
                    @select="option => selected = option" key="bereich">
                    <template slot="empty">Noch keinen Bereich namens
                        "{{area}}"</template>
                </b-autocomplete>
            </b-field>
        </ValidationProvider>
        <ValidationProvider name="job" rules="required" v-slot="{ errors, valid }">
            <b-field label="Job ändern"
                :type="{'is-danger': errors[0] && customer, 'is-success': valid}"
                :message="customer?errors:''">
                <b-autocomplete expanded :disabled="!customer" v-model="job"
                    open-on-focus :data="filteredJobsArray" placeholder="Job Wählen"
                    icon="file-alt" @select="option => selected = option" key="job">
                    <template slot="empty">Noch keinen Job namens
                        "{{job}}"</template>
                </b-autocomplete>
            </b-field>
        </ValidationProvider>
        <ValidationProvider name="date" rules="required" v-slot="{ errors, valid }">
          <b-field label="Datum ändern"
              :type="{'is-danger': errors[0], 'is-success': valid}"
              :message="'Original: ' + $attrs.date">
              <b-datepicker placeholder="Click to select..." icon="calendar"
                  class="is-small" v-model="date" expanded :max-date="maxDate"
                  key="date">
                  <div class="buttons is-right">
                      <button class="button is-primary is-fullwidth"
                          @click.prevent="date = new Date()">
                          <b-icon icon="calendar-alt"></b-icon>
                          <span>Heute</span>
                      </button>
                  </div>
              </b-datepicker>
          </b-field>
        </ValidationProvider>
        <ValidationProvider name="duration" rules="required"
            v-slot="{ errors, valid }">
            <b-field label="Zeitspanne eingeben"
                :type="{'is-danger':errors[0], 'is-success': valid}"
                :message="{[errors]: errors[0], 'Im Format: 01h 05m': !errors[0]}">
            <b-input type="text" :value="time | durationFilter" required v-cleave="masks.duration" class="duration"></b-input>
          </b-field>
        </ValidationProvider>
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">Abbrechen</button>
        <button class="button is-primary">Ändern</button>
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
      ID: this.$attrs.ID,
      user: this.$attrs.user,
      customer: this.$attrs.customer,
      job: this.$attrs.job,
      area: this.$attrs.area,
      date: new Date(this.$attrs.date),
      time: "01h 15m",
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
                    myBereicheReturn.push(this.customerEntries[entry].bereiche[bereich].name)
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
                    myJobsReturn.push(this.customerEntries[entry].jobs[job].name)
                }
            }
        }
        return myJobsReturn
    },
  },
  methods: {
    changeEntry() {
      // console.log(this)
      console.log("Changing Entry?")
      this.$parent.close()
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
    console.log(this.secondsToHMs(this.$attrs.time))
    this.time = this.secondsToHMs(this.$attrs.time)
  }
}
</script>