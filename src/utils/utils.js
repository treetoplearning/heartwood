export const isLoggedIn = (condition) => {
  return condition
}

export const signUpComplete = (user) => {
  // first ensure the user is signed in
  console.log('user object in signUpComplete is', user)
  if (isLoggedIn(user) && (user.userName !== "" && user.userName !== null && user.firstName !== ""  && user.lastName !== ""  && user.dateOfBirth !== "" && user.hasOwnProperty('firstName'))) {
    // then ensure all of their fields are no
    return true
  } 
  return false
}
