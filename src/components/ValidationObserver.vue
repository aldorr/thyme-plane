<template>
  <Form ref="formRef" as="div" v-slot="{ handleSubmit, meta }" @submit.prevent>
    <slot :valid="meta.valid" :handleSubmit="handleSubmit" />
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
      if (this.$refs.formRef && this.$refs.formRef.validate) {
        const result = await this.$refs.formRef.validate()
        return { valid: !!result?.valid }
      }
      return { valid: true }
    },
    reset() {
      if (this.$refs.formRef && this.$refs.formRef.resetForm) {
        this.$refs.formRef.resetForm()
      }
    },
    resetForm() {
      this.reset()
    }
  }
}
</script>
