import {useContext, useEffect, useState} from "react";
import {AuthContext} from "../auth.context";
import { registerUser, loginUser, logoutUser, getMe } from "../services/auth.api";

export const useAuth = () => {

    const contex = useContext(AuthContext);
    const {user, setUser, loading, setLoading} = contex;
    const [error, setError] = useState(null);

        const handleLogin = async ({email, password}) => {
        setLoading(true);
        setError(null);
        try {
            const data = await loginUser({email, password})

            // now in this data user details from backend will come
            // so we can set this in setUser function to update the user state in context
            setUser(data.user);
            return data.user;
        } catch(err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
            return null;
        } finally {
            setLoading(false);
        }
    }

    const handleRegister = async({username, email, password}) => {

    setLoading(true);
    setError(null);
    try {
        const data = await registerUser({username, email, password});
        setUser(data.user);
        return data.user;
    } catch(err) {
        setError(err.response?.data?.message || "Registration failed. Please try again.");
        return null;
    } finally {
        setLoading(false);
    }
    
}


    const handleLogout = async() => {

        setLoading(true);
        try {
            const data = await logoutUser();
            setUser(null);
        } catch(err) {
            setError(err.response?.data?.message || "Logout failed. Please try again.");
        } finally {
            setLoading(false);
        }
        const data = await logoutUser();
        setUser(null);
        
    }

    useEffect(() => {
        const getAndSetUser = async () => {

            try {

                const data = await getMe();
                setUser(data.user)

            } catch(err) {
                
            } finally {
                setLoading(false)
            }
        }

        getAndSetUser();
        
    }, [])
return {user, loading, error, handleLogin, handleRegister, handleLogout}
}