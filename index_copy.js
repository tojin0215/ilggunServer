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
    path.join(__dirname, 'stamp/'+JSON.parse(req.body.body).bname+'.png'),
    JSON.parse(req.body.body).file, 'base64', (err) => { if(err){ throw err} else {res.send('success')} }
  );
}
app.use(express.static('public'));
app.use(express.static('stamp'));
app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({limit:"50mb", extended:true}));
app.use(cookieParser());
app.use(cors({origin: true, credentials: true}));
// configuration =========================
app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.send('Root');
});


app.get('/privacy', (req, res) => {
	res.send(`
<투진컴퍼니>('https://www.kwonsoryeong.tk:3000'이하 '투진컴퍼니')은(는) 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.



		<투진컴퍼니>('투진컴퍼니') 은(는) 회사는 개인정보처리방침을 개정하는 경우 웹사이트 공지사항(또는 개별공지)을 통하여 공지할 것입니다.



		○ 본 방침은부터 2020년 1월 1일부터 시행됩니다.





		1. 개인정보의 처리 목적 <투진컴퍼니>('https://www.kwonsoryeong.tk:3000'이하 '투진컴퍼니')은(는) 개인정보를 다음의 목적을 위해 처리합니다. 처리한 개인정보는 다음의 목적이외의 용도로는 사용되지 않으며 이용 목적이 변경될 시에는 사전동의를 구할 예정입니다.



		가. 홈페이지 회원가입 및 관리



		회원 가입의사 확인, 회원자격 유지·관리, 고충처리, 분쟁 조정을 위한 기록 보존 등을 목적으로 개인정보를 처리합니다.





		나. 재화 또는 서비스 제공



		서비스 제공, 콘텐츠 제공, 본인인증 등을 목적으로 개인정보를 처리합니다.





		2. 개인정보 파일 현황



		1. 개인정보 파일명 : privacy

		개인정보 항목 : 이메일, 자택주소, 비밀번호, 로그인ID, 이름, 쿠키

		수집방법 : 서면양식

		보유근거 : 근무관리에 필요함

		보유기간 : 1년

		관련법령 : 소비자의 불만 또는 분쟁처리에 관한 기록 : 3년





		3. 개인정보의 처리 및 보유 기간



		① <투진컴퍼니>('투진컴퍼니')은(는) 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집시에 동의 받은 개인정보 보유,이용기간 내에서 개인정보를 처리,보유합니다.



		② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.



		1.<홈페이지 회원가입 및 관리>

		<홈페이지 회원가입 및 관리>와 관련한 개인정보는 수집.이용에 관한 동의일로부터<1년>까지 위 이용목적을 위하여 보유.이용됩니다.

		보유근거 : 근무관리에 필요함

		관련법령 : 소비자의 불만 또는 분쟁처리에 관한 기록 : 3년

		예외사유 :





		4. 개인정보의 제3자 제공에 관한 사항



		① <투진컴퍼니>('https://www.kwonsoryeong.tk:3000'이하 '투진컴퍼니')은(는) 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.



		② <투진컴퍼니>('https://www.kwonsoryeong.tk:3000')은(는) 다음과 같이 개인정보를 제3자에게 제공하고 있습니다.



		1. <>

		개인정보를 제공받는 자 :

		제공받는 자의 개인정보 이용목적 :

		제공받는 자의 보유.이용기간:





		5. 개인정보처리 위탁



		① <투진컴퍼니>('투진컴퍼니')은(는) 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.



		1. <>

		위탁받는 자 (수탁자) :

		위탁하는 업무의 내용 :

		위탁기간 :

		② <투진컴퍼니>('https://www.kwonsoryeong.tk:3000'이하 '투진컴퍼니')은(는) 위탁계약 체결시 개인정보 보호법 제25조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적․관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리․감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.



		③ 위탁업무의 내용이나 수탁자가 변경될 경우에는 지체없이 본 개인정보 처리방침을 통하여 공개하도록 하겠습니다.



		6. 정보주체와 법정대리인의 권리·의무 및 그 행사방법 이용자는 개인정보주체로써 다음과 같은 권리를 행사할 수 있습니다.



		① 정보주체는 투진컴퍼니에 대해 언제든지 개인정보 열람,정정,삭제,처리정지 요구 등의 권리를 행사할 수 있습니다.



		② 제1항에 따른 권리 행사는투진컴퍼니에 대해 개인정보 보호법 시행령 제41조제1항에 따라 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 투진컴퍼니은(는) 이에 대해 지체 없이 조치하겠습니다.



		③ 제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 이 경우 개인정보 보호법 시행규칙 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.



		④ 개인정보 열람 및 처리정지 요구는 개인정보보호법 제35조 제5항, 제37조 제2항에 의하여 정보주체의 권리가 제한 될 수 있습니다.



		⑤ 개인정보의 정정 및 삭제 요구는 다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있는 경우에는 그 삭제를 요구할 수 없습니다.



		⑥ 투진컴퍼니은(는) 정보주체 권리에 따른 열람의 요구, 정정·삭제의 요구, 처리정지의 요구 시 열람 등 요구를 한 자가 본인이거나 정당한 대리인인지를 확인합니다.







		7. 처리하는 개인정보의 항목 작성



		① <투진컴퍼니>('https://www.kwonsoryeong.tk:3000'이하 '투진컴퍼니')은(는) 다음의 개인정보 항목을 처리하고 있습니다.



		1<홈페이지 회원가입 및 관리>

		필수항목 : 이메일, 비밀번호, 로그인ID, 이름

		- 선택항목 :





		8. 개인정보의 파기<투진컴퍼니>('투진컴퍼니')은(는) 원칙적으로 개인정보 처리목적이 달성된 경우에는 지체없이 해당 개인정보를 파기합니다. 파기의 절차, 기한 및 방법은 다음과 같습니다.



		-파기절차

		이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져(종이의 경우 별도의 서류) 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다. 이 때, DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는 다른 목적으로 이용되지 않습니다.



		-파기기한

		이용자의 개인정보는 개인정보의 보유기간이 경과된 경우에는 보유기간의 종료일로부터 5일 이내에, 개인정보의 처리 목적 달성, 해당 서비스의 폐지, 사업의 종료 등 그 개인정보가 불필요하게 되었을 때에는 개인정보의 처리가 불필요한 것으로 인정되는 날로부터 5일 이내에 그 개인정보를 파기합니다.



		-파기방법



		전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다







		9. 개인정보 자동 수집 장치의 설치•운영 및 거부에 관한 사항



		① 투진컴퍼니 은 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 ‘쿠기(cookie)’를 사용합니다. ② 쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터 브라우저에게 보내는 소량의 정보이며 이용자들의 PC 컴퓨터내의 하드디스크에 저장되기도 합니다. 가. 쿠키의 사용 목적 : 이용자가 방문한 각 서비스와 웹 사이트들에 대한 방문 및 이용형태, 인기 검색어, 보안접속 여부, 등을 파악하여 이용자에게 최적화된 정보 제공을 위해 사용됩니다. 나. 쿠키의 설치•운영 및 거부 : 웹브라우저 상단의 도구>인터넷 옵션>개인정보 메뉴의 옵션 설정을 통해 쿠키 저장을 거부 할 수 있습니다. 다. 쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.



		10. 개인정보 보호책임자 작성



		① 투진컴퍼니(‘https://www.kwonsoryeong.tk:3000’이하 ‘투진컴퍼니) 은(는) 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.



		▶ 개인정보 보호책임자

		성명 :박재진

		직책 :대표

		직급 :대표

		연락처 :01083448684, mb8281@gmail.com,

		※ 개인정보 보호 담당부서로 연결됩니다.



		▶ 개인정보 보호 담당부서

		부서명 :개발팀

		담당자 :권소령

		연락처 :01039770370, poi9438@gmail.com,

		② 정보주체께서는 투진컴퍼니(‘https://www.kwonsoryeong.tk:3000’이하 ‘투진컴퍼니) 의 서비스(또는 사업)을 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. 투진컴퍼니(‘https://www.kwonsoryeong.tk:3000’이하 ‘투진컴퍼니) 은(는) 정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.



		11. 개인정보 처리방침 변경



		①이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.







		12. 개인정보의 안전성 확보 조치 <투진컴퍼니>('투진컴퍼니')은(는) 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를 하고 있습니다.



		1. 개인정보의 암호화

		이용자의 개인정보는 비밀번호는 암호화 되어 저장 및 관리되고 있어, 본인만이 알 수 있으며 중요한 데이터는 파일 및 전송 데이터를 암호화 하거나 파일 잠금 기능을 사용하는 등의 별도 보안기능을 사용하고 있습니다.
		
		`);

});






app.post('/signup', (req, res) => {
  
  crypto.randomBytes(64, (err, buf) => {
    crypto.pbkdf2(req.body.password, buf.toString('base64'), 123583, 64, 'sha512', (err, key) => {
	req.body['salt'] = buf.toString('base64');
        req.body['password']= key.toString('base64'); 
	connection.query('insert into users set ?', req.body ,function(err,result){
		res.json({result : result, err:err});
	    });

      });
  })
});

app.post('/signupByCode', (req, res) => {
  crypto.randomBytes(64, (err, buf) => {
    crypto.pbkdf2(req.body.password, buf.toString('base64'), 123583, 64, 'sha512',(err, key) => {
	req.body['salt'] = buf.toString('base64');
	req.body['password']= key.toString('base64'); 
	connection.query('insert into users set ?', req.body ,function(err,result){
		res.json({result : result, err:err});
	});
    });
  })
});

app.post('/signin', (req, res) => {
	console.log("hello1");
	connection.query('SELECT * from users where BINARY id=?', [req.body.id] , (error, rows) => {
	if(rows[0]){	
	crypto.pbkdf2(req.body.password, rows[0].salt, 123583, 64, 'sha512', (err, key) => {
		console.log("hello2");
		if(rows[0].password == key.toString('base64')){
			res.send(rows);
		}
		else{
			res.send();
		}
	});}
	else{
		res.send();
		console.log("hello3");
	}
})});

app.post('/signinByCode', (req, res) => {
	connection.query('SELECT * from users where BINARY code=?', [req.body.code] , (error,rows) => {
	  if(rows[0]){
	    crypto.pbkdf2(req.body.code, rows[0].salt, 123583, 64, 'sha512', (err,key) => {
	      if(rows[0].password == key.toString('base64')){
		res.send(rows);
	      }
	      else{
		res.send();
	      }
	    });
	  }
	  else{
	    res.send();
	  }
})});

app.post('/changePassword', (req, res) => {
	crypto.randomBytes(64, (err, buf) => {
		crypto.pbkdf2(req.body.password, buf.toString('base64'), 123583, 64, 'sha512', (err, key) => {
			let salt = buf.toString('base64'); 
			req.body['password']= key.toString('base64');
			connection.query('UPDATE users SET password=?, salt=? WHERE id=?', [req.body.password, salt , req.body.id] ,function(err,result){
					res.json({result : 'success'});
			});
		});

	})
});
app.post('/changeSign',(req,res)=>{
	connection.query('UPDATE users SET sign=? WHERE id=?', [req.body.sign, req.body.id] ,function(err,result){
		res.json({result : 'success'});
	});
});
app.post('/changeName',(req,res)=>{
	connection.query('UPDATE users SET name=? WHERE id=?', [req.body.name, req.body.id] ,function(err,result){
	  connection.query('UPDATE worker SET workername2=? WHERE workername=?', [req.body.name, req.body.id] ,function(err,result){
		
		res.json({result : 'success'});
	  });});
});
app.post('/addBusiness', (req, res) => {
  console.log(req.body)
  connection.query('insert into business set ?', req.body ,function(err,result){
   	console.log(err); 
	  res.json({err:err,result:result});
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
  console.log(req.body.types1, req.body.types2, req.body.types3, req.body.types4); 
  if(req.body.id == '/'){
    req.body.id = req.session.name
  }
  console.log(req.body)
  //req.body.id = req.session.name;
  connection.query('insert into contractform set ?', req.body ,function(err,result){
    console.log(err);
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
      console.log(err);
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
			console.log(error);
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
  connection.query('UPDATE worker SET state=?, pay=?, mon=?, tue=?, wed=?, thu=?, fri=?, sat=?, sun=?, eachtime=?, startdate=?, enddate=? WHERE business=? and workername=?', [req.body.type, req.body.pay, req.body.mon, req.body.tue, req.body.wed, req.body.thu, req.body.fri, req.body.sat, req.body.sun,req.body.eachtime,req.body.startdate, req.body.enddate, req.body.bang, req.body.id ] ,function(err,result){

	    
	console.log(err);
    res.json({result : 'success'});
  });
});

//=====================================================================================//////////
app.post('/updateContractform', (req, res) => {
  console.log(req.body)
  //req.body.id = req.session.name;
  connection.query('UPDATE contractform SET EmployeeAddress=?, EmployeePhone=?, EmployeeName=?, type=? WHERE Employer=? and Employee=?', [req.body.EmployeeAddress, req.body.EmployeePhone, req.body.EmployeeName, req.body.type, req.body.Employer, req.body.Employee ] ,function(err,result){
    console.log(err);
    res.json({result : 'success'});
  });
});
app.post('/updateContractform2', (req, res) => {
	console.log(req.body.type)	
	connection.query('UPDATE contractform2 SET EmployeeAddress=?, EmployeePhone=?, EmployeeName=?, type=? WHERE bang=? and id=?', [req.body.EmployeeAddress, req.body.EmployeePhone, req.body.EmployeeName, req.body.type, req.body.bang, req.body.id ] ,function(err,result){
       	console.log(err); 
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
    console.log(error);
    res.send(rows);
  });
});
otherAllowance
app.post('/selectReceivedMessage', (req, res) => {
  
  connection.query('SELECT * from message where t=? and ft=0', [req.body.t] , (error, rows) => {
    console.log(error);
    res.send(rows);
  });
});
app.post('/delMessage', (req, res) => {
	console.log(req.body.ind);
	connection.query('DELETE from message where ind=?', [req.body.ind] , (error, rows) => {
		res.send({result:'success'});
		//console.log(error, rows);
	});	
});
app.post('/delBusiness', (req, res) => {
  console.log(req.body.bang);
  connection.query('DELETE from business where bname=?',[req.body.bang] , (error, rows) => {
  connection.query('DELETE from contractform where bang=?',[req.body.bang] , (error, rows) => {
connection.query('DELETE from contractform2 where bang=?',[req.body.bang] , (error, rows) => {
connection.query('DELETE from overtimework where business=?',[req.body.bang] , (error, rows) => {
connection.query('DELETE from timelog where bang=?',[req.body.bang] , (error, rows) => {
connection.query('DELETE from worktodo where bang=?',[req.body.bang] , (error, rows) => {
connection.query('SELECT * from worker where business=?', [req.body.bang] , (error, rows) => {
	for(let i=0 ; i<rows.length ; i++){
	  console.log(rows[i].workername)
	  connection.query('SELECT * from users where id=?', [rows[i].workername] , (error,rows2) => { 
	    console.log(rows2[0].bang);
	    let bangs = JSON.parse(rows2[0].bang);
	    delete bangs[req.body.bang];
	    console.log(bangs);
	    bangs = JSON.stringify(bangs);
	    connection.query('UPDATE users SET bang=? WHERE id=?', [bangs, rows[i].workername] ,function(err,result){
		console.log(err) 
	    });

	  }); 
	}
	
connection.query('DELETE from worker where business=?',[req.body.bang] , (error, rows) => {
	console.log("hehehehe"); 
	res.send({result:'success'});
});});});});});
  
});});});
});

app.post('/selectReceivedNewMessage', (req, res) => {
	console.log(req.body.t);
	connection.query('SELECT * from message where t=? and r=0 and ft=0', [req.body.t] , (error, rows) => {
			      //console.log(rows);
			      res.send(rows);
		  });
});

app.post('/addBang', (req, res) => {
  connection.query('SELECT * from users where id=?', [req.body.id] , (error, rows) => {
	  console.log(error);
	  let b = JSON.parse(rows[0].bang);
    console.log(req.body);
    b[req.body.bang]=1;
    console.log(b)
    let bang = JSON.stringify(b);
    
	console.log("????", bang, req.body.id);
	  connection.query('UPDATE users SET bang=? WHERE id=?', [bang, req.body.id] ,function(err,result){
      console.log(err);
      res.json({result : 'success'});
    });
  });
});

app.post('/selectSentMessage', (req, res) => {
  
  connection.query('SELECT * from message where f=? and ft=1', [req.body.id] , (error, rows) => {
    console.log(error);

    res.send(rows);
  });
});
app.post('/sendMessage', (req, res) => {
  if(req.body.system==1 && req.body.type!=3){
    req.body['message']= req.body.f + req.body['message'];
  }
  req.body['ft'] = 0;
  console.log(req.body);
  connection.query('insert into message set ?', req.body ,function(err,result){
	req.body['ft'] = 1;
	connection.query('insert into message set ?', req.body ,function(err,result){
   		console.log(err); 
	  	res.json({result : 'success'});
	}); 
  });
});

app.post('/alterReadMessage', (req, res) => {
	connection.query('UPDATE message SET r=1 WHERE ind=?', [req.body.ind], function(err,result){
		console.log(req.body.ind);	
	console.log(err, result);res.send(result);	
	});
});

app.post('/updateCommute', (req, res) => {
  
  connection.query('SELECT bang from users where id=?', [req.body.id] , (error, rows) => {
    console.log(error); console.log(rows);
    let row = JSON.parse(rows[0].bang);
    row[req.body.bang] = row[req.body.bang]==1?0:1;
    console.log(JSON.stringify(row)+" "+ req.session.name+"3");
    connection.query('UPDATE users SET bang=? WHERE id=?', [JSON.stringify(row), req.body.id] ,function(err,result){
      //res.json({result : 'success'});
    });
   console.log(req.session.name+"2");
    let h = (String(new Date().getHours())<10?'0'+String(new Date().getHours()):String(new Date().getHours()));
    let m = (String(new Date().getMinutes())<10?'0'+String(new Date().getMinutes()):String(new Date().getMinutes()));

    console.log(h, m, req.session.name, new Date().getDate())
    
if(row[req.body.bang]==0){
	connection.query('select * from timelog where bang=? and workername=? and year=? and month=? and date=?', [req.body.bang, req.body.id, new Date().getFullYear(),new Date().getMonth()+1, new Date().getDate()] , (err,rows) => {
		console.log(err); 
		if(rows.length==0){
			console.log("11111");  
			connection.query('insert into timelog set ?', {bang:req.body.bang, workername:req.body.id, year:new Date().getFullYear(),month:new Date().getMonth()+1, date:new Date().getDate() , goto:h+m} ,function(err,row){
				console.log(err); res.json({result : 'b'});
			});
		}
		else{
			console.log("2222");
	connection.query('UPDATE timelog SET goto=? WHERE bang=? and workername=? and year=? and month=? and date=? and leavee=?', [(h+m) , req.body.bang, req.body.id, (new Date().getFullYear()), (new Date().getMonth()+1), new Date().getDate(),rows[0].leavee] ,function(err,result){
				console.log(err, result); res.json({result:'b'});
			});}}); }
	else{
		connection.query('select * from timelog where bang=? and workername=? and year=? and month=? and date=?', [req.body.bang, req.body.id, new Date().getFullYear(),new Date().getMonth()+1, new Date().getDate()] , (err,rows) => {
        console.log(err);
        if(rows.length==0){
           console.log("11111"); 
	   connection.query('insert into timelog set ?', {bang:req.body.bang, workername:req.body.id, year:new Date().getFullYear(),month:new Date().getMonth()+1, date:new Date().getDate() , leavee:h+m} ,function(err,row){
            console.log(err); res.json({result : 'a'});
          });
        }
        else{
		console.log("2222");
          connection.query('UPDATE timelog SET leavee=? WHERE bang=? and workername=? and year=? and month=? and date=? and goto=?', [(h+m) , req.body.bang, req.body.id, (new Date().getFullYear()), (new Date().getMonth()+1), new Date().getDate(), rows[0].goto] ,function(err,result){
            console.log(err, result); res.json({result:'a'})
          });
        }
      });
    }

    
  });
});


app.post('/', (req, res) => {


});
app.post('/searchId', (req, res) => {
  connection.query('SELECT * from users where id like ?', '%'+req.body.id+'%' , (error, rows) => {
    res.send(rows);
  });
});
app.post('/selectUsername', (req, res) => {
	connection.query('SELECT * from users where id=?', [req.body.id] , (error,rows) => {
		res.send(rows);
	});
});


app.post('/addWorker', (req, res) => {
  console.log()
  connection.query('insert into worker set ?', req.body ,function(err,result){
    console.log(err,result)
    res.json({result : 'success'});
  });
});
app.post('/addWork', (req, res) => {
  console.log(req.body)
  console.log("dd")
  connection.query(`SELECT * from overtimework where business=? and day=? and month=? and date=? and year=? and workername=?`, [req.body.business, req.body.day, req.body.month, req.body.date, req.body.year, req.body.workername] , (error, rows) => {
	console.log(error);    
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
app.post('/updateBusiness', (req, res) => { 
console.log(req.body);
	connection.query('UPDATE business SET bnumber=?, name=?, bphone=?, baddress=?, stamp=?, fivep=? WHERE id=? and bname=?', [req.body.bnumber, req.body.name, req.body.bphone, req.body.baddress, req.body.stamp, req.body.fivep, req.body.id, req.body.bname] ,function(err,result){
			console.log(err, result);
			res.json({result : 'success'});
		});
})
app.post('/selectBusiness', (req, res) => {
  connection.query('SELECT * from business where id=?', [req.body.id] , (error, rows) => {
   console.log(error); 
    //console.log('User info is: ', rows);
    //res.cookie('token',rows.id);
    res.send(rows);
  });
});
app.post('/selectBusinessByName', (req, res) => {

	connection.query('SELECT * from business where bname=?', [req.body.bname] , (error, rows) => {
	console.log(req.body.bname + " " + error);
		console.log('User info is: ', rows);
		res.send(rows);
	  });
});
app.post('/selectWorkerByType', (req, res) => {
  console.log(req.body.business+" + "+ req.body.type);
  connection.query('SELECT * from worker where business=? and type=?', [req.body.business, req.body.type] , (error, rows) => {
   console.log(error); 
    console.log('worker info is: ', rows);
    //res.cookie('token',rows.id);
    res.send(rows);
  });
});

app.post('/insurancePercentage', (req, res) => {

	connection.query('SELECT * from insurancePercentage', (error, rows) => {
	//console.log(req.body.bname + " " + error);
		console.log('User info is: ', rows);
		res.send(rows);
	  });
});

app.post('/selectWorker', (req, res) => {
  connection.query('SELECT * from worker where state=2 and business=?', [req.body.business] , (error, rows) => {
   console.log(error); 
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
   console.log(error); 
    console.log('worker info is: ', rows);
    //res.cookie('token',rows.id);
    res.send(rows);
  });
});

app.post('/selectBusinessByWorker', (req, res) => {
  connection.query('SELECT * from users where id=?', [req.body.id] , (error, rows) => {
	console.log(error);    
	  if (error) throw error;
    console.log('worker info is: ', rows);
    //res.cookie('token',rows.id);
    res.send(rows);
  });
});
app.post('/deleteWorker', (req, res) => {
	connection.query('SELECT * from users where id=?', [req.body.workername] , (error, rows) => {

		let bangs = JSON.parse(rows[0].bang);
		delete bangs[req.body.business];	
		console.log(bangs);
		bangs = JSON.stringify(bangs);
		connection.query('UPDATE users SET bang=? WHERE id=?', [bangs, req.body.workername] ,function(err,result){
			console.log(err)
		});
		
	});
	
	connection.query(`SELECT * from worker where business=? and workername=?`, [req.body.business, req.body.workername] , (error, rows) => {
	if(rows[0].type==2){
		connection.query('DELETE from contractform where bang=? and id=?', [req.body.business, req.body.workername] , (error, rows) => {}
		)}else{
		connection.query('DELETE from contractform2 where bang=? and id=?', [req.body.business, req.body.workername] , (error, rows) => {}
		)}
	});
	
	connection.query('DELETE from worker where business=? and workername=?', [req.body.business, req.body.workername] , (error, rows) => {
		connection.query('DELETE from overtimework where business=? and workername=?', [req.body.business, req.body.workername] , (error, rows) => {
		console.log("error : "+error); 
		});
	});

	connection.query('DELETE from timelog where bang=? and workername=?', [req.body.business, req.body.workername] , (error, rows) => {
		console.log("error : "+error);
	});
	
	connection.query('DELETE from worktodo where bang=? and worker=?', [req.body.business, req.body.workername] , (error, rows) => {
			console.log("error : "+error);
			res.send(rows);
	});

});


app.post('/selectImg', (req, res) => {
  
	console.log(__dirname);
  res.send('<img src="./public/11.jpg"/>');
});

app.post('/selectOvertimework', (req, res) => {
  console.log(req.body);
  connection.query(`SELECT * from overtimework where business=? and year=? and month=?`, [req.body.business, req.body.year, req.body.month] , (error, rows) => {
    console.log(error) 
    console.log('+++++++++++++++++++++++++ ', rows);
      //res.cookie('token',rows.id);
      res.send(rows);
  });
});

app.post('/selectTimelog', (req, res) => {
  console.log(req.body);
  console.log(">>>>>>>>>>>>>>>")
  connection.query(`SELECT * from timelog where bang=? and year=? and month=? and date=?`, [req.body.bang, req.body.year, req.body.month, req.body.date] , (error, rows) => {
    console.log(error); 
    console.log('worker info is: ', rows);
      //res.cookie('token',rows.id);
      res.send(rows);
  });
});

app.post('/selectTimelogAsWorker', (req, res) => {
  connection.query(`SELECT * from timelog where bang=? and workername=? and year=? and month=? and date=?`,[req.body.bang,req.body.workername, req.body.year, req.body.month, req.body.date] , (error, rows) => {
    res.send(rows);
  });
});

app.post('/selectWorkTodo', (req, res) => {
  console.log(req.body); 
  connection.query(`SELECT * from worktodo where bang=? and year=? and month=? and date=? and worker=?`, [req.body.bang, req.body.year, req.body.month, req.body.date, req.body.worker] , (error, rows) => {
   console.log(error); 
    console.log('Todo List is: ', rows);
	  console.log(rows);
      //res.cookie('token',rows.id);
      res.send(rows);
  });
});
app.post('/addWorkTodo', (req, res) => {
  let todo1={}, todo2='';
  console.log(req.body);
  console.log(">>>>>>>>>>>>>>>")
  connection.query(`SELECT * from worktodo where bang=? and year=? and month=? and date=? and worker=?`, [req.body.bang, req.body.year, req.body.month, req.body.date, req.body.worker] , (error, rows) => {
     console.log(error); 
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
        console.log(err)
        res.json({result : 'success'});
      });
    }
  });
 
});

app.post('/addWorkTodoCheck', (req, res) => {
  let todo = JSON.stringify(req.body.todo)
  let worker;
	console.log(req.body);
	connection.query('UPDATE worktodo SET todo=? WHERE bang=? and year=? and month=? and date=? and worker=?', [todo, req.body.bang, req.body.year, req.body.month, req.body.date, req.body.id] ,function(err,result){
    console.log(err, result)
	res.send(result);
  });
});

app.post('/deleteWorkTodo', (req, res) => {
  let todo1={}, todo2='';
  console.log(req.body);
  console.log(">>>>>>>>>>>>>>>")
  connection.query(`SELECT * from worktodo where bang=? and year=? and month=? and date=? and worker=?`, [req.body.bang, req.body.year, req.body.month, req.body.date, req.body.worker] , (error, rows) => {
     console.log(error); 
	  todo1 = JSON.parse(rows[0].todo);
      console.log(req.body.key);
      delete todo1[req.body.key];
      todo2 = JSON.stringify(todo1);
      console.log(todo2);
      connection.query('UPDATE worktodo SET todo=? WHERE bang=? and year=? and month=? and date=? and worker=?', [todo2, req.body.bang, req.body.year, req.body.month, req.body.date, req.body.worker] ,function(err,result){
        console.log(err)
        res.json({result : 'success'});
      });
  });
 
});
app.post('/selectSign', (req, res) => {
  let r;
	console.log("id2:");
	console.log(req.body.id2);
  if(req.body.id=='/'){
	req.body.id=req.session.name;
  }
  connection.query(`SELECT * from users where id=?`, [req.body.id] , (error, rows) => {
   connection.query(`SELECT * from users where id=?`, [req.body.id2] , (error, rows2) => { 
	rows.push(rows2[0]); 
	  console.log(error, rows)
    res.send(rows)
   });});
});
app.post('/selectWorkerAsDay', (req, res) => {
  let r,rr;
  connection.query(`SELECT * from worker where business=? and ${req.body.day} IS NOT NULL`, [req.body.business] , (error, rows) => {
   console.log(error); 
	  if (error) throw error;
    console.log('===========================================', rows);
      //res.cookie('token',rows.id);
      r = rows;
  });
  console.log(req.body);
  connection.query(`SELECT * from overtimework where business=? and day=? and month=? and date=? and year=?`, [req.body.business, req.body.day, req.body.month, req.body.date, req.body.year] , (error, rows) => {
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
    res.send({ori:r, alter:rr});
  });
  
});
app.post('/selectWorkerAsDayAsWorker', (req, res) => {
  let r,rr;
  connection.query(`SELECT * from worker where business=? and workername=? and ${req.body.day} IS NOT NULL`, [req.body.business, req.body.workername] , (error, rows) => {			  
	if(error) throw error;
	console.log('===========================================', rows);
	//res.cookie('token',rows.id);
	r = rows;
  });
  console.log(req.body);
  connection.query(`SELECT * from overtimework where business=? and day=? and month=? and date=? and year=?`, [req.body.business, req.body.day, req.body.month, req.body.date, req.body.year] , (error, rows) => {
    rr = rows;
    res.send({ori:r, alter:rr});
  
  });
});

app.post('/otherAllowance', (req, res) => {
  connection.query('SELECT * from message otherAllowance bang=? and id=? and year=? and month=?', [req.body.bang, req.body.id, req.body.year, req.body.month] , (error, rows) => {
    console.log(error);
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
