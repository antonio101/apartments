import React, { Fragment, useContext, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { authManager } from "../utils/authManager"; 
import { CustomLink } from "./CustomLink"; 
import { UserContext } from "../contexts/User";

export function Layout() {
    const [ state, dispatch ] = useContext(UserContext);

    useEffect(() => {
        authManager.checkLoggedIn(isSuccess => {
            const userData = isSuccess ? authManager.getUserData() : null;
            dispatch({ type: "user_data", userData });
        });
    }, []);

    const logout = function () {
        authManager.logout();
        dispatch({ type: "user_data", userData: null });
    }
    return (
        <Fragment>
            <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <CustomLink className="nav-link" to="/">Home</CustomLink>
                        </li>
                        <li className="nav-item">
                            <CustomLink className="nav-link" to="/apartments">Apartments</CustomLink>
                        </li>
                    </ul>
                </div>

                <ul className="nav navbar-nav ml-auto flex-row ml-md-auto d-none d-md-flex">
                    { state.userData !== null ? (
                        <Fragment>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                { state.userData.name }
                                </a>
                                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                                    
                                    <Link className="dropdown-item" to="/my-apartments">My apartments</Link>
                                    <Link className="dropdown-item" to="/apartments/new">Publish apartment</Link>
                                    <span className="dropdown-item" onClick={logout}>Logout</span>
                                </div>
                            </li>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <li className="nav-item pt-1 mr-3">
                                <Link className="clearfix btn btn-light btn-sm" to="/login">Login</Link>
                            </li>
                            <li className="nav-item pt-1">
                                <Link className="clearfix btn btn-light btn-sm" to="/register">Register</Link>
                            </li>
                        </Fragment>
                    )}
                </ul>
            </nav>
            <main role="main" className="container">
                <Outlet />
            </main>

        
        </Fragment>
    )
}
