// const { default: axios } = require("axios");

console.log("register");

const firstnameInput = document.querySelector("#firstname");
const lastnameInput = document.querySelector("#lastname");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#password2");
const error = document.querySelector(".error");
const signup_submit_button = document.querySelector("#signup-submit-button");

const signUpValidation = {
  firstname: {
    valid: false,
    msg: "First name must be at least 3 characters long.",
  },
  lastname: {
    valid: false,
    msg: "Last name must be at least 3 characters long.",
  },
  email: { valid: false, msg: "must be a valid email" },
  password: {
    valid: false,
    msg: "password must be at least 8 characters long",
  },
  password2: { valid: false, msg: "passwords do not match" },
};
const validateName = (value) => {
  return value.length >= 3;
};

const validateEmail = (value) => {
  const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return value.match(mailformat);
};
const validatePassword = (value) => {
  if (value.length < 8) {
    console.log("hello");
    return {
      valid: false,
      msg: "Password must be a minimum of 8 characters in length",
    };
  } else if (!value.match(/\d/)) {
    return { valid: false, msg: "Password must have at least one number." };
  }
  return { valid: true, msg: "" };
};
const validateConfirmPassword = (value) => {
  if (passwordInput.textContent !== value) {
    return { valid: false, msg: "Passwords do not match" };
  } else {
    return { valid: true, msg: "" };
  }
};
const handleFirstnameChange = (e) => {
  error.textContent = "";
  firstnameInput.textContent = e.target.value;
  signUpValidation.firstname.valid = validateName(e.target.value);
};

const handleLastnameChange = (e) => {
  error.textContent = "";
  lastnameInput.textContent = e.target.value;
  signUpValidation.lastname.valid = validateName(e.target.value);
};
const handleEmailChange = (e) => {
  error.textContent = "";
  emailInput.textContent = e.target.value;
  signUpValidation.email.valid = validateEmail(e.target.value);
};
const handlePasswordChange = (e) => {
  error.textContent = "";
  passwordInput.textContent = e.target.value;
  signUpValidation.password = validatePassword(e.target.value);
};
const handleConfirmPasswordChange = (e) => {
  error.textContent = "";
  confirmPasswordInput.textContent = e.target.value;

  signUpValidation.password2 = validateConfirmPassword(e.target.value);
};
const handleSubmit = (e) => {
  error.textContent = "";
  e.preventDefault();

  const { firstname, lastname, email, password, password2 } = signUpValidation;
  if (!firstname.valid) {
    console.log(firstname.msg);
    error.textContent = firstname.msg;
  } else if (!lastname.valid) {
    console.log(lastname.msg);
    error.textContent = lastname.msg;
  } else if (!email.valid) {
    error.textContent = email.msg;
    console.log(email.msg);
  } else if (!password.valid) {
    error.textContent = password.msg;
    console.log(password.msg);
  } else if (!password2.valid) {
    error.textContent = password2.msg;
    console.log(password2.msg);
  } else {
    let params = {
      firstname: firstnameInput.textContent,
      lastname: lastnameInput.textContent,
      email: emailInput.textContent,
      password: passwordInput.textContent,
      password2: confirmPasswordInput.textContent,
    };
    console.log("validation passed = ", params);
    url = "http://localhost:4000/users/register";
    axios.post(url, params).then((res) => {
      console.log(res);
      document.body.innerHTML = res.data;
    });
  }
};

firstnameInput.addEventListener("change", handleFirstnameChange);
lastnameInput.addEventListener("change", handleLastnameChange);
emailInput.addEventListener("change", handleEmailChange);
passwordInput.addEventListener("change", handlePasswordChange);
confirmPasswordInput.addEventListener("change", handleConfirmPasswordChange);
signup_submit_button.addEventListener("click", handleSubmit);
