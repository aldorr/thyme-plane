<template>
  <Field :name="name" :rules="rules" v-slot="slotProps">
    <component :is="'div'" style="display: contents;">
      <slot 
        :errors="unwrapErrorsNow(slotProps.errors)" 
        :valid="unwrapValidNow(slotProps.meta)" 
        :field="slotProps.field" 
      />
    </component>
  </Field>
</template>

<script>
import { Field } from 'vee-validate'
import { toRaw, markRaw } from 'vue'

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
    }
  },
  methods: {
    unwrapErrorsNow(errors) {
      // Immediately unwrap and return plain array
      if (!errors) return [];
      try {
        const raw = toRaw(errors);
        const result = [];
        for (let i = 0; i < (raw.length || 0); i++) {
          result.push(String(raw[i] || ''));
        }
        // Create a new array and mark as non-reactive
        const newArray = [...result];
        Object.freeze(newArray);
        return markRaw(newArray);
      } catch (e) {
        try {
          const serialized = JSON.parse(JSON.stringify(errors || []));
          const arr = Array.isArray(serialized) ? serialized.map(e => String(e || '')) : [];
          Object.freeze(arr);
          return markRaw(arr);
        } catch (e2) {
          return [];
        }
      }
    },
    unwrapValidNow(meta) {
      // Immediately unwrap and return boolean primitive
      if (!meta) return false;
      try {
        const raw = toRaw(meta);
        return raw.valid === true;
      } catch (e) {
        try {
          return JSON.parse(JSON.stringify({ valid: meta.valid })).valid === true;
        } catch (e2) {
          return false;
        }
      }
    }
  }
}
</script>
