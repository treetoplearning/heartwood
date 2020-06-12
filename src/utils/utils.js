export const isLoggedIn = (condition) => {
  return condition
}

export const signUpComplete = (user) => {
  // first ensure the user is signed in
  if (
    isLoggedIn(user) &&
    user.userName !== "" &&
    user.userName !== null &&
    user.firstName !== "" &&
    user.lastName !== "" &&
    user.dateOfBirth !== "" &&
    user.hasOwnProperty("firstName")
  ) {
    // then ensure all of their fields are no
    return true
  }
  return false
}
