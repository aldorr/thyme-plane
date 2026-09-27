<template>
  <Form ref="formRef" v-slot="{ errors: formErrors, meta: formMeta, handleSubmit }" @submit.prevent>
    <slot :errors="formErrors" :valid="formMeta.valid" :handleSubmit="handleSubmit" />
  </Form>
</template>

<script>
import { Form } from 'vee-validate'

export default {
  name: 'ValidationObserver',
  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Form
  },
  methods: {
    async validate() {
      // Expose validate method for $refs.observer.validate() calls
      // Access the Form's validate method via the ref
      if (this.$refs.formRef && this.$refs.formRef.validate) {
        const result = await this.$refs.formRef.validate()
        return { valid: result.valid }
      }
      // Fallback: try to access via form context
      return Promise.resolve({ valid: true })
    },
    reset() {
      // Expose reset method for $refs.observer.reset() calls
      if (this.$refs.formRef && this.$refs.formRef.resetForm) {
        this.$refs.formRef.resetForm()
      }
    },
    resetForm() {
      // Alias for reset
      this.reset()
    }
  }
}
</script>
