const config = require('./index');

module.exports = {
  development: {
    storage: config.dbFile,
    dialect: "sqlite",
    seederStorage: "sequelize",
    logQueryParameters: true,
    typeValidation: true
  },
  production: {
    use_env_variable: 'postgres://junxqaylgzrnda:3da653719420b4a5af30a274fec07eba8fe2e926be0f6f72e3137dc4bdc83a04@ec2-44-206-89-185.compute-1.amazonaws.com:5432/d57hcbg02h67bk',
    dialect: 'postgres',
    seederStorage: 'sequelize',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};