
// Context API is used to manage and share global state (like authentication data) across the entire application 
// without passing props manually through 
// every component level (avoiding "prop drilling").
// In this project, AuthContext stores the logged-in user's 
// information (user) and 
// the authentication loading status (loading), 
// making it accessible to any component — such as the Navbar, 
// Protected Routes, or Dashboard — directly via the useContext hook.

import { createContext, useState } from "react";
import { getMe } from "./services/auth.api";

// in this function we will create a context
export const AuthContext = createContext({

})

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    

    return (
        <AuthContext.Provider value={{user, setUser, loading, setLoading}} >
            {children}
        </AuthContext.Provider>
    )
}