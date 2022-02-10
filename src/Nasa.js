import "./NasaImageSearch.js";

const checkbox = document.getElementById('dataOnly');
checkbox.addEventListener('change', (e) => {
e.currentTarget.checked ? document.querySelector("#images").listOnly = true : document.querySelector("#images").listOnly = false;
})

document.querySelector('#getData').addEventListener('click', e => {
  document.querySelector('#images').name = document.querySelector('#load').value;
  document.querySelector('#images').page = document.querySelector('#page').value;
  document.querySelector('#images').year_start = document.querySelector('#start').value; 
  document.querySelector('#images').year_end = document.querySelector('#end').value;
});