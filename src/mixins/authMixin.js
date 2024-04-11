export function isAuth() {
    let access_token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (access_token.length === 0) {
        localStorage.removeItem('queue')
    }
    return access_token.length !== 0;
}