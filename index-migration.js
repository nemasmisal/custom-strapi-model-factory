(async () => {
  const { Sequelize } = require('sequelize');
  const { linkRelations } = require('./linkRelations');
  const { createComponent } = require('./createComponents');
  const { createStrapiModel } = require('./createStrapiModels');
  const { filterTables } = require('./utils');

  const sequelize = new Sequelize('taskstrapi', 'nikolay', 'niki654123', {
    host: 'localhost',
    dialect: 'postgres',
  });

  const getTablesNames = async () => {
    return await sequelize.getQueryInterface().showAllTables();
  };

  const getTableDescribe = async (name) => {
    return await sequelize.getQueryInterface().describeTable(name);
  };

  const getKeyFeference = async (name) => {
    return await sequelize.getQueryInterface().getForeignKeyReferencesForTable(name);
  }

  const itterateAndExec = async (tablesNames) => {
    const name = tablesNames[0];
    if(name.startsWith('components_')) {
      const tableDescription = await getTableDescribe(name);
      createComponent(name,tableDescription);
    } else {
      const tableDescription = await getTableDescribe(name);
      const tableKeyFeferenceDetails = await getKeyFeference(name);
      createStrapiModel(name,tableDescription);
      tableKeyFeferenceDetails.length?linkRelations(tableKeyFeferenceDetails): null;
    }

    if(tablesNames.slice(1).length) {
     return itterateAndExec(tablesNames.slice(1));
    }
    return;
  }
  
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    const rawTablesNames = await getTablesNames();
    const tablesNames = filterTables(rawTablesNames);
    itterateAndExec(tablesNames);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
