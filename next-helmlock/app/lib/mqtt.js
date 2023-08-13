import mqtt from 'mqtt';

const client = mqtt.connect('wss://test.mosquitto.org:8081');
const topic = 'servo'; // change this to whatever your want

client.on('connect', () => {
  console.log('connected to mqtt broker.');

  client.subscribe(topic, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
});

export const changeStatus = (status, lockerNumber) => {
  const servo_status = 'locker' + lockerNumber + status;
  var payload = null;
  switch (servo_status) {
    case 'locker1open':
      payload = '0';
      break;
    case 'locker1close':
      payload = '1';
      break;
    case 'locker2open':
      payload = '2';
      break;
    case 'locker2close':
      payload = '3';
      break;
    case 'locker3open':
      payload = '4';
      break;
    case 'locker3close':
      payload = '5';
      break;
    case 'locker4open':
      payload = '6';
      break;
    case 'locker4close':
      payload = '7';
      break;
    case 'locker5open':
      payload = '8';
      break;
    case 'locker5close':
      payload = '9';
      break;
    case 'locker6open':
      payload = 'a';
      break;
    case 'locker6close':
      payload = 'b';
      break;
    default:
    // code block
  }
  console.log(servo_status);
  console.log(payload);
  client.publish(topic, payload);
  if (status === 'open') {
    console.log('OPEN');
  } else {
    console.log('CLOSE');
  }
  return;
};
