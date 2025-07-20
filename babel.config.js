module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: [
            '> 1%',
            'last 2 versions',
            'not dead'
          ]
        },
        modules: false,
        useBuiltIns: 'usage',
        corejs: 3
      }
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
        development: process.env.NODE_ENV === 'development'
      }
    ]
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    [
      'styled-components',
      {
        displayName: process.env.NODE_ENV === 'development',
        fileName: process.env.NODE_ENV === 'development'
      }
    ]
  ],
  env: {
    development: {
      plugins: [
        'react-refresh/babel'
      ]
    },
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current'
            }
          }
        ],
        '@babel/preset-react'
      ]
    }
  }
};