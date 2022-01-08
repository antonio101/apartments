import React, { useState, Fragment, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { FormErrors } from '../FormErrors';
import { FormMainErrors } from '../FormMainErrors';
import { userLogin } from "../../utils/api";
import { authManager } from "../../utils/authManager";
import { UserContext } from "../../contexts/User";

export function Login() {

    const [elemErrors, setElemErrors]         = useState([]);
    const [mainErrors, setMainErrors]         = useState([]);
    const [redirectToHome, seRedirectToHome]  = useState(false);
    const [state, dispatch]                   = useContext(UserContext);
    const [sendingRequest, setSendingRequest] = useState(false);


    const submitLoginForm = async event => {
        event.preventDefault();

        // Prevent double submission
        if (sendingRequest) {
            return;
        }
        
        setElemErrors([]);
        setMainErrors([]);
        setSendingRequest(true);
            
        const formData = {
            email:    event.target.email.value,
            password: event.target.password.value
        };

        userLogin(formData, (result) => {
    
            if (result.status === 200 && typeof result.data.access_token !== 'undefined') {
                authManager.setToken(result.data.access_token);

                authManager.checkLoggedIn(isSuccess => {
                    const userData = isSuccess ? authManager.getUserData() : null;
                    dispatch({ type: "user_data", userData });
                    seRedirectToHome(true);
                });
            } else {
                setSendingRequest(false);
            }
    
            // If there are general errors
            if (typeof result.data.error !== 'undefined') {
                setMainErrors([result.data.error]);
            }
    
            // If there are errors for any field
            if (typeof result.data.errors !== 'undefined') {
                setElemErrors(result.data.errors);
            }
        });
    
    }

    return (
        <Fragment>
            { /* TODO: Maybe, doing it here, is not the best way to do it */ }
            { redirectToHome ? (
                <Navigate replace to="/" />
            ) : (
                null
            )}
            <h1 className="h4 mb-3">Login</h1>

            <FormMainErrors errors={mainErrors} />

            <form className="bg-light p-3 border rounded" onSubmit={submitLoginForm}>
                <div className="form-group row">
                    <label htmlFor="email_field" className="col-sm-2 col-form-label">Email</label>
                    <div className="col-sm-10">
                        <input type="email" name="email" className="form-control" id="email_field" placeholder="Email" />
                        <FormErrors errors={elemErrors.email} />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="password_field" className="col-sm-2 col-form-label">Password</label>
                    <div className="col-sm-10">
                        <input type="password" name="password" className="form-control" id="password_field" placeholder="Password" />
                        <FormErrors errors={elemErrors.password} />
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-10">
                        <button type="submit" className="btn btn-primary" disabled={sendingRequest}>
                            { sendingRequest ? (
                                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                            ) : (
                                null
                            ) }
                            Login
                        </button>
                    </div>
                </div>
            </form>
        </Fragment>
    )
}
