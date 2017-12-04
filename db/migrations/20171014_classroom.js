exports.up = function (knex, Promise) {
    return knex.schema.createTable('classroom', function (table) {
        table.increments();
        table.string('name').notNullable(); 
        table.integer('teachers_id').notNullable(); 
        table.timestamp('created_at').defaultTo(knex.fn.now());
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('classroom');
};


