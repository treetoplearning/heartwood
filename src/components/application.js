import React, { useContext } from "react";
import { Router } from "@reach/router";
import SignIn from "../pages/signin";
import ProfilePage from "./ProfilePage";
import { HeartwoodStateContext, HeartwoodDispatchContext } from "../state/HeartwoodContextProvider";
import PasswordReset from "../pages/passwordreset";

function Application() {
  const state = useContext(HeartwoodStateContext);
  const dispatch = useContext(HeartwoodDispatchContext);
  const user = state.user;

  return (
        user ?
        <ProfilePage />
      :
        <Router>
          
          <SignIn path="/" />
          <PasswordReset path = "passwordReset" />
        </Router>
      
  );
}

export default Application;