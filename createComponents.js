const fs = require('fs');
const { filterAttributes } = require('./utils');

const serializeName = (name) => {
  return name.replaceAll('_', '-').slice(11);
};

const createDir = (name) => {
  if (fs.existsSync('./components/' + name)) return;
  fs.mkdirSync('./components/' + name, (err) => {
    if (err) {
      console.log('error at directory name ' + name, err);
      return;
    }
    console.log(name, ' Directory created');
    return;
  });
};

const createJson = (rawName, data) => {
  const name = serializeName(rawName);
  const pathToJson = './components/' + name + '/' + name + '.json';
  const attributes = filterAttributes(data);
  const componentObj = {
    collectionName: rawName,
    info: {
      name,
      icon: 'address-book',
    },
    options: {},
    attributes: attributes,
  };
  fs.writeFileSync(
    pathToJson,
    JSON.stringify(componentObj, null, 2),
    function (err) {
      if (err) return console.log('error at json ' + name, err);
      console.log(tableName, ' written succesfully');
    }
  );
};

module.exports = {
  createComponent(name, tableDescription) {
    createDir(serializeName(name));
    createJson(name, tableDescription);
  },
};
