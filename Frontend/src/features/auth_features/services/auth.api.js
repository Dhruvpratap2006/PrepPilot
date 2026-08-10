import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:3000",
    // jab hum axios se request bhejte hain, to by default browser cookies ko 
            // automatically attach nahi karta request ke saath (especially cross-origin requests mein)
            // isliye backend tak cookie pahunchti hi nahi
            // withCredentials: true likhne se axios ko pata chalta hai ki cookies ko bhi
            // request ke saath bhejo aur backend se aane wali cookies ko bhi accept karo
    withCredentials : true,
})

// register user
export async function registerUser({ username, email, password }) {

    try {
        // registerUser function mein humein sirf ye teen cheeze chahiye: username, email, password
        const response = await api.post('/api/auth/register', {
            username, email, password
        })

        return response.data;

    } catch(err) {

        console.log('Register API error:', err);
        throw err; 
    }
}

// login user
export async function loginUser({ email, password }) {
    try {
        const response = await api.post('/api/auth/login', {
            email, password
        })

        return response.data;
    } catch (error) {
        console.error('Login API error:', error);
        throw error;
    }
}

// logout user
export async function logoutUser() {
    try {
        const response = await api.get('/api/auth/logout');

        return response.data;
    } catch (error) {
        console.error('Logout API error:', error);
        throw error;
    }
}

// get current user
export async function getMe() {
    try {
        const response = await api.get('/api/auth/get-me');

        return response.data;
    } catch(error) {
        console.error('Get Me API error:', error);
        throw error;
    }
}