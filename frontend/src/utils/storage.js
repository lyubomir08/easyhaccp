const USER_KEY = "user";
const TOKEN_KEY = "token";

export function setUserData(userData) {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    localStorage.setItem(TOKEN_KEY, userData.token);
}

export function getUserData() {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function getUserRole() {
    const user = getUserData();
    return user ? user.role : "guest";
}

export function clearUserData() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
}