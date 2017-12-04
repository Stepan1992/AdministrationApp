
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');

const dotenv = require('dotenv').config({
    silent: process.env.NODE_ENV === 'production',
    path: __dirname + '/.env'
});
const knex = require('./db/knex.js');
const port = process.env.PORT || 8000;

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    'extended': 'true'
}));

app.get('/teachers', function (req, res) {
    knex.select().from('teachers')
        .then(function (teachers) {
            res.status(200).send(teachers)
        })
});

app.post('/del-teacher', function (req, res) {
    knex('teachers').where('id', req.body.id).del()
        .then(function () {
            res.sendStatus(200);
        })
});

app.post('/edit-teacher', function (req, res) {
    knex('teachers').where('id', req.body.id).update({
            name: req.body.name,
            sname: req.body.sname
        })
        .then(function () {
            res.sendStatus(200);
        })
});

app.post('/add-teach', function (req, res) {
    knex('teachers').insert({
            name: req.body.name,
            sname: req.body.sname
        })
        .then(function () {
            res.sendStatus(200);
        })
});

app.post('/del_classRoom', function (req, res) {
    knex('classroom').where('id', req.body.id).del()

        .then(function () {
            res.sendStatus(200);

        });
});

app.post('/edit_class', function (req, res) {
    knex('classroom').where('id', req.body.id).update({
            name: req.body.className
        })
        .then(function () {
            res.sendStatus(200);
        })
});

app.post('/addClass', function (req, res) {
    knex('classroom').insert({
            name: req.body.name,
            teachers_id: req.body.teachers_id
        })
        .then(function () {
            res.sendStatus(200);
        })
});

app.get('/pupils', function (req, res) {

    knex('pupils').where('pupils_class', req.query.classId)
        .then(function (pupils) {
            res.status(200).send(pupils)
        })
});

app.get('/getPupils', function (req, res) {

    knex('pupils').where('pupils_class', req.query.className)
        .then(function (pupils) {
            res.status(200).send(pupils)
        })
});

app.post('/addPupil', function (req, res) {
    knex('pupils').insert({
            pupil_name: req.body.name,
            pupil_surename: req.body.surename,
            pupils_class: req.body.className
        })
        .then(function () {
            res.sendStatus(200);
        })
});

app.get('/checkingClass', function (req, res) {
    knex('classroom').where({
            name: req.query.name
        })
        .then(function (name) {
            if (name[0] == undefined) {
                knex('teachers').where({
                        id: req.query.teachers_id
                    })
                    .then(function (id) {
                        if (id[0] != undefined) {
                            res.status(200).send(true)
                        } else {
                            res.status(200).send(false)
                        }
                    })
            } else {
                res.status(200).send(false)
            }
        })
});

app.post('/del_pupil', function (req, res) {
    knex("pupils").where('id', req.body.id).del()
        .then(function () {
            res.sendStatus(200);
        })
});

app.post('/delFoundPupil', function (req, res) {
    knex("pupils").where('id', req.body.id).del()
        .then(function () {
            res.sendStatus(200);
        })
});

app.get('/checkUser', function (req, res) {
    knex('users').where({
            name: req.query.login,
            password: req.query.pass
        })
        .then(function (user) {
            res.status(200).send(user)
        })
});

app.get('/findPupils', function (req, res) {
    knex('pupils').where({
            pupil_name: req.query.pupil_name,
            pupil_surename: req.query.pupil_surename
        })
        .then(function (pupils) {
            res.status(200).send(pupils)
        })
});

app.post('/addNewUser', function (req, res) {
    knex('users').insert({
            name: req.body.name,
            password: req.body.password,
        })
        .then(function () {
            res.sendStatus(200);
        })
});



//зробити перевірку на одинакові назви колонки та тільки на строковий тип


app.post('/createNewColumn', function (req, res) {
    let columnName = req.body.newName;
    let sql = "ALTER TABLE teachers ADD COLUMN " + columnName + " VARCHAR(45) DEFAULT 'no data'"
    knex.schema.raw(sql)
        .then(function () {
            res.sendStatus(200);
        })
});

app.get('/checkingColumn', function (req, res) {
    knex.schema.raw("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'seconddb' AND TABLE_NAME = 'teachers' AND COLUMN_NAME NOT IN('id', 'name', 'sname', 'created_at')")
        .then(function (columsName) {
        res.status(200).send(columsName);
    })
});

app.post('/edit_pupil', function (req, res) {
    knex("pupils").where('id', req.body.id).update({
            pupil_name: req.body.name,
            pupil_surename: req.body.sname
        })
        .then(function () {
            res.sendStatus(200);
        })
});

app.get('/classroom', function (req, res) {
    knex.select('classroom.id as id', 'classroom.name as name', 'teachers.name as teacher_name',
     'teachers.sname as teacher_sname').from('classroom').innerJoin('teachers', 'classroom.teachers_id', 'teachers.id')
        .then(function (teachers) {
            res.status(200).send(teachers)
        })
});

app.get('*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, function (err) {
    if (err) throw err;
    console.log('Server start on port 8000!');
});
