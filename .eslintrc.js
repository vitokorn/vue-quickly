module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/vue3-essential'
    ],
    parserOptions: {
        ecmaVersion: 2020,
    },
    rules: {
        'vue/multi-word-component-names': 'off',
    },
};

