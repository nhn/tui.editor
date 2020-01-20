module.exports = api => {
  api.cache(false);

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          loose: true
        }
      ]
    ],
    plugins: ['@babel/plugin-proposal-class-properties'],
    babelrcRoots: ['.', 'apps/*', 'plugins/*']
  };
};
