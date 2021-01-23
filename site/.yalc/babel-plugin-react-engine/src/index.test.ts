import pluginTester from 'babel-plugin-tester/pure'

import plugin from '../src'

pluginTester({
  plugin,
  pluginName: 'babel-plugin-react-engine',
  filename: __filename,
  snapshot: true,
  tests: [
    { fixture: '__fixtures__/simple.js' },
    { fixture: '__fixtures__/variable.js' },
  ],
})
