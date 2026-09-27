<template>
  <Field
    :name="name"
    :rules="rules"
    :model-value="modelValue"
    @update:model-value="onUpdate"
    v-slot="{ errors, meta }"
  >
    <slot
      :errors="normalizeErrors(errors)"
      :valid="meta.valid === true"
      :message="normalizeErrors(errors)[0] || ''"
    />
  </Field>
</template>

<script>
import { Field } from 'vee-validate'

export default {
  name: 'ValidationProvider',
  components: {
    Field
  },
  props: {
    name: {
      type: String,
      required: true
    },
    rules: {
      type: [String, Object],
      default: ''
    },
    modelValue: {
      default: undefined
    }
  },
  emits: ['update:modelValue'],
  methods: {
    onUpdate(value) {
      this.$emit('update:modelValue', value)
    },
    normalizeErrors(errors) {
      if (!errors || !errors.length) return []
      return errors.map((e) => String(e || '')).filter(Boolean)
    }
  }
}
</script>
