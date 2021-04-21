const fs = require('fs');

module.exports = {
  linkRelations(references) {
    try {
      let {
        tableName,
        referencedTableName,
        referencedColumnName,
        columnName,
      } = references[0];
      if (tableName.includes('_')) {
        tableName = tableName.replaceAll('_', '-');
      }
      const pathToJson =
        './api/' + tableName + '/models/' + tableName + '.settings.json';
      const data = require(pathToJson);
      data.attributes[columnName] = {
        model: referencedTableName,
        via: referencedColumnName,
      };
      fs.writeFileSync(
        pathToJson,
        JSON.stringify(data, null, 2),
        function (err) {
          if (err) return console.log(err);
          console.log(tableName, ' written succesfully');
        }
      );
    } catch (error) {
      console.log(error);
    }
  },
};
