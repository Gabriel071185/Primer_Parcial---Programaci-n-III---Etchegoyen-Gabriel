import type { IUser } from "../types/IUser";
import type { Rol } from "../types/Rol";
import { getUSer, removeUser } from "./localStorage";
import { navigate } from "./navigate";
import { clearCart } from "./cart.utils";

const INDEX_ROUTE = "/index.html";
const LOGIN_ROUTE = "/src/pages/auth/login/login.html";
const LOGGED_HOME_ROUTE = "/src/pages/client/home/home.html";
const AUTH_FLASH_KEY = "authFlash";

type AuthFlashType = "warning" | "error";

type AuthFlash = {
  type: AuthFlashType;
  message: string;
};

const isLoginRoute = (route: string): boolean => route.includes("login.html");

const setAuthFlash = (flash: AuthFlash): void => {
  sessionStorage.setItem(AUTH_FLASH_KEY, JSON.stringify(flash));
};

export const consumeAuthFlash = (): AuthFlash | null => {
  const raw = sessionStorage.getItem(AUTH_FLASH_KEY);

  if (!raw) {
    return null;
  }

  sessionStorage.removeItem(AUTH_FLASH_KEY);

  try {
    const parsed = JSON.parse(raw) as AuthFlash;

    if (!parsed?.message || !parsed?.type) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export const getAuthUser = (): IUser | null => {
  const user = getUSer();

  if (!user) {
    return null;
  }

  try {
    const parsed = JSON.parse(user) as IUser;
    return parsed.loggedIn ? parsed : null;
  } catch {
    return null;
  }
};

export const getLogoRedirectRoute = (): string => {
  const authUser = getAuthUser();
  return authUser ? LOGGED_HOME_ROUTE : INDEX_ROUTE;
};

export const setupLogoNavigation = (logoElementId: string = "logoLink"): void => {
  const logoLink = document.getElementById(logoElementId) as HTMLAnchorElement | null;

  if (!logoLink) {
    return;
  }

  const targetRoute = getLogoRedirectRoute();
  logoLink.setAttribute("href", targetRoute);

  logoLink.addEventListener("click", (event) => {
    event.preventDefault();
    navigate(getLogoRedirectRoute());
  });
};

export const protectRoute = (
  unauthenticatedRedirect: string = LOGIN_ROUTE,
  allowedRole?: Rol,
  unauthorizedRedirect?: string
): IUser | null => {
  const authUser = getAuthUser();

  if (!authUser) {
    if (isLoginRoute(unauthenticatedRedirect)) {
      setAuthFlash({
        type: "warning",
        message: "Debes iniciar sesion para acceder a esta pagina",
      });
    }

    navigate(unauthenticatedRedirect);
    return null;
  }

  if (allowedRole && authUser.role !== allowedRole) {
    const roleRedirect = unauthorizedRedirect ?? unauthenticatedRedirect;

    if (isLoginRoute(roleRedirect)) {
      setAuthFlash({
        type: "error",
        message: "No tienes permisos para acceder a esta pagina",
      });
    }

    navigate(roleRedirect);
    return null;
  }

  return authUser;
};

export const checkAuhtUser = (
  redireccion1: string,
  redireccion2: string,
  rol: Rol
) => {
  protectRoute(redireccion1, rol, redireccion2);
};



export const logout = () => {
  removeUser();
  clearCart();
  navigate(INDEX_ROUTE);
};
