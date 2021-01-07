import 'bootstrap/dist/css/bootstrap-grid.css';
import 'bootstrap/dist/css/bootstrap-utilities.css';
import 'bootstrap/js/dist/alert';
import 'jquery';

const ex = () => {
  const point = document.querySelector('#point');
  point.innerHTML = '<h1>Hello!</h1>';
  const newAlert = document.createElement('div');
  newAlert.classList.add('alert', 'alert-primary');
  newAlert.setAttribute('role', 'alert');
  newAlert.innerHTML = 'example';
  document.body.append(newAlert);
};

ex();
