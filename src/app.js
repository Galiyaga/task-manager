import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import taskFieldTemplate from "./templates/taskField.html";
import noAccessTemplate from "./templates/noAccess.html";
import { User } from "./models/User";
import {generateAdminUser, generateSimpleUser} from "./utils";
import { State } from "./state";
import { authUser } from "./services/auth";

export const appState = new State();

const loginForm = document.querySelector("#app-login-form");

generateSimpleUser(User);
generateAdminUser(User);

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const login = formData.get("login");
  const password = formData.get("password");

  const authSuccess = authUser(login, password)
  const fieldHTMLContent = authSuccess ? taskFieldTemplate : noAccessTemplate;

  if (authSuccess) {
    const navbar = document.querySelector('#navbar')
    navbar.remove()
  }

  console.log('fieldHTMLContent: ', fieldHTMLContent)

  document.querySelector("#content").innerHTML = fieldHTMLContent;
});

