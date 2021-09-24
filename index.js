const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const dbconfig = require('./db/database.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');

const multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const business_id = req.body.business_id
    const path = (business_id) ? `uploads/${business_id}/` : 'uploads/undefined/'
    fs.mkdirSync(path, { recursive: true })
    cb(null, path) // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
  }
})
const upload = multer({ storage: storage })

const cors = require("cors");
const https = require('https');
const path = require('path');
const crypto = require('crypto');
const connection = mysql.createConnection(dbconfig);
const app = express();

// const options = {
// key: fs.readFileSync('/opt/bitnami/apache2/conf/www.toojin.cf.key'),
// cert: fs.readFileSync('/opt/bitnami/apache2/conf/www.toojin.cf.crt')

// };
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'asdf123',
  resave: false,
  saveUninitialized: true,
}));

const handleUpload = (req, res, next) => {
  console.log("???");
  console.log(JSON.parse(req.body.body).file);
  // The file shows up on req.body instead of req.file, per multer docs.
  const { file } = req.body;

  // File is written, but it's not a readable PDF.
  const tmp = fs.writeFile(
    path.join(__dirname, 'stamp/' + JSON.parse(req.body.body).bname + '.png'),
    JSON.parse(req.body.body).file, 'base64', (err) => { if (err) { throw err } else { res.send('success') } }
  );
}
app.use(express.static('public'));
app.use(express.static('stamp'));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
// configuration =========================
app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.send(`
  <!DOCTYPE html>
<html>
<body>
    <form action="upload" method="POST" enctype="multipart/form-data">
        <input type=file name=userfile />
        <input type=text name="business_id" value="test" />
        <input type="submit" />
    </form>
</body>
</html>
  `)
  // res.send('Root');
});


app.get('/privacy', (req, res) => {
  try {
    res.send(fs.readFileSync('./privacy.txt', 'utf8'))
  } catch (e) {
    console.error(e)
  }
});

app.post('/upload', upload.single('userfile'), (req, res) => {
  console.log(req.file);
  res.json(req.file);
});
app.use('/download', express.static('uploads'));

app.post('/log/download', (req, res) => {
  console.log(fs.readdirSync(`uploads/${req.body.business_id}/`))
  fs.mkdirSync(`uploads/${req.body.business_id}/`, { recursive: true })
  res.json({ file: fs.readdirSync(`uploads/${req.body.business_id}/`) });
});
app.post('/delete', (req, res) => {
  const path = `uploads/${req.body.business_id}/${req.body.file}`
  try {
    fs.unlinkSync(path)
    console.log(fs.readdirSync(`uploads/${req.body.business_id}/`))
    res.json({ file: fs.readdirSync(`uploads/${req.body.business_id}/`) });
    //file removed
  } catch (err) {
    console.error(err)
  }
});




app.post('/signup', (req, res) => {

  crypto.randomBytes(64, (err, buf) => {
    crypto.pbkdf2(req.body.password, buf.toString('base64'), 123583, 64, 'sha512', (err, key) => {
      req.body['salt'] = buf.toString('base64');
      req.body['password'] = key.toString('base64');
      connection.query('insert into users set ?', req.body, function (err, result) {
        res.json({ result: result, err: err });
      });

    });
  })
});

app.post('/signupByCode', (req, res) => {
  crypto.randomBytes(64, (err, buf) => {
    crypto.pbkdf2(req.body.password, buf.toString('base64'), 123583, 64, 'sha512', (err, key) => {
      req.body['salt'] = buf.toString('base64');
      req.body['password'] = key.toString('base64');
      connection.query('insert into users set ?', req.body, function (err, result) {
        res.json({ result: result, err: err });
      });
    });
  })
});

app.post('/signin', (req, res) => {
  console.log("hello1");
  connection.query('SELECT * from users where BINARY id=?', [req.body.id], (error, rows) => {
    if (rows[0]) {
      crypto.pbkdf2(req.body.password, rows[0].salt, 123583, 64, 'sha512', (err, key) => {
        console.log("hello2");
        if (rows[0].password == key.toString('base64')) {
          res.send(rows);
        }
        else {
          res.send();
        }
      });
    }
    else {
      res.send();
      console.log("hello3");
    }
  })
});

app.post('/signinByCode', (req, res) => {
  connection.query('SELECT * from users where BINARY code=?', [req.body.code], (error, rows) => {
    if (rows[0]) {
      crypto.pbkdf2(req.body.code, rows[0].salt, 123583, 64, 'sha512', (err, key) => {
        if (rows[0].password == key.toString('base64')) {
          res.send(rows);
        }
        else {
          res.send();
        }
      });
    }
    else {
      res.send();
    }
  })
});

app.post('/changePassword', (req, res) => {
  crypto.randomBytes(64, (err, buf) => {
    crypto.pbkdf2(req.body.password, buf.toString('base64'), 123583, 64, 'sha512', (err, key) => {
      let salt = buf.toString('base64');
      req.body['password'] = key.toString('base64');
      connection.query('UPDATE users SET password=?, salt=? WHERE id=?', [req.body.password, salt, req.body.id], function (err, result) {
        res.json({ result: 'success' });
      });
    });

  })
});
app.post('/changeSign', (req, res) => {
  connection.query('UPDATE users SET sign=? WHERE id=?', [req.body.sign, req.body.id], function (err, result) {
    res.json({ result: 'success' });
  });
});

app.post('/changeApple', (req, res) => {
  connection.query('UPDATE users SET sign=?, email=?, name=? WHERE id=?', [req.body.sign, req.body.email, req.body.name, req.body.id], function (err, result) {
    res.json({ result: 'success' });
  });
});

app.post('/changeName', (req, res) => {
  connection.query('UPDATE users SET name=? WHERE id=?', [req.body.name, req.body.id], function (err, result) {
    connection.query('UPDATE worker SET workername2=? WHERE workername=?', [req.body.name, req.body.id], function (err, result) {

      res.json({ result: 'success' });
    });
  });
});
app.post('/addBusiness', (req, res) => {
  console.log(req.body)
  connection.query('insert into business set ?', req.body, function (err, result) {
    console.log(err);
    res.json({ err: err, result: result });
  });
});
app.post('/writeContractform', (req, res) => {
  //console.log(req.body);
  if (req.body.types1) {
    req.body.types1 = JSON.stringify(req.body.types1);
    req.body.types2 = JSON.stringify(req.body.types2);
    req.body.types3 = JSON.stringify(req.body.types3);
    req.body.types4 = JSON.stringify(req.body.types4);
    req.body.value4 = JSON.stringify(req.body.value4);
  }
  console.log(req.body.types1, req.body.types2, req.body.types3, req.body.types4);
  if (req.body.id == '/') {
    req.body.id = req.session.name
  }
  console.log(req.body)
  //req.body.id = req.session.name;
  connection.query('insert into contractform set ?', req.body, function (err, result) {
    console.log(err);
    res.json({ result: 'success' });
  });
});

app.post('/writeContractform2', (req, res) => {
  if (req.body.types1) {
    req.body.types1 = JSON.stringify(req.body.types1);
    req.body.types2 = JSON.stringify(req.body.types2);
    req.body.types3 = JSON.stringify(req.body.types3);
  }
  if (req.body.id == '/') {
    req.body.id = req.session.name
  }
  console.log(req.body)
  connection.query('insert into contractform2 set ?', req.body, function (err, result) {
    console.log(err);
    res.json({ result: 'success' });
  });
});
app.post('/selectContractform2', (req, res) => {

  console.log(req.body);

  let id = '';

  if (req.body.id) {

    id = req.body.id

  }

  else {

    id = req.session.name

  }

  console.log(id, req.body.bang)

  connection.query('SELECT * from contractform2 where id=? and bang=?', [id, req.body.bang], (error, rows) => {
    console.log(error);
    if (error) throw error;

    console.log(rows);

    res.send(rows);

  });

});

app.post('/selectContractformAll', (req, res) => {

  connection.query('SELECT * from contractform where bang=?', [req.body.bang], (error, rows) => {
    console.log(req.body.id + " " + error);
    console.log('selectContractformAll is: ', rows);
    res.send(rows);
  });
});






app.post('/alterState', (req, res) => {
  console.log(req.body)
  if (req.body.id == '/') {
    req.body.id = req.session.name
  }
  //req.body.id = req.session.name;
  connection.query('UPDATE worker SET state=?, pay=?, mon=?, tue=?, wed=?, thu=?, fri=?, sat=?, sun=?, eachtime=?, startdate=?, enddate=? WHERE business=? and workername=?', [req.body.type, req.body.pay, req.body.mon, req.body.tue, req.body.wed, req.body.thu, req.body.fri, req.body.sat, req.body.sun, req.body.eachtime, req.body.startdate, req.body.enddate, req.body.bang, req.body.id], function (err, result) {


    console.log(err);
    res.json({ result: 'success' });
  });
});

//=====================================================================================//////////
app.post('/updateContractform', (req, res) => {
  console.log(req.body)
  //req.body.id = req.session.name;
  connection.query('UPDATE contractform SET EmployeeAddress=?, EmployeePhone=?, EmployeeName=?, type=? WHERE Employer=? and Employee=?', [req.body.EmployeeAddress, req.body.EmployeePhone, req.body.EmployeeName, req.body.type, req.body.Employer, req.body.Employee], function (err, result) {
    console.log(err);
    res.json({ result: 'success' });
  });
});
app.post('/updateContractform2', (req, res) => {
  console.log(req.body.type)
  connection.query('UPDATE contractform2 SET EmployeeAddress=?, EmployeePhone=?, EmployeeName=?, type=? WHERE bang=? and id=?', [req.body.EmployeeAddress, req.body.EmployeePhone, req.body.EmployeeName, req.body.type, req.body.bang, req.body.id], function (err, result) {
    console.log(err);
    res.json({ result: 'success' });
  });
});
app.post('/selectContractform', (req, res) => {
  console.log(req.body);
  let id = '';
  if (req.body.id) {
    id = req.body.id
  }
  else {
    id = req.session.name
  }
  console.log(id, req.body.bang)
  connection.query('SELECT * from contractform where id=? and bang=?', [id, req.body.bang], (error, rows) => {
    if (error) throw error;
    console.log(error);
    res.send(rows);
  });
});
// otherAllowance
app.post('/selectReceivedMessage', (req, res) => {

  connection.query('SELECT * from message where t=? and ft=0', [req.body.t], (error, rows) => {
    console.log(error);
    res.send(rows);
  });
});

app.post('/delMessage', (req, res) => {
  console.log(req.body.ind);
  connection.query('DELETE from message where ind=?', [req.body.ind], (error, rows) => {
    res.send({ result: 'success' });
    //console.log(error, rows);
  });
});
app.post('/delBusiness', (req, res) => {
  console.log(req.body.bang);
  connection.query('DELETE from business where bname=?', [req.body.bang], (error, rows) => {
    connection.query('DELETE from contractform where bang=?', [req.body.bang], (error, rows) => {
      connection.query('DELETE from contractform2 where bang=?', [req.body.bang], (error, rows) => {
        connection.query('DELETE from overtimework where business=?', [req.body.bang], (error, rows) => {
          connection.query('DELETE from timelog where bang=?', [req.body.bang], (error, rows) => {
            connection.query('DELETE from worktodo where bang=?', [req.body.bang], (error, rows) => {
              connection.query('SELECT * from worker where business=?', [req.body.bang], (error, rows) => {
                for (let i = 0; i < rows.length; i++) {
                  console.log(rows[i].workername)
                  connection.query('SELECT * from users where id=?', [rows[i].workername], (error, rows2) => {
                    console.log(rows2[0].bang);
                    let bangs = JSON.parse(rows2[0].bang);
                    delete bangs[req.body.bang];
                    console.log(bangs);
                    bangs = JSON.stringify(bangs);
                    connection.query('UPDATE users SET bang=? WHERE id=?', [bangs, rows[i].workername], function (err, result) {
                      console.log(err)
                    });

                  });
                }

                connection.query('DELETE from worker where business=?', [req.body.bang], (error, rows) => {
                  console.log("hehehehe");
                  res.send({ result: 'success' });
                });
              });
            });
          });
        });

      });
    });
  });
});

app.post('/selectReceivedNewMessage', (req, res) => {
  console.log(req.body.t);
  connection.query('SELECT * from message where t=? and r=0 and ft=0', [req.body.t], (error, rows) => {
    //console.log(rows);
    res.send(rows);
  });
});

app.post('/addBang', (req, res) => {
  connection.query('SELECT * from users where id=?', [req.body.id], (error, rows) => {
    console.log(error);
    let b = JSON.parse(rows[0].bang);
    console.log(req.body);
    b[req.body.bang] = 1;
    console.log(b)
    let bang = JSON.stringify(b);

    console.log("????", bang, req.body.id);
    connection.query('UPDATE users SET bang=? WHERE id=?', [bang, req.body.id], function (err, result) {
      console.log(err);
      res.json({ result: 'success' });
    });
  });
});

app.post('/selectSentMessage', (req, res) => {

  connection.query('SELECT * from message where f=? and ft=1', [req.body.id], (error, rows) => {
    console.log(error);

    res.send(rows);
  });
});
app.post('/sendMessage', (req, res) => {
  // console.log(req);
  if (req.body.system == 1 && req.body.type != 3) {
    req.body['message'] = req.body.f + req.body['message'];
  }

  connection.query('select * from users where id = ?', [req.body.f], function (err, f_result) {
    console.error(err); 

    // console.log(f_result);
    req.body.f_name = f_result[0].name;
    connection.query('select * from users where id = ?', [req.body.t], function (err, t_result) {
      console.error(err); 
      req.body.t_name = t_result[0].name;

      req.body['ft'] = 0;
      // console.log(req.body);
      connection.query('insert into message set ?', req.body, function (err, result) {
        req.body['ft'] = 1;
        console.error(err); 
        connection.query('insert into message set ?', req.body, function (err, result) {
          console.error(err); 
          res.json({ result: 'success' });
        });
      });
    })
  })

  // req.body['ft'] = 0;
  // console.log(req.body);
  // connection.query('insert into message set ?', req.body ,function(err,result){
  // req.body['ft'] = 1;
  // connection.query('insert into message set ?', req.body ,function(err,result){
  //  		console.log(err); 
  //   	res.json({result : 'success'});
  // }); 
  // });
});

app.post('/alterReadMessage', (req, res) => {
  connection.query('UPDATE message SET r=1 WHERE ind=?', [req.body.ind], function (err, result) {
    console.log(req.body.ind);
    console.log(err, result); res.send(result);
  });
});

app.post('/updateCommute', (req, res) => {

  connection.query('SELECT bang from users where id=?', [req.body.id], (error, rows) => {
    console.log(error); console.log(rows);
    let row = JSON.parse(rows[0].bang);
    row[req.body.bang] = row[req.body.bang] == 1 ? 0 : 1;
    console.log(JSON.stringify(row) + " " + req.session.name + "3");
    connection.query('UPDATE users SET bang=? WHERE id=?', [JSON.stringify(row), req.body.id], function (err, result) {
      //res.json({result : 'success'});
    });
    console.log(req.session.name + "2");
    let h = (String(new Date().getHours()) < 10 ? '0' + String(new Date().getHours()) : String(new Date().getHours()));
    let m = (String(new Date().getMinutes()) < 10 ? '0' + String(new Date().getMinutes()) : String(new Date().getMinutes()));

    console.log(h, m, req.session.name, new Date().getDate())

    if (row[req.body.bang] == 0) {
      connection.query('select * from timelog where bang=? and workername=? and year=? and month=? and date=?', [req.body.bang, req.body.id, new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()], (err, rows) => {
        console.log(err);
        if (rows.length == 0) {
          console.log("11111");
          connection.query('insert into timelog set ?', { bang: req.body.bang, workername: req.body.id, year: new Date().getFullYear(), month: new Date().getMonth() + 1, date: new Date().getDate(), goto: h + m }, function (err, row) {
            console.log(err); res.json({ result: 'b' });
          });
        }
        else {
          console.log("2222");
          connection.query('UPDATE timelog SET goto=? WHERE bang=? and workername=? and year=? and month=? and date=? and leavee=?', [(h + m), req.body.bang, req.body.id, (new Date().getFullYear()), (new Date().getMonth() + 1), new Date().getDate(), rows[0].leavee], function (err, result) {
            console.log(err, result); res.json({ result: 'b' });
          });
        }
      });
    }
    else {
      connection.query('select * from timelog where bang=? and workername=? and year=? and month=? and date=?', [req.body.bang, req.body.id, new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()], (err, rows) => {
        console.log(err);
        if (rows.length == 0) {
          console.log("11111");
          connection.query('insert into timelog set ?', { bang: req.body.bang, workername: req.body.id, year: new Date().getFullYear(), month: new Date().getMonth() + 1, date: new Date().getDate(), leavee: h + m }, function (err, row) {
            console.log(err); res.json({ result: 'a' });
          });
        }
        else {
          console.log("2222");
          connection.query('UPDATE timelog SET leavee=? WHERE bang=? and workername=? and year=? and month=? and date=? and goto=?', [(h + m), req.body.bang, req.body.id, (new Date().getFullYear()), (new Date().getMonth() + 1), new Date().getDate(), rows[0].goto], function (err, result) {
            console.log(err, result); res.json({ result: 'a' })
          });
        }
      });
    }


  });
});


app.post('/', (req, res) => {


});
app.post('/searchId', (req, res) => {
  connection.query('SELECT * from users where name like ?', '%' + req.body.name + '%', (error, rows) => {
    res.send(rows);
  });
});
app.post('/selectUsername', (req, res) => {
  connection.query('SELECT * from users where id=?', [req.body.id], (error, rows) => {
    res.send(rows);
  });
});


app.post('/addWorker', (req, res) => {
  console.log()
  connection.query('insert into worker set ?', req.body, function (err, result) {
    console.log(err, result)
    res.json({ result: 'success' });
  });
});

app.post('/addWork', (req, res) => {
  console.log(req.body)
  console.log("dd")
  connection.query(`SELECT * from overtimework where business=? and day=? and month=? and date=? and year=? and workername=?`, [req.body.business, req.body.day, req.body.month, req.body.date, req.body.year, req.body.workername], (error, rows) => {
    console.log(error);
    if (rows.length == 0) {
      connection.query('insert into overtimework set ?', req.body, function (err, result) {
        console.log("a");
        res.json({ result: 'success' });
      });
    }
    else {
      console.log(req.body.subt);
      connection.query('UPDATE overtimework SET time=?, subt=? WHERE business=? and day=? and month=? and date=? and year=? and workername=?', [req.body.time, req.body.subt, req.body.business, req.body.day, req.body.month, req.body.date, req.body.year, req.body.workername], function (err, result) {
        console.log(err, result);
        res.json({ result: 'success' });
      });
    }
  });
});
app.post('/updateBusiness', (req, res) => {
  console.log(req.body);
  connection.query('UPDATE business SET bnumber=?, name=?, bphone=?, baddress=?, stamp=?, fivep=? WHERE id=? and bname=?', [req.body.bnumber, req.body.name, req.body.bphone, req.body.baddress, req.body.stamp, req.body.fivep, req.body.id, req.body.bname], function (err, result) {
    console.log(err, result);
    res.json({ result: 'success' });
  });
})
app.post('/selectBusiness', (req, res) => {
  connection.query('SELECT * from business where id=?', [req.body.id], (error, rows) => {
    console.log(error);
    //console.log('User info is: ', rows);
    //res.cookie('token',rows.id);
    res.send(rows);
  });
});
app.post('/selectBusinessByName', (req, res) => {

  connection.query('SELECT * from business where bname=?', [req.body.bname], (error, rows) => {
    console.log(req.body.bname + " " + error);
    console.log('User info is: ', rows);
    res.send(rows);
  });
});
app.post('/selectWorkerByType', (req, res) => {
  console.log(req.body.business + " + " + req.body.type);
  connection.query('SELECT * from worker where business=? and type=?', [req.body.business, req.body.type], (error, rows) => {
    console.log(error);
    console.log('worker info is: ', rows);
    //res.cookie('token',rows.id);
    res.send(rows);
  });
});


//Allowance

app.post('/otherAllowanceAll', (req, res) => {

  connection.query('SELECT * from otherAllowance where bang=? and year=? and month=?', [req.body.bang, req.body.year, req.body.month], (error, rows) => {
    console.log(req.body.id + " " + error);
    console.log('otherAllowanceAll is: ', rows);
    res.send(rows);
  });
});


app.post('/otherAllowance', (req, res) => {

  connection.query('SELECT * from otherAllowance where id=? and year=? and month=?', [req.body.id, req.body.year, req.body.month], (error, rows) => {
    console.log(req.body.id + " " + error);
    console.log('otherAllowance is: ', rows);
    res.send(rows);
  });
});

app.post('/AdditionalAllowance', (req, res) => {

  connection.query('SELECT * from otherAllowance where bang=?', [req.body.bang], (error, rows) => {
    console.log(req.body.id + " " + error);
    console.log('AdditionalAllowance is: ', rows);
    res.send(rows);
  });
});

app.post('/insertAllowance', (req, res) => {
  connection.query(`SELECT * FROM otherAllowance where bang=? and id=? and year=? and month=?;`,
    [req.body.bang, req.body.id, req.body.year, req.body.month], (error, rows) => {
      console.log(error);
      if (rows.length == 0) {
        connection.query('insert into otherAllowance set ?', req.body, function (err, result) {
          console.log("insertAllowance");
          res.json({ result: 'success' });
        });
      } else {
        connection.query('update otherAllowance set t_bonus= t_bonus + ?, t_extension= t_extension + ?, t_position= t_position + ?, t_etc= t_etc + ?, f_carMaintenanceFee= f_carMaintenanceFee + ?, f_childcareAllowance= f_childcareAllowance + ?, f_meals= f_meals + ? where bang=? and id=? and year=? and month=?;',
          [req.body.t_bonus, req.body.t_extension, req.body.t_position, req.body.t_etc, req.body.f_carMaintenanceFee, req.body.f_childcareAllowance, req.body.f_meals,
          req.body.bang, req.body.id, req.body.year, req.body.month],
          function (err, result) {
            console.log("updateAllowance");
            res.json({ result: 'success' });
          });
      }
    })





});




//insurancePercentage
app.post('/insurancePercentage', (req, res) => {
  const business_id = req.body.bang;
  connection.query('SELECT * from insurancePercentage ORDER BY date desc', [], (error, rows) => {
    res.send(rows);
  });
});

app.post('/insurancePercentageYear', (req, res) => {
  const business_id = req.body.bang;
  connection.query('SELECT * from insurancePercentage where date=? ', [req.body.date], (error, rows) => {
    res.send(rows);
  });
});

app.post('/selectWorker', (req, res) => {
  connection.query('SELECT * from worker where state=2 and business=?', [req.body.business], (error, rows) => {
    console.log(error);
    console.log('worker info is: ', rows);
    //res.cookie('token',rows.id);
    res.send(rows);
  });
});
app.post('/selectWorkerEach', (req, res) => {
  let workername = '';
  if (req.body.workername) {
    workername = req.body.workername;
  }
  else {
    workername = req.session.name;
  }
  connection.query('SELECT * from worker where business=? and workername2=?', [req.body.business, workername], (error, rows) => {
    console.log(error);
    console.log('worker info is: ', rows);
    //res.cookie('token',rows.id);
    res.send(rows);
  });
});

app.post('/businessWorker', (req, res) => {
  let workername = '';
  if (req.body.workername) {
    workername = req.body.workername;
  }
  else {
    workername = req.session.name;
  }
  connection.query('SELECT * from worker where business=? and workername=?', [req.body.business, workername], (error, rows) => {
    console.log(error);
    console.log('worker info is: ', rows);
    //res.cookie('token',rows.id);
    res.send(rows);
  });
});

app.post('/selectBusinessByWorker', (req, res) => {
  connection.query('SELECT * from users where id=?', [req.body.id], (error, rows) => {
    console.log(error);
    if (error) throw error;
    console.log('worker info is: ', rows);
    //res.cookie('token',rows.id);
    res.send(rows);
  });
});
app.post('/deletedWorker', (req, res) => {
  connection.query('SELECT * from retireWorker where business_id=?', [req.body.business_id], (error, rows) => {
    console.log('deletedWorker info is: ', rows);
    res.send(rows);
  });
})
app.post('/deleteWorker', (req, res) => {
  connection.query('SELECT * from users where id=?', [req.body.workername], (error, rows) => {

    let bangs = JSON.parse(rows[0].bang);
    delete bangs[req.body.business];
    console.log(bangs);
    bangs = JSON.stringify(bangs);
    connection.query('UPDATE users SET bang=? WHERE id=?', [bangs, req.body.workername], function (err, result) {
      console.log(err)
    });
  });

  let sql = `INSERT INTO retireWorker (business_id, user_id, year, month, date, reason) VALUES (?, ?, ?, ?, ?, ?)`
  const business_id = (req.body.business_id) ? req.body.business_id : req.body.business;
  const user_id = (req.body.user_id) ? req.body.user_id : req.body.workername;
  const year = (req.body.year) ? req.body.year : new Date().getFullYear();
  const month = (req.body.month) ? req.body.month : new Date().getMonth() + 1;
  const date = (req.body.date) ? req.body.date : new Date().getDate();
  const reason = (req.body.reason) ? req.body.reason : '';

  connection.query(
    sql,
    [business_id, user_id, year, month, date, reason],
    (error, rows) => {
    });

  connection.query(`SELECT * from worker where business=? and workername=?`, [req.body.business, req.body.workername], (error, rows) => {
    connection.query('UPDATE worker SET workState=? WHERE business=? and workername=?', [1, req.body.business, req.body.workername], function (err, result) {
      console.log(err)
      res.json({ result: 'success' });
    });
  });


  // 근로자 삭제해도 정보는 삭제안되게.
  // connection.query(`SELECT * from worker where business=? and workername=?`, [req.body.business, req.body.workername] , (error, rows) => {
  // if(rows[0].type==2){
  // 	connection.query('DELETE from contractform where bang=? and id=?', [req.body.business, req.body.workername] , (error, rows) => {}
  // 	)}else{
  // 	connection.query('DELETE from contractform2 where bang=? and id=?', [req.body.business, req.body.workername] , (error, rows) => {}
  // 	)}
  // });

  // connection.query('DELETE from worker where business=? and workername=?', [req.body.business, req.body.workername] , (error, rows) => {
  // 	connection.query('DELETE from overtimework where business=? and workername=?', [req.body.business, req.body.workername] , (error, rows) => {
  // 	console.log("error : "+error); 
  // 	});
  // });

  // connection.query('DELETE from timelog where bang=? and workername=?', [req.body.business, req.body.workername] , (error, rows) => {
  // 	console.log("error : "+error);
  // });

  // connection.query('DELETE from worktodo where bang=? and worker=?', [req.body.business, req.body.workername] , (error, rows) => {
  // 		console.log("error : "+error);
  // 		res.send(rows);
  // });

});


app.post('/selectImg', (req, res) => {

  console.log(__dirname);
  res.send('<img src="./public/11.jpg"/>');
});

app.post('/selectOvertimework', (req, res) => {
  console.log(req.body);
  connection.query(`SELECT * from overtimework where business=? and year=? and month=?`, [req.body.business, req.body.year, req.body.month], (error, rows) => {
    console.log(error)
    console.log('+++++++++++++++++++++++++ ', rows);
    //res.cookie('token',rows.id);
    res.send(rows);
  });
});

app.post('/selectTimelog', (req, res) => {
  console.log(req.body);
  console.log(">>>>>>>>>>>>>>>")
  connection.query(`SELECT * from timelog where bang=? and year=? and month=? and date=?`, [req.body.bang, req.body.year, req.body.month, req.body.date], (error, rows) => {
    console.log(error);
    console.log('worker info is: ', rows);
    //res.cookie('token',rows.id);
    res.send(rows);
  });
});

app.post('/selectTimelogAsWorker', (req, res) => {
  connection.query(`SELECT * from timelog where bang=? and workername=? and year=? and month=? and date=?`, [req.body.bang, req.body.workername, req.body.year, req.body.month, req.body.date], (error, rows) => {
    res.send(rows);
  });
});

app.post('/selectWorkTodo', (req, res) => {
  console.log(req.body);
  connection.query(`SELECT * from worktodo where bang=? and year=? and month=? and date=? and worker=?`, [req.body.bang, req.body.year, req.body.month, req.body.date, req.body.worker], (error, rows) => {
    console.log(error);
    console.log('Todo List is: ', rows);
    console.log(rows);
    //res.cookie('token',rows.id);
    res.send(rows);
  });
});
app.post('/addWorkTodo', (req, res) => {
  let todo1 = {}, todo2 = '';
  console.log(req.body);
  console.log(">>>>>>>>>>>>>>>")
  connection.query(`SELECT * from worktodo where bang=? and year=? and month=? and date=? and worker=?`, [req.body.bang, req.body.year, req.body.month, req.body.date, req.body.worker], (error, rows) => {
    console.log(error);
    console.log(">>>>>>>>>>>>>>>2")
    if (rows.length == 0) {
      console.log(">>>>>>>>>>>>>>>3")
      req.body.todo = `{"${req.body.todo}":0}`
      connection.query('insert into worktodo set ?', req.body, function (err, result) {
        console.log(">>>>>>>>>>>>>>>4", err, result)
        res.json({ result: 'success' });
      });
    }
    else {
      console.log(">>>>>>>>>>>>>>>5")
      if (rows[0].todo != '{}') {
        todo1 = JSON.parse(rows[0].todo);
      }
      todo1[req.body.todo] = 0;
      todo2 = JSON.stringify(todo1);
      console.log(todo2);
      connection.query('UPDATE worktodo SET todo=? WHERE bang=? and year=? and month=? and date=? and worker=?', [todo2, req.body.bang, req.body.year, req.body.month, req.body.date, req.body.worker], function (err, result) {
        console.log(err)
        res.json({ result: 'success' });
      });
    }
  });

});

app.post('/addWorkTodoCheck', (req, res) => {
  let todo = JSON.stringify(req.body.todo)
  let worker;
  console.log(req.body);
  connection.query('UPDATE worktodo SET todo=? WHERE bang=? and year=? and month=? and date=? and worker=?', [todo, req.body.bang, req.body.year, req.body.month, req.body.date, req.body.id], function (err, result) {
    console.log(err, result)
    res.send(result);
  });
});

app.post('/deleteWorkTodo', (req, res) => {
  let todo1 = {}, todo2 = '';
  console.log(req.body);
  console.log(">>>>>>>>>>>>>>>")
  connection.query(`SELECT * from worktodo where bang=? and year=? and month=? and date=? and worker=?`, [req.body.bang, req.body.year, req.body.month, req.body.date, req.body.worker], (error, rows) => {
    console.log(error);
    todo1 = JSON.parse(rows[0].todo);
    console.log(req.body.key);
    delete todo1[req.body.key];
    todo2 = JSON.stringify(todo1);
    console.log(todo2);
    connection.query('UPDATE worktodo SET todo=? WHERE bang=? and year=? and month=? and date=? and worker=?', [todo2, req.body.bang, req.body.year, req.body.month, req.body.date, req.body.worker], function (err, result) {
      console.log(err)
      res.json({ result: 'success' });
    });
  });

});
app.post('/selectSign', (req, res) => {
  let r;
  console.log("id2:");
  console.log(req.body.id2);
  if (req.body.id == '/') {
    req.body.id = req.session.name;
  }
  connection.query(`SELECT * from users where id=?`, [req.body.id], (error, rows) => {
    connection.query(`SELECT * from users where id=?`, [req.body.id2], (error, rows2) => {
      rows.push(rows2[0]);
      console.log(error, rows)
      res.send(rows)
    });
  });
});
app.post('/selectWorkerAsDay', (req, res) => {
  let r, rr;
  connection.query(`SELECT * from worker where business=? and ${req.body.day} IS NOT NULL`, [req.body.business], (error, rows) => {
    console.log(error);
    if (error) throw error;
    console.log('===========================================', rows);
    //res.cookie('token',rows.id);
    r = rows;
  });
  console.log(req.body);
  connection.query(`SELECT * from overtimework where business=? and day=? and month=? and date=? and year=?`, [req.body.business, req.body.day, req.body.month, req.body.date, req.body.year], (error, rows) => {
    rr = rows;
    /*console.log(error); 
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
*/
    console.log('========================');
    res.send({ ori: r, alter: rr });
  });

});
app.post('/selectWorkerAsDayAsWorker', (req, res) => {
  let r, rr;
  connection.query(`SELECT * from worker where business=? and workername=? and ${req.body.day} IS NOT NULL`, [req.body.business, req.body.workername], (error, rows) => {
    if (error) throw error;
    console.log('===========================================', rows);
    //res.cookie('token',rows.id);
    r = rows;
  });
  console.log(req.body);
  connection.query(`SELECT * from overtimework where business=? and day=? and month=? and date=? and year=?`, [req.body.business, req.body.day, req.body.month, req.body.date, req.body.year], (error, rows) => {
    rr = rows;
    res.send({ ori: r, alter: rr });

  });
});

app.post('/otherAllowance', (req, res) => {
  connection.query('SELECT * from message otherAllowance bang=? and id=? and year=? and month=?', [req.body.bang, req.body.id, req.body.year, req.body.month], (error, rows) => {
    console.log(error);
    res.send(rows);
  });
});






// vacation

app.post('/selectVacation', (req, res) => {

  connection.query('SELECT * from vacation where bang=?', [req.body.bang], (error, rows) => {
    console.log(req.body.id + " " + error);
    console.log('selectVacation is: ', rows);
    res.send(rows);
  });
});

app.post('/insertVacation', (req, res) => {
  connection.query('insert into vacation set ?', req.body, (error, result) => {
    console.log(req.body.id + " " + error);
    res.json({ result: 'success' });
  });
});


app.post('/dateVacation', (req, res) => {

  connection.query('SELECT * from vacation where bang=? and end_date>=?', [req.body.bang, req.body.end_date], (error, rows) => {
    console.log(req.body.id + " " + error);
    console.log('dateVacation is: ', rows);
    res.send(rows);
  });
});














/*app.post('/uploadContractform',upload.any(), (req, res) => {
  console.log("왜왜?");
 
 
  console.log(req.files);
});*/
app.post('/uploadContractform', upload.any(), handleUpload);

app.post('/uploadStamp', upload.any(), handleUpload);
//https.createServer(options, app).listen(3000);

let server = app.listen(app.get('port'), () => {
  var host = server.address().address;
  var port = server.address().port;
  console.log('running at http://' + host + ':' + port)
})
