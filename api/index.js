const customer = require('./customer');
const sales = require('./sales');
const exercise = require('./exercise');
const assignexercise = require('./assignexercise');
const exerciselink = require('./exerciselink');
const exercisepack = require('./exercisepack');
const manager = require('./manager');
const inbody = require('./inbody');
const customerenter = require('./customerenter');
const loginHistroy = require('./loginHistroy');

//api 파일 생성할 때 마다 index에도 함께 추가
const routers = {
    loginHistroy: loginHistroy,
    customer: customer,
    sales: sales,
    customerenter: customerenter,
    exercise: exercise,
    assignexercise: assignexercise,
    exerciselink: exerciselink,
    exercisepack: exercisepack,
    manager: manager,
    inbody: inbody,
}

module.exports = routers;
