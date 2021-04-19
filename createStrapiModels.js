(async () => {
  const { Sequelize } = require('sequelize');
  const exec = require('child_process').exec;

  const typeCheck = (value) => {
    if (value.includes('NUMERIC')) return 'decimal';
    if (value.includes('DOUBLE')) return 'float';
    if (value.includes('INTEGER')) return 'integer';
    if (value.includes('TIMESTAMP')) return 'datetime';
    if (value.includes('BIGINT')) return 'biginteger';
    if (value.includes('BOOLEAN')) return 'boolean';
    if (value.includes('TEXT')) return 'text';
    if (value.includes('VARYING')) return 'text';
    return value;
  };
  
  const createModelObj = (model) => {
    const finalObj = {};
    const attributes = Object.keys(model);
    const shadowModel = { ...model };
    const ignoredFields = [
      'id',
      'created_at',
      'created_by',
      'updated_by',
      'published_at',
      'updated_at',
    ];
    attributes.map((attr) => {
      if (ignoredFields.includes(attr)) return;
      const type = typeCheck(shadowModel[attr].type);
      finalObj[attr] = type;
    });
    return finalObj;
  };

  const createModel = async (name) => {
    try {
      const schemas = await sequelize.getQueryInterface().describeTable(name);
      const attrsForSchema = createModelObj(schemas);
      let commandString = '';
      for (const key in attrsForSchema) {
        commandString += key + ':' + attrsForSchema[key] + ' ';
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
  };

  const itterateAndExec = async (tablesNames) => {
    const ignoringNames = [
      'core_store',
      'strapi_webhooks',
      'strapi_permission',
      'strapi_role',
      'strapi_administrator',
      'strapi_users_roles',
      'upload_file',
      'upload_file_morph',
      'users-permissions_permission',
      'users-permissions_role',
      'users-permissions_user',
    ];
    const name = tablesNames[0];
    if (!ignoringNames.includes(name)) {
      await createModel(name);
    }

    if (tablesNames.slice(1).length) {
      itterateAndExec(tablesNames.slice(1));
    }
    return;
  };

  const sequelize = new Sequelize('strapidbapi', 'nikolay', 'niki654123', {
    host: 'localhost',
    dialect: 'postgres',
  });

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  try {
    const tablesNames = await sequelize.getQueryInterface().showAllTables();
    itterateAndExec(tablesNames);
  } catch (error) {
    console.log(error);
  }
})();
