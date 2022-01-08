import React, { useState, useEffect, useContext, Fragment } from "react";
import { getApartments } from "../../utils/api";
import { ApartmentElem } from "../apartments/ApartmentElem";
import { getFeatures } from "../../utils/api";

export function Apartments() {

    const [apartments, setApartments] = useState(null);
    const [features, setFeatures]     = useState(null);

    useEffect(() => {
        getApartments(null, (result) => {
            setApartments(result.data);
        });
        
        getFeatures((result) => {
            setFeatures(result.data);
        });
    }, []);

    const onFeaturesChange = (event) => {

        const formData = {
            features:    []
        };

        let featuresCheckboxes = document.querySelectorAll('input[name=features]:checked');

        for (var i = 0; i < featuresCheckboxes.length; i++) {
            formData.features.push(featuresCheckboxes[i].value)
        }

        // Another option is filtering the results without calling the API again
        getApartments(formData, (result) => {
            setApartments(result.data);
        });
        
    };

    return (
        <Fragment>
            <h1 className="h4 mb-3">Apartments</h1>

            <div>
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
                                    <div className="form-check d-inline-block mr-3" key={feature.id}>
                                        <input className="form-check-input" name="features" value={feature.id} type="checkbox" id={`feature_${feature.id}`} onChange={onFeaturesChange} />
                                        <label className="form-check-label" htmlFor={`feature_${feature.id}`}> {feature.name} </label>
                                    </div>
                                ))

                            ) : (
                                null
                            )}

                        </div>
                    </div>
                </fieldset>
            </div>

            { apartments === null ? (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )
            : apartments === [] ? (
                <div className="alert alert-secondary" role="alert">
                    No results found.
                </div>
            ) : (
                <div className="list-group mb-3">
                    { apartments.map((apartment) => (
                        <ApartmentElem key={apartment.id + apartment.title}  apartment={apartment} />
                    ))}
                </div>
            )}

        </Fragment>
    )
}
