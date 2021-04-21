const ignoredAttributesNames = [
  'id',
  'created_at',
  'created_by',
  'updated_by',
  'published_at',
  'updated_at',
];
const ignoredTablesNames = [
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

module.exports = {
  filterAttributes(attributes) {
    const attributesNames = Object.keys(attributes);
    const filtered = attributesNames.reduce((acc, curr) => {
      if (ignoredAttributesNames.includes(curr)) return acc;
      const type = typeCheck(attributes[curr].type);
      acc[curr] = { type };
      return acc;
    }, {});
    return filtered;
  },
  filterTables(tables) {
    return tables.filter((tableName) => {
      if (ignoredTablesNames.includes(tableName)) return;
      return tableName;
    });
  },
};
