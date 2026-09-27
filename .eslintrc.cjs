module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es2022: true
    },
    extends: [
        'plugin:vue/recommended',
        'eslint:recommended'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        // Keep noise down during Options API migration; re-tighten later
        'vue/multi-word-component-names': 'off',
        'vue/no-v-html': 'off',
        'vue/require-default-prop': 'off',
        'vue/require-prop-types': 'off',
        'vue/html-self-closing': 'off',
        'vue/component-definition-name-casing': 'off'
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module'
    },
    ignorePatterns: ['dist/', 'node_modules/']
}
