exports.up = function (knex, Promise) {
    return knex.schema.createTable('teachers', function (table) {
        table.increments();
        table.string('name').notNullable();
        table.string('sname').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('teachers');
};
