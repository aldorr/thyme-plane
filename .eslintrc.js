module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es2021: true
    },
    extends: [
        'plugin:vue/essential',
        'eslint:recommended'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        // Disable deprecation warnings for Vue 2 compatibility
        'vue/no-deprecated-slot-attribute': 'off',
        'vue/no-deprecated-slot-scope-attribute': 'off',
        'vue/no-deprecated-filter': 'off',
        'vue/no-deprecated-v-on-native-modifier': 'off',
        'vue/no-deprecated-v-bind-sync': 'off'
    },
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        parser: '@babel/eslint-parser',
        requireConfigFile: false
    }
}