import React from 'react'
import { Route , Navigate } from "react-router-dom";
import { authManager } from "../../utils/authManager";

export const GuestsRoute = ({ children }) => {
    return !authManager.isLoggedIn() ? children : <Navigate replace to="/" />;
};