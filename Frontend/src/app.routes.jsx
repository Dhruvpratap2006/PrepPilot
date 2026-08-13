// in this file we are going to add all the routes code
// basically we are going to take help of react-router dom for our navigation
import Protected from "./features/auth_features/components/Protected";
import {Login} from "./features/auth_features/pages/Login";
import {Register} from "./features/auth_features/pages/Register";
import Home from "./features/interview/pages/Home";

import { createBrowserRouter } from "react-router";
import Interview from "./features/interview/pages/Interview";

export const router = createBrowserRouter([
    {
        path : "/",
        element : <Protected><Home /></Protected>
    },
    {
        // path /login show <Login /> element
        path : "/login",
        element : <Login />
    },
    {
        // path /register show <Login /> element
        path : "/register",
        element :  <Register />
    }, 
    {
        // path for interview 
        path : "/interview/:interviewId",
        element : <Protected><Interview /></Protected>
    }
])