import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

const ex = () => {
  // const point = document.querySelector('#point');
  // point.innerHTML = '<h1>Hello!</h1>';
  const newAlert = document.createElement('div');
  newAlert.classList.add('alert', 'alert-primary');
  newAlert.setAttribute('role', 'alert');
  newAlert.innerHTML = 'example';
  // document.body.append(newAlert);
};

ex();
