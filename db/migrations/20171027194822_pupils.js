exports.up = function (knex, Promise) {
    return knex.schema.createTable('pupils', function (table) {
        table.increments();
        table.string('pupil_name').notNullable();
        table.string('pupil_surename').notNullable();
        table.string('pupils_class').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    })

};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('pupils');

};
