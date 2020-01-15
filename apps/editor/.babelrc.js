module.exports = {
  presets: ['@babel/preset-env'],
  plugins: [
    ['@babel/plugin-proposal-class-properties', { spec: true }],
    ['@babel/plugin-transform-destructuring', { loose: true }]
  ]
};
