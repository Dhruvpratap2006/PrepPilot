// in this file we are going to add all the routes code
// basically we are going to take help of react-router dom for our navigation
import {Login} from "./features/auth_features/pages/Login";
import {Register} from "./features/auth_features/pages/Register";

import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
    {
        path : "/",
        element : <Login />
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
    }
])