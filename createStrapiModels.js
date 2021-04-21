const exec = require('child_process').exec;
const { filterAttributes } = require('./utils');

module.exports = {
  createStrapiModel(name, tableDescription) {
    try {
      const attributes = filterAttributes(tableDescription);
      let commandString = '';
      for (const key in attributes) {
        commandString += key + ':' + attributes[key].type + ' ';
      }
      exec(
        'npm run strapi generate:api ' + name + ' ' + commandString,
        (error, stdout, stderr) => {
          console.log('error =>', error);
          console.log('stdout =>', stdout);
          console.log('stderr =>', stderr);
        }
      );
    } catch (error) {
      console.log(error);
    }
  },
};
