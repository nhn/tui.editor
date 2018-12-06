const {version} = require('./package.json');

module.exports = {
  'source': {
    'include': [
      'src/js',
      'README.md'
    ],
    'includePattern': '.+\\.js(doc)?$',
    'excludePattern': '(^|\\/|\\\\)_'
  },
  'plugins': [
    'plugins/markdown'
  ],
  'templates': {
    'name': 'Editor',
    'logo': {
      'url': 'https://cloud.githubusercontent.com/assets/389021/16107646/9729e556-33d8-11e6-933f-5b09fa3a53bb.png',
      'width': '150px',
      'link': 'https://nhnent.github.io/tui.editor/'
    },
    'cleverLinks': true,
    'monospaceLinks': true,
    'default': {
      'outputSourceFiles': true
    },
    'applicationName': 'tui-editor',
    'disqus': '',
    'googleAnalytics': '',
    'openGraph': {
      'title': '',
      'type': 'website',
      'image': '',
      'site_name': '',
      'url': ''
    },
    'meta': {
      'title': '',
      'description': '',
      'keyword': ''
    },
    'linenums': false
  },
  'markdown': {
    'parser': 'gfm',
    'hardwrap': true
  },
  'opts': {
    'recurse': true,
    'name': 'TOAST UI Editor',
    'destination': `api/${version}`,
    'template': 'node_modules/tui-jsdoc-template',
    'tutorials': 'examples',
    'package': 'package.json'
  }
};
