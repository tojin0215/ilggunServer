const path = require('path');
const Sequelize = require('sequelize');
const fs = require('fs');

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

db.Business = require('./business')(sequelize, Sequelize); //회사
db.ContractForm = require('./contractform')(sequelize, Sequelize); //회원 입장
db.ContractForm2 = require('./contractform2')(sequelize, Sequelize); //회원 입장
db.InsurancePercentage = require('./insurancePercentage')(sequelize, Sequelize); //운동
db.Message = require('./message')(sequelize, Sequelize); //운동 배정
db.OtherAllowance = require('./otherAllowance')(sequelize, Sequelize); //운동 링크
db.OvertimeWork = require('./overtimeWork')(sequelize, Sequelize); //운동 묶음
db.TimeLog = require('./timelog')(sequelize, Sequelize); //매출
db.TimeLog = require('./vacation')(sequelize, Sequelize); //신규휴가



db.Manager = require('./manager')(sequelize, Sequelize); //매니저(로그인정보)
db.Inbody = require('./inbody')(sequelize, Sequelize); //인바디정보

module.exports = db;
