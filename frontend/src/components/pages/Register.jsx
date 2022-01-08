import React, { useState, useContext, Fragment } from "react";
import { Navigate } from "react-router-dom";
import { FormErrors } from '../FormErrors';
import { FormMainErrors } from '../FormMainErrors';
import { userRegister } from "../../utils/api";
import { authManager } from "../../utils/authManager";
import { UserContext } from "../../contexts/User";

export function Register() {

    const [elemErrors, setElemErrors]          = useState([]);
    const [mainErrors, setMainErrors]          = useState([]);
    const [state, dispatch]                    = useContext(UserContext);
    const [redirectToHome, seRedirectToHome]   = useState(false);
    const [registerSuccess, seRegisterSuccess] = useState(false);
    const [sendingRequest, setSendingRequest]  = useState(false);

    const submitRegisterForm = async event => {
        event.preventDefault();

        // Prevent double submission
        if (sendingRequest) {
            return;
        }
        
        setElemErrors([]);
        setMainErrors([]);
        setSendingRequest(true);
            
        const formData = {
            name:     event.target.name.value,
            email:    event.target.email.value,
            password: event.target.password.value
        };

        userRegister(formData, (result) => {
    
            // Logged in
            if (result.status === 201) {
                authManager.setToken(result.data.access_token);
                seRegisterSuccess(true);

                // Load user data
                authManager.checkLoggedIn(isSuccess => {
                    const userData = isSuccess ? authManager.getUserData() : null;
                    dispatch({ type: "user_data", userData });
                
                    // Redirect to home in 2 seconds
                    setTimeout(() => {
                        seRedirectToHome(true);
                    }, 2000);
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
            <h1 className="h4 mb-3">Register</h1>

            { /* TODO: Maybe, doing it here, is not the best way to do it */ }
            { redirectToHome ? (
                <Navigate replace to="/" />
            ) : registerSuccess ? (
                <div className="alert alert-secondary" role="alert">
                    Register success. Welcome!
                </div>
            ) : (
                <Fragment>
                    <FormMainErrors errors={mainErrors} />
        
                    <form className="bg-light p-3 border rounded" onSubmit={submitRegisterForm}>
                        <div className="form-group row">
                            <label htmlFor="name_field" className="col-sm-2 col-form-label">Name</label>
                            <div className="col-sm-10">
                                <input type="text" name="name" className="form-control" id="name_field" placeholder="Name" />
                                <FormErrors errors={elemErrors.name} />
                            </div>
                        </div>
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
                                    Register
                                </button>
                            </div>
                        </div>
                    </form>
                </Fragment>
            )}
        </Fragment>
    )
}
