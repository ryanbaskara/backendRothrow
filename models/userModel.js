var connection = require('../connection');
var moment = require('moment');
var secretKey = require('../config');
var jwt       =   require('jsonwebtoken');
var ImageSaver  =   require('image-saver-nodejs/lib');

function User() {
  this.auth = function(req, res) {
    connection.acquire(function(err, con) {
      var generated_hash = require('crypto')
              						.createHash('md5')
              						.update(req.password, 'utf8')
              						.digest('hex');
			req.password = generated_hash;
      var creds = [req.email, req.password];
	  console.log(req.email,req.password);
      var query1 = 'SELECT id,ro_nama_pengguna,ro_jenis_kelamin,ro_email,ro_id_role FROM ro_pengguna WHERE ro_email = ? and ro_password = ?';

      con.query(query1, creds, function(err, result) {
        con.release();

        if (err) {
          res.send({status: 1, message: 'Insert failed'});
        }
        else {
          if (result.length == 1) {
            if(req.login_type==1){ //Auth untuk Mobile
              var token = jwt.sign({
                                    user_id:result[0].id,
                                    email:result[0].ro_email,
                                    role:result[0].ro_id_role,
									nama:result[0].ro_nama_pengguna,
                                    login_type:req.login_type
                                  }
                                    ,secretKey.secret,{
                                  //no expires
                                  });
            }
            else if (req.login_type==2) { //Auth untuk Website
              var token = jwt.sign({
                                      user_id:result[0].id,
                                      email:result[0].ro_email,
                                      role:result[0].ro_id_role,
                                      login_type:req.login_type
                                    }
                                      ,secretKey.secret,{
                                        expiresIn : 60*60// expires in 24 hours
                                    });
            }

            /*if(result[0].id_role==2){
              var creds = [result[0].id];
              var query = 'SELECT * FROM users,providerdetails p WHERE users.id=? AND users.id=p.id';
              con.query(query, creds, function(err, result) {
                if (err) {
                  res.send({status: 400, message: 'Error'});
                }
                else {
                  res.send({status: 200, message: 'Login successfully',data: result[0], _token:token});
                }
              });
            }
            else if(result[0].id_role==3){
              var creds = [result[0].id];
              var query = 'SELECT * FROM users WHERE id_role=3 AND id=?';
              con.query(query, creds, function(err, result) {
                if (err) {
                  res.send({status: 400, message: 'Error'});
                }
                else {
                  res.send({status: 200, message: 'Login as Admin',data: result[0], _token:token});
                }
              });
            }*/
            //else {
              res.send({status: 200, message: 'Login successfully',data: result[0], _token:token});
            //}
          }
          else {
            res.send({status: 400, message: 'Email and password not match'});
          }
        }
      });
    });
  };

  this.createAccount = function(req, res) {
    connection.acquire(function(err, con) {
      var generated_hash = require('crypto')
              						.createHash('md5')
              						.update(req.password, 'utf8')
              						.digest('hex');
			req.password = generated_hash;
      var creds1 = ['',req.name,req.gender,req.alamat, 'Aktif', 1, req.email, req.password,req.tanggal,req.nohp];
      var query1 = 'insert into ro_pengguna (id,ro_nama_pengguna,ro_jenis_kelamin,ro_alamat,ro_status,ro_id_role,ro_email,ro_password,ro_tanggal_join,ro_no_hp) values (?,?,?,?,?,?,?,?,?,?)';

      var creds = [req.email];
      var query = 'SELECT * FROM ro_pengguna WHERE ro_email = ?';

      con.query(query, creds, function(err, result) {
        if (err) {
          res.send({status: 1, message: 'Insert failed 1'});
        }
        else {
          if (result.length == 1) {
            res.send({status: 1, message: 'Email already taken'});
          }
          else {
            con.query(query1, creds1, function(err, result) {
              con.release();
                if (err) {
                  res.send({status: 400, message: err});
                }
                else {
                  res.send({status: 200, message: 'Insert successfully'});
                }
            });
          }
        }
      });
    });
  };
	
this.getProfile = function(req, res) {
    connection.acquire(function(err, con) {
		var creds = [req.params.iduser];
	  console.log(req.params.iduser);
	  var query1 = 'SELECT ro_nama_pengguna,ro_alamat,ro_email,ro_tanggal_join,ro_status, ro_no_hp FROM ro_pengguna WHERE id = ?';

      con.query(query1, creds, function(err, result) {
      con.release();
	  if (err) {
		res.send({status: 400, message: 'Get failed'});
	  }
	  else if(result.length!=0) {
		res.send({status: 200, message: 'Data successfully', data: result[0]});
	  }
      });
    });
  };

  this.searchProfile = function(req, res) {
    connection.acquire(function(err, con) {
		//var query = "";
		//if (req.query.key) query = req.query.key;
		//console.log(req.query.key,query);
		//var creds = [query,''];
      con.query('SELECT * FROM ro_pengguna', function(err, result) {
      con.release();
	  if (err) {
		res.send({status: 400, message: 'Get failed'});
	  }
	  else if(result.length!=0) {
		res.send({status: 200, message: 'Data successfully', data:result});
	  }
      });
    });
  };
}

module.exports = new User();
