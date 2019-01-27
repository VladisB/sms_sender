const numberInput = document.getElementById('number'),
      textInput = document.getElementById('message'),
      button = document.getElementById('button'),
      response = document.querySelector('.response');

button.addEventListener('click', send, false);

const socket = io();
socket.on('smsStatus', function(data){
	response.innerHTML = '<h5>Text message sent to' + data.number + '</h5>';
});

const fetchServer = ({ number, text }) => {
  console.log('send');
  fetch('/', {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ number, text })
  })
    .then(function (res) {
      console.log(res);
    })
    .catch(function (err) {
      console.log(err);
    });
};

function send() {
  const number = numberInput.value.replace(/\D/g, '');
	const text = textInput.value;
	
	console.log('number: '+ number);
	console.log('text: '+ text);
	
  fetchServer({ number, text });
}

