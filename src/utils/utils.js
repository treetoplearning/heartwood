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

export const doneLoading = (loading) => {
  loading = false
}

export const getEndpointPrefix = () => {
  if (typeof process.env.GATSBY_MODE === "undefined") {
    return "https://develop.api.treetoplearning.org"
  }
  return process.env.GATSBY_PHLOEM_ENDPOINT
}

export const getCurrentAddress = () => {
  if (typeof process.env.GATSBY_MODE === "undefined") {
    return "http://localhost:8000"
  }
  return process.env.GATSBY_HEARTWOOD_URL
}

export const validateEmail = (email) => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true
  }
  return false
}

// take in a list of element refs and set each's border-color style to red
export const setBorderRed = (elementRefs) => {
  for (let x = 0; x < elementRefs.length; x++) {
    elementRefs[x].current.style.borderColor = "#F56565"
  }
}

// take in a list of element refs and remove each's border-color style
export const removeBorderColor = (elementRefs) => {
  for (let x = 0; x < elementRefs.length; x++) {
    elementRefs[x].current.style.borderColor = "#e2e8f0"
  }
}
