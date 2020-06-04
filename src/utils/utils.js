export const isLoggedIn = (condition) => {
  return condition
}

export const signUpComplete = (user) => {
  // first ensure the user is signed in
  if (isLoggedIn(user) && (user.userName !== "" && user.firstName !== "" && user.lastName !== "" && user.dateOfBirth !== "")) {
    // then ensure all of their fields are no
    return true
  } 
  return false
}
