import React, { useContext, useEffect } from "react";
import Navbar from "../components/navbar";
import { navigate } from "@reach/router";

import {
  HeartwoodStateContext,
  HeartwoodDispatchContext,
} from "../state/HeartwoodContextProvider";
import ProfilePage from "../components/profilepage";

import SignIn from "./signin";

const IndexPage = () => {
  const state = useContext(HeartwoodStateContext);
  const dispatch = useContext(HeartwoodDispatchContext);

  return (
    <div className="flex flex-col w-full h-auto h-screen pb-40 bg-base">
      <Navbar />

      {state.user ? console.log('user is valid'): console.log("user is null")}
      {state.user ? console.log('user is valid'): console.log("user is null")}
    </div>
  );
};

export default IndexPage;
