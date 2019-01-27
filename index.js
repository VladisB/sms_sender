const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

//init
const app = express();

//init Nexmo
const nexmo = new Nexmo({
	apiKey: 'key',
	apiSecret: 'secret'
}, {debug: true});

//Template engine setup
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

//Route
app.get('/', (req, res) =>{
	res.render('index');
})

//Public folder setup
app.use(express.static(__dirname + '/public'));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Catch form submit
// nexmo.message.sendSms(from, to, text)

app.post('/', (req, res) => {
  res.send(req.body);
	console.log(req.body);
	const to = req.body.number;
	const text = req.body.text;
	console.log(`Number ${req.body.number}`);

	const from = 'Waldemar'
	// const to = '123456789123'
	// const text = 'message'

	nexmo.message.sendSms(
		from, to, text, { type: 'unicode'}, 
		(err, responseData) =>{
			if(err){
				console.log(err);
			}else{
				console.dir(responseData);
				//Get data from the response
				const data = { 
					id: responseData.messages[0]['message-id'],
					number: responseData.messages[0]['to']
				}
				//Emit to the client
				io.emit('smsStatus', data);
			}
		}
	);

});


//Define port
const port = 3000;

//Start server
const server = app.listen(port, ()=>{
	console.log(`Server started on port ${port}`);
});

//Socket.io
const io = socketio(server);
io.on('connection', (socket)=>{
	console.log('Conncted');
	io.on('disconect', ()=>{
		console.log('disconected');
	})
});