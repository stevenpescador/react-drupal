export function loginUser ({username, password}) {
  let config = {
    method: 'POST',
    headers: { 'Content-Type':'application/x-www-form-urlencoded' },
    body: `username=${username}&password=${password}`
  }
}