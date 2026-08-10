import {useContext, useEffect} from "react";
import {AuthContext} from "../auth.context";
import { registerUser, loginUser, logoutUser, getMe } from "../services/auth.api";

export const useAuth = () => {

    const contex = useContext(AuthContext);
    const {user, setUser, loading, setLoading} = contex;

    const handleLogin = async ({email, password}) => {
        setLoading(true);
        try {
            const data = await loginUser({email, password})

            // now in this data user details from backend will come
            // so we can set this in setUser function to update the user state in context
            setUser(data.user);
        } catch(err) {

        } finally {
            setLoading(false);
        }
        
        
    }

    const handleRegister = async({username, email, password}) => {

        setLoading(true);
        try {
            const data = await registerUser({username, email, password});
            setUser(data.user);
        } catch(err) {

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

        } finally {
            setLoading(false);
        }
        const data = await logoutUser();
        setUser(null);
        
    }

    useEffect(() => {
        const getAndSetUser = async () => {

            const data = await getMe();
            setUser(data.user)
            setLoading(false)

        }

        getAndSetUser();
        
    }, [])
    return {user, loading, handleLogin, handleRegister, handleLogout}
}