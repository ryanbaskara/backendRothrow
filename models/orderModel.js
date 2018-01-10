var connection = require('../connection');
 
var ImageSaver  =   require('image-saver-nodejs/lib');

function Admin(){
	this.orderInput2 = function(req, res) {
		connection.acquire(function(err, con) {
			var imageSaver = new ImageSaver();
	      	var pictname = new Date().getTime();
	      	imageSaver.saveFile("../../web/indoexplore.yippytech.com/public_html/rothrow/"+pictname+".jpg", req.foto)
      		.then((data)=>{
        		var imagePath = "http://indoexplore.yippytech.com/rothrow/"+pictname+".jpg";
				var creds = ['',req.id,req.name,req.jenis,req.mode,req.alamat,req.lat,req.lang,req.harga,req.status,imagePath];
				var query = 'insert into ro_pembuang (id_order,id,ro_nama_pembuang,ro_jenis_sampah,ro_mode_pembuangan,ro_alamat,ro_lat,ro_lang,ro_harga,ro_status,ro_gambar) values (?,?,?,?,?,?,?,?,?,?,?)';

				con.query(query, creds, function(err, result) {
					con.release();
					if (err) {
					  res.send({status: 400, message: err});
					}
					else {
					  res.send({status: 200, message: 'Insert successfully'});
					}
				});
			})
		});
	  };

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
		  var creds = ['Waiting'];
		  var query1 = 'SELECT * FROM ro_pembuang WHERE ro_status = ?';
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

	this.updateOrder = function(req,res){
		connection.acquire(function(err, con) {
		  var creds = [req.params.id];
		  var query1 = 'SELECT * FROM ro_pembuang WHERE id_order = ?';
		  con.query(query1, creds, function(err, result) {
		  if (err) {
			res.send({status: 400, message: 'Data yang dicari tidak ditemukan'});
		  }
		  else if(result.length!=0) {
		  	var creds1 = ['Pick Up',req.params.id];
		  	var query_update = 'UPDATE ro_pembuang SET ro_status = ? WHERE id_order = ?';
		  	con.query(query_update,creds1, function(err2,result2){
		  		con.release();
		  		if(err2){
		  			res.send({status: 400, message: 'Pick Up Failed'});
		  		}
		  		else {
		  			res.send({status: 200, message: 'Pick Up Successfully'});
		  		}
		  	});
		  }
		  else {
		  	res.send({status: 400, message: 'Get failed'});
		  }
		  });
		});
	};
}
module.exports = new Admin();