// basically here we are going to write the code for protecting the route
// means if the user is not logged in and then also user is trying to access 
// the protected route then we will redirect it to login page or signup page

import { useAuth } from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router";

const Protected = ({children}) => {

    const { loading, user } = useAuth();
    const location = useLocation();

    if(loading) {
        return (<main>Loading...</main>)
    }

    // if current user is not logged in then we will redirect it to login page,
    // remembering where they were trying to go so Login.jsx can send them
    // back there after a successful login
    if(!user) {
        return <Navigate to="/login" state={{ from: location.pathname }} />;
    }

  return children;
}

export default Protected