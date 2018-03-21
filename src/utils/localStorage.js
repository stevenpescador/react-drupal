export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('current_user')
    if (serializedState === null) {
      return undefined
    }
    const currentUser = JSON.parse(serializedState)
    currentUser.isAuthenticated = true
    return currentUser
  } catch (err) {
    return undefined
  }
}