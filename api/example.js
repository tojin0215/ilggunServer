/**
 * @author kkyubr
 */
 let express = require('express');
 let router = express.Router();
 var AssignExercise = require('../models').AssignExercise;
 
 const sequelize = require("sequelize");
 const Op = sequelize.Op;
 
 require('moment-timezone');
 var moment = require('moment');
 moment.tz.setDefault("Asia/Seoul");
 
 router.route('/assignexercise')
     .get(function(req, res) {
         // 불러오기
         const type = req.query.type;
         const fitness_no = req.query.fitness_no;
         const member_no = req.query.member_no;
 
         if (!type) {res.status(400).json({message: 'no type'}); return;}
         if (!fitness_no) {res.status(400).json({message: 'no fitness_no'}); return;}
         if (!member_no) {res.status(400).json({message: 'no member_no'}); return;}
 
         const clue = {
             where: {
                 fitness_no: fitness_no
             }
         }
 
         if (type === "all") {}
         else if (type === "member") {
             clue.where = {
                 fitness_no: fitness_no,
                 member_no: member_no,
             }
         }
         else if (type === "customer"){ // 날짜포함
             clue.where = {
                 fitness_no: fitness_no,
                 member_no: member_no,
                 createAt : {
                     [Op.between] : [moment(req.query.startDate).subtract(9, 'hours'),moment(req.query.endDate).subtract(9, 'hours')]
                 }
             }
         }
         else {}
 
         AssignExercise.findAll(clue)
         .then((exercise) => {
             console.log(exercise);
             res.json(exercise);
         })
         .catch((err) => {
             console.error(err);
             next(err);
             res.json([{group_no: 0}]);
         })
     })
     .post(function(req, res) {
         // 쓰기
         const b = req.body;
 
         AssignExercise.create({
             exercise_no: b.exercise_no,
             fitness_no: b.fitness_no,
             member_no: b.member_no,
             group_no: b.group_no,
             name: b.name,
             part: b.part,
             machine: b.machine,
             url: b.url,
             data_type: b.data_type,
             data: b.data,
             rest_second: b.rest_second,
             set_count: b.set_count,
         })
         .then(() => {
             res.send({'message': 'ok'});
         })
         .catch((err) => {
             console.error(err);
         });
     })
     .put(function(req, res) {
         // 수정
         /*AssignExercise.update({ title: "바꿀거 ", contents: "바꿀 내용1", mood : "바꿀 내용2", verse: "바꿀 내용3", }, { where: { writer: '권소령', year:2021, month:1, date:28 } })
         .then((result) => {
         res.send('Update the diary');
         })
         .catch((err) => {
         console.error(err);
         next(err);
         });*/ 
     })
     .delete(function (req, res) {
         //삭제
         /*AssignExercise.destroy({ where: { writer: "권소령", year:2021, month:1, date:14 } })
         .then((result) => {
         res.send('Delete the diary');
         })
         .catch((err) => {
         console.error(err);
         next(err);
         });*/
     });
 
 module.exports = router;
 