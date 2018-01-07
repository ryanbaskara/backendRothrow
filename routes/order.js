var md_order = require('../models/orderModel');

module.exports = {
  configure: function(app) {

    //buang sampah
    app.post('/order/insert_order', function(req, res) {
      md_order.orderInput(req.body,res);
    });
	
	//ambil data
	app.get('/order/getdata', function(req,res){
		md_order.ambil_data(req,res);
	});

  app.get('/order/getdata/:id', function(req,res){
    md_order.getDataById(req,res);
  });
  }
};
