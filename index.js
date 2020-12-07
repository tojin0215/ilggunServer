const express    = require('express');
const session    = require('express-session');
const mysql      = require('mysql');
const dbconfig   = require('./db/database.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer      = require('multer');
const cors = require("cors");
const https = require('https');
const fs = require('fs');
const path = require('path');
const upload = multer({});

const connection = mysql.createConnection(dbconfig);
const app = express();

const options = {
key: fs.readFileSync('/opt/bitnami/apache2/conf/www.kwonsoryeong.tk.key'),
cert: fs.readFileSync('/opt/bitnami/apache2/conf/www.kwonsoryeong.tk.crt')

};
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'asdf123',
  resave: false,
  saveUninitialized: true,
})); 

const handleUpload = (req, res, next) => {
  console.log("안되는거야?");
  // The file shows up on req.body instead of req.file, per multer docs.
  const { file } = req.body;

  // File is written, but it's not a readable PDF.
  const tmp = fs.writeFileSync(
    path.join(__dirname, './test.png'),
    file,
  );
}
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({origin: true, credentials: true}));
// configuration =========================
app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.send('Root');
});

app.post('/signup', (req, res) => {
  console.log(req.body.id);
  console.log(req.body.password);
  connection.query('insert into users set ?', req.body ,function(err,result){
       console.log(err); 
	  res.json({result : 'success'});
    });
});

app.post('/signin', (req, res) => {
/*connection.query('show tables', (error, rows) => {
	console.log(rows);
});*/
connection.query('SELECT * from users where id=? and password=?', [req.body.id, req.body.password] , (error, rows) => {
    if (error) throw error;
    console.log('User info is: ', rows);
    //if(rows){
      req.session.name = req.body.id;
      req.session.save();
    //}
    res.cookie('token',rows.id);
    /*res.cookie('id', req.cookies.id, {
      maxAge: 10000
    }); */
    res.send(rows);
  });
});

app.post('/addBusiness', (req, res) => {
  req.body.id = req.session.name;
  console.log(req.body)
  connection.query('insert into business set ?', req.body ,function(err,result){
    res.json({result : 'success'});
  });
});
app.post('/writeContractform', (req, res) => {
  //console.log(req.body);
  if(req.body.types1){
  req.body.types1 = JSON.stringify(req.body.types1);
  req.body.types2 = JSON.stringify(req.body.types2);
  req.body.types3 = JSON.stringify(req.body.types3);
  req.body.types4 = JSON.stringify(req.body.types4);
  req.body.value4 = JSON.stringify(req.body.value4);
  }
  if(req.body.id == '/'){
    req.body.id = req.session.name
  }
  console.log(req.body)
  //req.body.id = req.session.name;
  connection.query('insert into contractform set ?', req.body ,function(err,result){
    console.log("성공");
    res.json({result : 'success'});
  });
});

app.post('/writeContractform2', (req, res) => {
  if(req.body.types1){
    req.body.types1 = JSON.stringify(req.body.types1);
    req.body.types2 = JSON.stringify(req.body.types2);
    req.body.types3 = JSON.stringify(req.body.types3);
  }
  if(req.body.id == '/'){
     req.body.id = req.session.name
  }
  console.log(req.body)
  connection.query('insert into contractform2 set ?', req.body ,function(err,result){
      console.log("성공");
      res.json({result : 'success'});
  });
});
app.post('/selectContractform2', (req, res) => {

	  console.log(req.body);

	  let id='';

	  if( req.body.id ){

		      id= req.body.id

		    }

	  else{

		      id= req.session.name

		    }

	  console.log(id, req.body.bang)

	  connection.query('SELECT * from contractform2 where id=? and bang=?', [id, req.body.bang] , (error, rows) => {

		      if (error) throw error;

		      console.log(rows);

		      res.send(rows);

		    });

});
app.post('/alterState', (req, res) => {
  console.log(req.body)
  if(req.body.id == '/'){
    req.body.id = req.session.name
  }
  //req.body.id = req.session.name;
  connection.query('UPDATE worker SET state=?, pay=?, mon=?, tue=?, wed=?, thu=?, fri=?, sat=?, sun=?, eachtime=?  WHERE business=? and workername=?', [req.body.type, req.body.pay, req.body.mon, req.body.tue, req.body.wed, req.body.thu, req.body.fri, req.body.sat, req.body.sun,req.body.eachtime, req.body.bang, req.session.name ] ,function(err,result){

	    
	console.log("성공");
    res.json({result : 'success'});
  });
});

//=====================================================================================//////////
app.post('/updateContractform', (req, res) => {
  console.log(req.body)
  //req.body.id = req.session.name;
  connection.query('UPDATE contractform SET EmployeeAddress=?, EmployeePhone=?, EmployeeName=?, type=? WHERE Employer=? and Employee=?', [req.body.EmployeeAddress, req.body.EmployeePhone, req.body.EmployeeName, req.body.type, req.body.Employer, req.body.Employee ] ,function(err,result){
    console.log("성공");
    res.json({result : 'success'});
  });
});
app.post('/updateContractform2', (req, res) => {
	console.log(req.body.type)	
	connection.query('UPDATE contractform2 SET EmployeeAddress=?, EmployeePhone=?, EmployeeName=?, type=? WHERE bang=? and id=?', [req.body.EmployeeAddress, req.body.EmployeePhone, req.body.EmployeeName, req.body.type, req.body.bang, req.body.id ] ,function(err,result){
        res.json({result : 'success'});
    });
});
app.post('/selectContractform', (req, res) => {
  console.log(req.body);
  let id='';
  if( req.body.id ){
    id= req.body.id
  }
  else{
    id= req.session.name
  }
  console.log(id, req.body.bang)
  connection.query('SELECT * from contractform where id=? and bang=?', [id, req.body.bang] , (error, rows) => {
    if (error) throw error;
    console.log(rows);
    res.send(rows);
  });
});

app.post('/selectReceivedMessage', (req, res) => {
  
  connection.query('SELECT * from message where t=?', [req.session.name] , (error, rows) => {
    console.log(rows);
    res.send(rows);
  });
});

app.post('/addBang', (req, res) => {
  connection.query('SELECT * from users where id=?', [req.session.name] , (error, rows) => {
    let b = JSON.parse(rows[0].bang);
    console.log(req.body);
    b[req.body.bang]=0
    console.log(b)
    let bang = JSON.stringify(b);
    connection.query('UPDATE users SET bang=? WHERE id=?', [bang, req.session.name] ,function(err,result){
      console.log("성공");
      res.json({result : 'success'});
    });
  });
});

app.post('/selectSentMessage', (req, res) => {
  
  connection.query('SELECT * from message where f=?', [req.session.name] , (error, rows) => {
    console.log(rows);
    res.send(rows);
  });
});
app.post('/SendMessage', (req, res) => {
  console.log(req.body.f);
  if(req.body.f!='system'){
    req.body['f']=req.session.name;
    req.body['message']= req.body['message'];
  }
  else{
    req.body['message']= req.session.name+req.body['message'];
  }
  
  console.log(req.body);
  connection.query('insert into message set ?', req.body ,function(err,result){
    res.json({result : 'success'});
  });
});
app.post('/updateCommute', (req, res) => {
  
  connection.query('SELECT bang from users where id=?', [req.session.name] , (error, rows) => {
    console.log(rows);
    let row = JSON.parse(rows[0].bang);
    row[req.body.bang] = row[req.body.bang]==1?0:1;
    console.log(JSON.stringify(row));
    connection.query('UPDATE users SET bang=? WHERE id=?', [JSON.stringify(row), req.session.name] ,function(err,result){
      //res.json({result : 'success'});
    });

    let h = (String(new Date().getHours())<10?'0'+String(new Date().getHours()):String(new Date().getHours()));
    let m = (String(new Date().getMinutes())<10?'0'+String(new Date().getMinutes()):String(new Date().getMinutes()));

    console.log(h, m)
    if(row[req.body.bang]==1){
      connection.query('insert into timelog set ?', {bang:req.body.bang, workername:req.session.name, year:new Date().getFullYear(),month:new Date().getMonth()+1, date:new Date().getDate() , goto:h+m} ,function(err,result){
        res.json({result : 'success'});
      });
    }
    else{
      connection.query('select * from timelog where bang=? and workername=? and year=? and month=? and date=?', [req.body.bang, req.session.name, new Date().getFullYear(),new Date().getMonth()+1, new Date().getDate()] , (err,rows) => {
        console.log(rows);
        if(rows.length==0){
          connection.query('insert into timelog set ?', {bang:req.body.bang, workername:req.session.name, year:new Date().getFullYear(),month:new Date().getMonth()+1, date:new Date().getDate() , leavee:h+m} ,function(err,row){
            res.json({result : 'success'});
          });
        }
        else{
          connection.query('UPDATE timelog SET leavee=? WHERE bang=? and workername=? and year=? and month=? and date=? and goto=?', [(h+m) , req.body.bang, req.session.name, (new Date().getFullYear()), (new Date().getMonth()+1), new Date().getDate(), rows[0].goto] ,function(err,result){
            console.log(err, result)
          });
        }
      });
    }

    
  });
});


app.post('/', (req, res) => {


});
app.post('/selectId', (req, res) => {
  connection.query('SELECT * from users where id like ?', '%'+req.body.id+'%' , (error, rows) => {
    if (error) throw error;
    console.log('User info is: ', rows);
    //res.cookie('token',rows.id);
    res.send(rows);
  });
});
app.post('/addWorker', (req, res) => {
  console.log("똑똑")
  connection.query('insert into worker set ?', req.body ,function(err,result){
    console.log(err,result)
    res.json({result : 'success'});
  });
});
app.post('/addWork', (req, res) => {
  console.log(req.body)
  console.log("dd")
  connection.query(`SELECT * from overtimework where business=? and day=? and month=? and date=? and year=? and workername=?`, [req.body.business, req.body.day, req.body.month, req.body.date, req.body.year, req.body.workername] , (error, rows) => {
    if(rows.length == 0){
      connection.query('insert into overtimework set ?', req.body ,function(err,result){
        console.log("a");
        res.json({result : 'success'});
      });
    }
    else{
      console.log(req.body.subt);
      connection.query('UPDATE overtimework SET time=?, subt=? WHERE business=? and day=? and month=? and date=? and year=? and workername=?', [req.body.time, req.body.subt, req.body.business, req.body.day, req.body.month, req.body.date, req.body.year, req.body.workername] ,function(err,result){
        console.log(err, result);
        res.json({result : 'success'});
      });
    }
  });  
});

app.post('/selectBusiness', (req, res) => {
  console.log(req.session.name);
  console.log("모게????"+req.session.id);
  console.log(req.body.id);
  connection.query('SELECT * from business where id=?', [req.session.name] , (error, rows) => {
    if (error) throw error;
    console.log('User info is: ', rows);
    //res.cookie('token',rows.id);
    res.send(rows);
  });
});
app.post('/selectBusinessByName', (req, res) => {

	connection.query('SELECT * from business where bname=?', [req.body.bname] , (error, rows) => {
		if (error) throw error;
		console.log('User info is: ', rows);
		res.send(rows);
	  });
});
app.post('/selectWorkerByType', (req, res) => {
  console.log(req.body.business+" + "+ req.body.type);
  connection.query('SELECT * from worker where business=? and type=?', [req.body.business, req.body.type] , (error, rows) => {
    if (error) throw error;
    console.log('worker info is: ', rows);
    //res.cookie('token',rows.id);
    res.send(rows);
  });
});

app.post('/selectWorker', (req, res) => {
  connection.query('SELECT * from worker where business=?', [req.body.business] , (error, rows) => {
    if (error) throw error;
    console.log('worker info is: ', rows);
    //res.cookie('token',rows.id);
    res.send(rows);
  });
});
app.post('/selectWorkerEach', (req, res) => {
  let workername = '';
  if(req.body.workername){
    workername = req.body.workername;
  }
  else{
    workername = req.session.name;
  }
  connection.query('SELECT * from worker where business=? and workername=?', [req.body.business,workername] , (error, rows) => {
    if (error) throw error;
    console.log('worker info is: ', rows);
    //res.cookie('token',rows.id);
    res.send(rows);
  });
});

app.post('/selectBusinessByWorker', (req, res) => {
  connection.query('SELECT * from users where id=?', [req.session.name] , (error, rows) => {
    if (error) throw error;
    console.log('worker info is: ', rows);
    //res.cookie('token',rows.id);
    res.send(rows);
  });
});



app.post('/selectImg', (req, res) => {
  console.log(__dirname);
  res.send('<img src="./public/11.jpg"/>');
});

app.post('/selectOvertimework', (req, res) => {
  console.log(req.body);
  connection.query(`SELECT * from overtimework where year=? and month=?`, [req.body.year, req.body.month] , (error, rows) => {
    if (error) throw error;
    console.log('+++++++++++++++++++++++++ ', rows);
      //res.cookie('token',rows.id);
      res.send(rows);
  });
});

app.post('/selectTimelog', (req, res) => {
  console.log(req.body);
  console.log(">>>>>>>>>>>>>>>")
  connection.query(`SELECT * from timelog where bang=? and year=? and month=? and date=?`, [req.body.bang, req.body.year, req.body.month, req.body.date] , (error, rows) => {
    if (error) throw error;
    console.log('worker info is: ', rows);
      //res.cookie('token',rows.id);
      res.send(rows);
  });
});

app.post('/selectWorkTodo', (req, res) => {
  console.log(req.body);
  console.log(">>>>>>>>>>>>>>>")
  if(req.body.worker=='/'){
    req.body.worker=req.session.name;
  }
  connection.query(`SELECT * from worktodo where bang=? and year=? and month=? and date=? and worker=?`, [req.body.bang, req.body.year, req.body.month, req.body.date, req.body.worker] , (error, rows) => {
    if (error) throw error;
    console.log('Todo List is: ', rows);
      //res.cookie('token',rows.id);
      res.send(rows);
  });
});
app.post('/addWorkTodo', (req, res) => {
  let todo1={}, todo2='';
  console.log(req.body);
  console.log(">>>>>>>>>>>>>>>")
  connection.query(`SELECT * from worktodo where bang=? and year=? and month=? and date=? and worker=?`, [req.body.bang, req.body.year, req.body.month, req.body.date, req.body.worker] , (error, rows) => {
    console.log(">>>>>>>>>>>>>>>2")
    if(rows.length == 0){
      console.log(">>>>>>>>>>>>>>>3")
      req.body.todo = `{"${req.body.todo}":0}`      
      connection.query('insert into worktodo set ?',req.body ,function(err,result){
        console.log(">>>>>>>>>>>>>>>4",err,result)
        res.json({result : 'success'});
      });
    }
    else{
      console.log(">>>>>>>>>>>>>>>5")
      if(rows[0].todo!='{}'){
        todo1 = JSON.parse(rows[0].todo);
      }
      todo1[req.body.todo]=0;
      todo2 = JSON.stringify(todo1);
      console.log(todo2);
      connection.query('UPDATE worktodo SET todo=? WHERE bang=? and year=? and month=? and date=? and worker=?', [todo2, req.body.bang, req.body.year, req.body.month, req.body.date, req.body.worker] ,function(err,result){
        console.log(">>>>>>>>>>>>>>>6")
        res.json({result : 'success'});
      });
    }
  });
 
});

app.post('/addWorkTodoCheck', (req, res) => {
  let todo = JSON.stringify(req.body.todo)
  connection.query('UPDATE worktodo SET todo=? WHERE bang=? and year=? and month=? and date=? and worker=?', [todo, req.body.bang, req.body.year, req.body.month, req.body.date, req.session.name] ,function(err,result){
    console.log(err, result)
  });
});

app.post('/deleteWorkTodo', (req, res) => {
  let todo1={}, todo2='';
  console.log(req.body);
  console.log(">>>>>>>>>>>>>>>")
  connection.query(`SELECT * from worktodo where bang=? and year=? and month=? and date=? and worker=?`, [req.body.bang, req.body.year, req.body.month, req.body.date, req.body.worker] , (error, rows) => {
      todo1 = JSON.parse(rows[0].todo);
      console.log(req.body.key);
      delete todo1[req.body.key];
      todo2 = JSON.stringify(todo1);
      console.log(todo2);
      connection.query('UPDATE worktodo SET todo=? WHERE bang=? and year=? and month=? and date=? and worker=?', [todo2, req.body.bang, req.body.year, req.body.month, req.body.date, req.body.worker] ,function(err,result){
        console.log(">>>>>>>>>>>>>>>6")
        res.json({result : 'success'});
      });
  });
 
});
app.post('/selectSign', (req, res) => {
  let r;
  connection.query(`SELECT * from users where id=?`, [req.session.name] , (error, rows) => {
    console.log(error, rows)
    res.send(rows)
  });
});
app.post('/selectWorkerAsDay', (req, res) => {
  let r;
  connection.query(`SELECT * from worker where business=? and ${req.body.day} IS NOT NULL`, [req.body.business] , (error, rows) => {
    if (error) throw error;
    console.log('===========================================', rows);
      //res.cookie('token',rows.id);
      r = rows;
  });
  console.log(req.body);
  connection.query(`SELECT * from overtimework where business=? and day=? and month=? and date=? and year=?`, [req.body.business, req.body.day, req.body.month, req.body.date, req.body.year] , (error, rows) => {
    if (error) throw error;
    console.log('...........................................', rows[0]);
    //res.cookie('token',rows.id);
      let n=r.length
      if(n==0){
        for(let j=0 ; j<rows.length ; j++){
          r.push(rows[j]);
        }
      }
      else{
        for(let j=0 ; j<rows.length ; j++){
          let flag=0;
          for(let i=0 ; i<n ; i++){
            console.log(r);
            console.log("...");
            if(rows[j]!=null){
              if(r[i].workername == rows[j].workername){
                flag=1;
                console.log('여기있어요!!!');
                if(rows[j].time=='0'){
                  console.log(r);
                  console.log(i+"////");
                  r.splice(i,1);
                  console.log(r);
                  console.log("/////")
                  rows[j]=null;
                }
                else{
                  r[i] = rows[j];
                  rows[j] = null;
                }
                break;
              }
            }
        }
        if(flag==0){
          r.push(rows[j]);
        }
      }
    }
      
    console.log('========================');
    res.send(r);
  });
  
});

/*app.post('/uploadContractform',upload.any(), (req, res) => {
  console.log("왜왜?");


  console.log(req.files);
});*/
app.post('/uploadContractform', upload.any(), handleUpload);

app.post('/uploadSign', upload.any(), handleUpload);
https.createServer(options, app).listen(3000);
/*
let server = app.listen(app.get('port'), () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log('running at http://' + host + ':' + port)
})*/
