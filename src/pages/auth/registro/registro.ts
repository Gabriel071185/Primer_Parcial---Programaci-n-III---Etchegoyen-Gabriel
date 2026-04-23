import type { IUser } from "../../../types/IUser";
import { navigate } from "../../../utils/navigate";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.min.css";

type StoredUser = IUser & {
	name: string;
	createdAt: string;
};

const USERS_KEY = "usersData";

const registerForm = document.getElementById("registerForm") as HTMLFormElement;
const nameInput = document.getElementById("name") as HTMLInputElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const confirmPasswordInput = document.getElementById("confirmPassword") as HTMLInputElement;

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

function saveStoredUsers(users: StoredUser[]): void {
	localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function alreadyExists(email: string, users: StoredUser[]): boolean {
	const normalizedEmail = email.trim().toLowerCase();
	return users.some((user) => user.email.trim().toLowerCase() === normalizedEmail);
}

registerForm?.addEventListener("submit", (event: SubmitEvent) => {
	event.preventDefault();

	const name = nameInput.value.trim();
	const email = emailInput.value.trim();
	const password = passwordInput.value;
	const confirmPassword = confirmPasswordInput.value;

	if (name.length < 2) {
		alertify.error("Ingresa un nombre valido");
		return;
	}

	if (password.length < 6) {
		alertify.error("La contraseña debe tener al menos 6 caracteres");
		return;
	}

	if (password !== confirmPassword) {
		alertify.error("Las contraseñas no coinciden");
		return;
	}

	const users = getStoredUsers();

	if (alreadyExists(email, users)) {
		alertify.warning("Este email ya esta registrado");
		return;
	}

	const newUser: StoredUser = {
		name,
		email,
		password,
		role: "client",
		loggedIn: false,
		createdAt: new Date().toISOString(),
	};

	users.push(newUser);
	saveStoredUsers(users);

	registerForm.reset();
	alertify.success("Registro exitoso. Ahora puedes iniciar sesion");

	window.setTimeout(() => {
		navigate("/src/pages/auth/login/login.html");
	}, 900);
});
