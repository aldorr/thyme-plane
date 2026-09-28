<template>
  <div class="duration-picker">
    <div class="duration-picker__steppers">
      <div class="duration-picker__group">
        <span class="duration-picker__label">Hours</span>
        <b-numberinput
          v-model="hours"
          :min="0"
          :max="12"
          :step="1"
          controls-alignment="center"
          expanded
          aria-label="Hours"
          @update:model-value="emitSeconds"
        />
      </div>
      <div class="duration-picker__group">
        <span class="duration-picker__label">Minutes</span>
        <b-numberinput
          v-model="minutes"
          :min="0"
          :max="59"
          :step="1"
          controls-alignment="center"
          expanded
          aria-label="Minutes"
          @update:model-value="emitSeconds"
        />
      </div>
    </div>

    <div class="duration-picker__presets buttons are-small">
      <b-button
        v-for="preset in presets"
        :key="preset.label"
        type="is-primary"
        outlined
        rounded
        @click="applyPreset(preset.seconds)"
      >
        {{ preset.label }}
      </b-button>
    </div>
  </div>
</template>

<script>
import { partsToSeconds, secondsToParts } from '@/utils/formatters'

const PRESETS = [
  { label: '15m', seconds: 15 * 60 },
  { label: '30m', seconds: 30 * 60 },
  { label: '45m', seconds: 45 * 60 },
  { label: '1h', seconds: 60 * 60 },
  { label: '1h 30m', seconds: 90 * 60 },
  { label: '2h', seconds: 2 * 60 * 60 }
]

export default {
  name: 'DurationPicker',
  props: {
    modelValue: {
      type: Number,
      default: 0
    }
  },
  emits: ['update:modelValue'],
  data() {
    const parts = secondsToParts(this.modelValue)
    return {
      hours: parts.hours,
      minutes: parts.minutes,
      presets: PRESETS
    }
  },
  watch: {
    modelValue(next) {
      const parts = secondsToParts(next)
      if (parts.hours !== this.hours) this.hours = parts.hours
      if (parts.minutes !== this.minutes) this.minutes = parts.minutes
    }
  },
  methods: {
    emitSeconds() {
      this.$emit('update:modelValue', partsToSeconds(this.hours, this.minutes))
    },
    applyPreset(seconds) {
      const parts = secondsToParts(seconds)
      this.hours = parts.hours
      this.minutes = parts.minutes
      this.$emit('update:modelValue', seconds)
    }
  }
}
</script>

<style scoped>
.duration-picker {
  width: 100%;
  text-align: left;
}

.duration-picker__steppers {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.duration-picker__group {
  min-width: 0;
}

.duration-picker__label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  opacity: 0.8;
}

.duration-picker__presets {
  margin-bottom: 0;
  flex-wrap: wrap;
}

@media screen and (max-width: 480px) {
  .duration-picker__steppers {
    grid-template-columns: 1fr;
  }
}
</style>
