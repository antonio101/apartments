import React, { useState, useEffect, Fragment } from "react";
import { Navigate } from "react-router-dom";
import { FormErrors } from '../FormErrors';
import { FormMainErrors } from '../FormMainErrors';
import { insertApartment, getFeatures } from "../../utils/api";

export function NewApartmentForm() {

    const [elemErrors, setElemErrors]                    = useState([]);
    const [mainErrors, setMainErrors]                    = useState([]);
    const [features, setFeatures]                        = useState(null);
    const [redirectToApartments, seRedirectToApartments] = useState(false);
    const [sendingRequest, setSendingRequest]            = useState(false);

    useEffect(() => {
        getFeatures((result) => {
            console.log(result);
            setFeatures(result.data);
        });
    }, []);

    const postApartment = async event => {
        event.preventDefault();

        // Prevent double submission
        if (sendingRequest) {
            return;
        }
        
        setElemErrors([]);
        setMainErrors([]);
        setSendingRequest(true);
            
        const formData = {
            title:       event.target.title.value,
            description: event.target.description.value,
            features:    []
        };

        let featuresCheckboxes = document.querySelectorAll('input[name=features]:checked');

        for (var i = 0; i < featuresCheckboxes.length; i++) {
            formData.features.push(featuresCheckboxes[i].value)
        }
        
        insertApartment(formData, (result) => {
            setSendingRequest(false);
    
            // If the apartment has been published, the user will be redirected to the apartments' listing
            if (result.status === 201) {
                seRedirectToApartments(true);
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
            { redirectToApartments ? (
                <Navigate replace to="/apartments" />
            ) : (
                null
            )}
            <h1 className="h4 mb-3">Publish an apartment</h1>

            <FormMainErrors errors={mainErrors} />

            <form className="bg-light p-3 border rounded" onSubmit={postApartment}>
                <div className="form-group row">
                    <label htmlFor="title_field" className="col-sm-2 col-form-label">Title</label>
                    <div className="col-sm-10">
                        <input type="text" name="title" className="form-control" id="title_field" placeholder="Title" />
                        <FormErrors errors={elemErrors.title} />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="description_field" className="col-sm-2 col-form-label">Description</label>
                    <div className="col-sm-10">
                        <textarea className="form-control" name="description" id="description_field" placeholder="Description"></textarea>
                        <FormErrors errors={elemErrors.description} />
                    </div>
                </div>
                <fieldset className="form-group">
                    <div className="row">
                        <legend className="col-form-label col-sm-2 pt-0">Features</legend>
                        
                        <div className="col-sm-10">

                            { features === null ? (
                                <div className="spinner-border text-primary" style={{width: "1.4em", height: "1.4em"}} role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            )
                            : features.length ? (
                                
                                features.map((feature) => (
                                    <div className="form-check" key={feature.id}>
                                        <input className="form-check-input" name="features" value={feature.id} type="checkbox" id={`feature_${feature.id}`} />
                                        <label className="form-check-label" htmlFor={`feature_${feature.id}`}> {feature.name} </label>
                                    </div>
                                ))

                            ) : (
                                null
                            )}
                        </div>
                    </div>
                </fieldset>
                <div className="form-group row">
                    <div className="col-sm-10">
                        <button type="submit" className="btn btn-primary" disabled={sendingRequest || features === null}>
                            { sendingRequest ? (
                                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                            ) : (
                                null
                            ) }
                            Publish
                        </button>
                    </div>
                </div>
            </form>
        </Fragment>
    )
}
