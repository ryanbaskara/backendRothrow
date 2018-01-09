var md_order = require('../models/orderModel');

module.exports = {
  configure: function(app) {

    //buang sampah
    app.post('/order/insert_order', function(req, res) {
      md_order.orderInput(req.body,res);
    });
    //buang sampah2
    app.post('/order/insert_order2', function(req, res) {
      md_order.orderInput2(req.body,res);
    });

    //ambil data
    app.get('/order/getdata', function(req,res){
      md_order.ambil_data(req,res);
    });

    // ambil data berdasarkan id
    app.get('/order/getdata/:id', function(req,res){
      md_order.getDataById(req,res);
    });

    //update data order (saat pengangkut picked up)
    app.post('/order/edit_order/:id', function(req,res) {
      md_order.updateOrder(req,res);
    });
  }
};
