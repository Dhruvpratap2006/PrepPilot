// basically here we are going to write the code for protecting the route
// means if the user is not logged in and then also user is trying to access 
// the protected route then we will redirect it to login page or signup page

import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";



const Protected = ({children}) => {

    const { loading, user } = useAuth();

    if(loading) {
        return (<main>Loading...</main>)
    }

    // if current user is not logged in then we will redirect it to login page
    if(!user) {
        return <Navigate to="/login" />;
    }

  return children;
}

export default Protected
