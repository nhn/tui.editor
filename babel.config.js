module.exports = api => {
  const env = api.env();

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: env === 'test' ? 'commonjs' : false,
          loose: true
        }
      ]
    ],
    plugins: ['@babel/plugin-proposal-class-properties'],
    babelrcRoots: ['.', 'apps/*', 'plugins/*']
  };
};
