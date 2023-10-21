/*eslint-disable */

const url = 'http://127.0.0.1:8000';

const form = document.querySelector('.form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

async function login({ email, password }) {
  try {
    // const res = await axios({
    //   method: 'POST',
    //   url: 'http://127.0.0.1:8000/api/v1/users/login',
    //   data: { email, password },
    // });
    console.log({ email, password });
    const res = await fetch(`${url}/api/v1/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      throw new Error('Incorrect email or password');
    }
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;
  login({ email, password });
});
