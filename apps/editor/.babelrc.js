module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        loose: true
      }
    ]
  ],
  plugins: [['@babel/plugin-proposal-class-properties', { spec: true }]]
};
