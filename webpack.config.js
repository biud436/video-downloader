const path = require('path');

module.exports = {
    mode: "production",
    entry: './lib/app.js',
    output: {
      path: path.resolve(__dirname, 'bin'),
      filename: 'index.js'
    },    
    target: "node",
};