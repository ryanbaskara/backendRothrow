var user = require('../models/userModel');

module.exports = {
  configure: function(app) {
    //Melihat profile klien
    app.get('/user/profile/:iduser', function(req, res) {
      user.getProfile(req,res);
    });
	
	//Melihat semua profile
	app.get('/user/alldata', function(req,res){
		user.searchProfile(req,res);
	});
	
	//Membuat akun baru
	app.post('/user/regis', function(req,res){
		user.createAccount(req.body,res);
	});
  }
};
