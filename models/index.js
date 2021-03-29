//  Author: Mohammad Jihad Hossain
//  Create Date: 22/03/2021
//  Modify Date: 22/03/2021
//  Description: All the relation between tabels for rest api project for E-Commerce


"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Check connection with DB
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Initialize DB with ORM
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.user = require("./user")(sequelize, Sequelize);
db.order = require("./order")(sequelize, Sequelize);
db.status = require("./status")(sequelize, Sequelize);
db.comment = require("./comment")(sequelize, Sequelize);
db.order_product = require("./order_product")(sequelize, Sequelize);
db.product = require("./product")(sequelize, Sequelize);
db.action = require("./action")(sequelize, Sequelize);

db.Role = require("./role")(sequelize, Sequelize);
db.Permission = require("./premission")(sequelize, Sequelize);


// All DB relation

// ===========================
// Role management relation

// Role has many permission
db.Role.belongsToMany(db.Permission, {
  through: "rolePermissions",
  foreignKey: "roleId",
  otherKey: "permissionId",
});

// Permission has many role
db.Permission.belongsToMany(db.Role, {
  through: "rolePermissions",
  foreignKey: "permissionId",
  otherKey: "roleId",
});


// User has one role
db.user.belongsTo(db.Role,{
 foreignKey: "roleId",
 targetKey: "id"
});

// When an user has multiple role 
// db.Role.belongsToMany(db.user, {
//   through: "userRoles",
//   foreignKey: "roleId",
//   otherKey: "userId",
// });

// db.user.belongsToMany(db.Role, {
//   through: "userRoles",
//   foreignKey: "userId",
//   otherKey: "roleId",
// });

//db.ROLES = ["user", "admin", "moderator"];
// ===========================

// ===========================
// Product relation with Order
db.product.belongsToMany(db.order, {
  through: db.order_product,
  foreignKey: "product_id",
});

db.order.belongsToMany(db.product, {
  through: db.order_product,
  foreignKey: "product_id",
});
// ===========================

db.order.hasMany(db.comment, {
  foreignKey: "id",
});

db.comment.belongsTo(db.order, {
  foreignKey: "order_id",
});

db.user.hasMany(db.comment, {
  foreignKey: "sender_id",
});

db.comment.belongsTo(db.user, {
  foreignKey: "sender_id",
});

db.user.hasMany(db.order, {
  foreignKey: "customer_id",
});

db.order.belongsTo(db.user, {
  foreignKey: "customer_id",
});

db.user.hasMany(db.action, {
  foreignKey: "employee_id",
});

db.action.belongsTo(db.user, {
  foreignKey: "employee_id",
});

db.status.hasMany(db.order, {
  foreignKey: "status_id",
});

db.order.belongsTo(db.status, {
  foreignKey: "status_id",
});

//Drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// Datasource syc
db.sequelize.sync();

module.exports = db;
