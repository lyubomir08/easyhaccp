export function setUserData(userData) {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
}

export function getUserData() {
    return JSON.parse(localStorage.getItem("user"));
}

export function getToken() {
    return localStorage.getItem("token");
}

export function getUserRole() {
    const user = getUserData();
    return user ? user.role : "guest";
}

export function clearUserData() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
}