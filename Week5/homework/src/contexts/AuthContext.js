// Importing necessary hooks and functionalities
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Creating a context for authentication. Contexts provide a way to pass data through 
// the component tree without having to pass props down manually at every level.
const AuthContext = createContext();

// This is a custom hook that we'll use to easily access our authentication context from other components.
export const useAuth = () => {
    return useContext(AuthContext);
};

// This is our authentication provider component.
// It uses the context to provide authentication-related data and functions to its children components.
export function AuthProvider({ children }) {
    const navigate = useNavigate();
    
    const [currentUser, setCurrentUser] = useState(localStorage.getItem("username"))
    const [loginError, setLoginError] = useState(null)

    const VALID_USERNAME = 'hantao'
    const VALID_PASSWORD = '123456'

    // Login function that validates the provided username and password.
    const login = (username, password) => {
        if(username === VALID_USERNAME && password === VALID_PASSWORD){
            setCurrentUser(username)
            localStorage.setItem("username", username)
            navigate("/")
        }
        else{
            setLoginError("ERROR: FAILED TO LOGIN")
        }
    };

    // Logout function to clear user data and redirect to the login page.
    const logout = () => {
        setCurrentUser(null)
        setLoginError(null)
        localStorage.removeItem("username")
        navigate("/login")
    };

    // An object containing our state and functions related to authentication.
    // By using this context, child components can easily access and use these without prop drilling.
    const contextValue = {
        currentUser,
        login,
        logout,
        loginError
    };

    // The AuthProvider component uses the AuthContext.Provider to wrap its children.
    // This makes the contextValue available to all children and grandchildren.
    // Instead of manually passing down data and functions, components inside this provider can
    // simply use the useAuth() hook to access anything they need.
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}