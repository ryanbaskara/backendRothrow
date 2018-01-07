var connection = require('../connection');
 

function Admin(){
	this.orderInput = function(req, res) {
		connection.acquire(function(err, con) {
		  var creds = ['',req.id,req.name,req.jenis,req.mode,req.alamat,req.lat,req.lang,req.harga,req.status];
		  var query = 'insert into ro_pembuang (id_order,id,ro_nama_pembuang,ro_jenis_sampah,ro_mode_pembuangan,ro_alamat,ro_lat,ro_lang,ro_harga,ro_status) values (?,?,?,?,?,?,?,?,?,?)';

		  con.query(query, creds, function(err, result) {
			con.release();
			if (err) {
			  res.send({status: 400, message: err});
			}
			else {
			  res.send({status: 200, message: 'Insert successfully'});
			}
		  });
		});
	  };
	
	this.ambil_data = function(req,res){
		connection.acquire(function(err, con) {
		  var query1 = 'SELECT * FROM ro_pembuang';
		  con.query(query1, function(err, result) {
		  con.release();
		  if (err) {
			res.send({status: 400, message: 'Get failed'});
		  }
		  else if(result.length!=0) {
			res.send({status: 200, message: 'Data successfully', data: result});
		  }
		  });
		});
	};

	this.getDataById = function(req,res){
		connection.acquire(function(err, con) {
		  var creds = [req.params.id];
		  var query1 = 'SELECT * FROM ro_pembuang WHERE id = ?';
		  con.query(query1, creds, function(err, result) {
		  con.release();
		  if (err) {
			res.send({status: 400, message: 'Get failed'});
		  }
		  else if(result.length!=0) {
			res.send({status: 200, message: 'Data successfully', data: result});
		  }
		  });
		});
	};
}
module.exports = new Admin();