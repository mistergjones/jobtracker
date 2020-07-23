console.log("login");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const error = document.querySelector(".error");
const loginForm = document.querySelector("#login-form");
const signinButton = document.querySelector("#signin");
const togglePasswordButton = document.querySelector("#toggle-password");

togglePasswordButton.addEventListener("click", togglePassword);

function togglePassword() {
  if (password.type === "password") {
    password.type = "text";
    togglePasswordButton.innerHTML = "<i class='fa fa-eye-slash'></i>";
    togglePasswordButton.setAttribute("aria-label", "Hide password.");
  } else {
    password.type = "password";
    togglePasswordButton.innerHTML = "<i class='fa fa-eye'></i>";
    togglePasswordButton.setAttribute(
      "aria-label",
      "Show password as plain text. " +
      "Warning: this will display your password on the screen."
    );
  }
}

function validateLogin(e) {
  //   console.log("validate form");
  let validationMessage = "";
  if (email.value === 0 || password.value.length === 0) {
    validationMessage += "Email and password are required fields.";
  }
  if (!/\S+@\S+\.\S+/.test(email.value)) {
    validationMessage += "\nEmail is not valid.";
  }
  if (!/.{8,}/.test(password.value)) {
    validationMessage = "\nPassword must be at least eight characters. ";
  }
  //   if (!/.*[A-Z].*/.test(password.value)) {
  //     validationMessage += "\nPassword must have at least one uppercase letter. ";
  //   }
  //   if (!/.*[a-z].*/.test(password.value)) {
  //     validationMessage += "\nPassword must have at least one lowercase letter.";
  //   }
  //   console.log(loginForm.checkValidity());
  if (validationMessage === "") {
    signinButton.disabled = "true";
    return true;
  } else {
    e.preventDefault();
    error.textContent = "";
    error.textContent = validationMessage;
    return false;
  }
}
loginForm.addEventListener("submit", validateLogin);
