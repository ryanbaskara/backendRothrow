var express = require('express');
var bodyparser = require('body-parser');
var connection = require('./connection');
var jwt = require('jsonwebtoken');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 2828;
var config = require('./config');
var morgan    =   require('morgan')
// setup web services
app.use(morgan('dev'))
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

var authRoutes = require('./routes/auth');
var userRoutes = require('./routes/user');
var orderRoutes = require('./routes/order');

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if('OPTIONS'==req.method) {
    res.send(200);
  } else {
    next();
  }
});


app.use(express.static(__dirname + '/public'));
app.use(bodyparser.urlencoded({limit: '10mb',extended: true}));
app.use(bodyparser.json({limit: '10mb'}));


app.get('/', function (req, res) {
  res.send('Hello World!');
});

connection.init();

authRoutes.configure(app);
userRoutes.configure(app);
orderRoutes.configure(app);
// --- JWT Validaltion ---
app.use(function(req,res,next){
	if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
		var token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, config.secret, function(err, decoded){
	    if (err){
  			return res.json({ success: false, message: 'Failed to authenticate token.' });
  		}
  		else{
  			// for website login
  			if(decoded.login_type==2){
  				req.user_id=decoded.user_id;
	  			req.role = decoded.role;
	  			req.token=jwt.sign({
        	  									user_id:decoded.user_id,
                              email:decoded.email,
                              role:decoded.role,
                              login_type:decoded.login_type
                            }
                              ,config.secret, {
		                            expiresIn : 60*20// expires in 20 minute
		                        });
	  			next();
  			}
  			//for mobile login
  			else if(decoded.login_type==1){
  				req.user_id=decoded.user_id;
  				req.token='-';
			    req.role = decoded.role;
  	  		next();
  			}
  		}
		})
	}
	else{
  	return res.status(400).json({ status:400, message: 'Please send token' });
  }
});

// ROUTES
userRoutes.configure(app);
//orderRoutes.configure(app);