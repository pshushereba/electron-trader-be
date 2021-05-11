
exports.up = function(knex) {
  return knex.schema
    .createTable("users", (tbl) => {
      tbl.increments();
      tbl.string("username", 255).notNullable();
      tbl.string("password", 255).notNullable();
      tbl.string("first_name", 255).notNullable();
      tbl.string("last_name", 255).notNullable();
      tbl.string("email", 255).unique().notNullable();
      tbl.string("avatar_img", 255);
    })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users")
};
