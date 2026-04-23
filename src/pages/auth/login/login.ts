import type { IUser } from "../../../types/IUser";
import { saveUser } from "../../../utils/localStorage";
import { navigate } from "../../../utils/navigate";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.min.css";

type StoredUser = IUser & {
  name?: string;
  createdAt?: string;
};

const USERS_KEY = "usersData";

const form = document.getElementById("form") as HTMLFormElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;

function getStoredUsers(): StoredUser[] {
  const raw = localStorage.getItem(USERS_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as StoredUser[]) : [];
  } catch {
    return [];
  }
}

form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();
  const valueEmail = inputEmail.value.trim().toLowerCase();
  const valuePassword = inputPassword.value;

  const users = getStoredUsers();

  if (users.length === 0) {
    alertify.warning("No hay usuarios registrados");
    return;
  }

  const foundUser = users.find(
    (user) => user.email.trim().toLowerCase() === valueEmail && user.password === valuePassword
  );

  if (!foundUser) {
    alertify.error("Email o password incorrectos");
    return;
  }

  const user: IUser = {
    email: foundUser.email,
    password: foundUser.password,
    role: foundUser.role,
    loggedIn: true,
  };

  saveUser(user);

  if (foundUser.role === "admin") {
    navigate("../../admin/home/home.html");
    return;
  }

  navigate("../../client/home/home.html");
});
