import type { IUser } from "../../../types/IUser";
import type { Rol } from "../../../types/Rol";
import { navigate } from "../../../utils/navigate";

const form = document.getElementById("form") as HTMLFormElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
//const inputPassword = document.getElementById("password") as HTMLInputElement;

function resolveRoleFromEmail(email: string): Rol {
  const normalized = email.trim().toLowerCase();

  if (normalized.includes("admin")) {
    return "admin";
  }

  return "client";
}

form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();
  const valueEmail = inputEmail.value;
  //const valuePassword = inputPassword.value;
  const valueRol = resolveRoleFromEmail(valueEmail);

  if (valueRol === "admin") {
    navigate("/src/pages/admin/home/home.html");
  } else if (valueRol === "client") {
    navigate("/src/pages/client/home/home.html");
  }

  const user: IUser = {
    email: valueEmail,
    role: valueRol,
    loggedIn: true,
  };

  const parseUser = JSON.stringify(user);
  localStorage.setItem("userData", parseUser);
});
