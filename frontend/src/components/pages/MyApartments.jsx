import React, { useState, useEffect, useContext, Fragment } from "react";
import { Link } from "react-router-dom";
import { getApartments } from "../../utils/api";
import { ApartmentElem } from "../apartments/ApartmentElem";
import { UserContext } from "../../contexts/User";

export function MyApartments() {

    const [apartments, setApartments] = useState(null);
    const [ state, dispatch ]         = useContext(UserContext);


    useEffect(() => {
        if (state.userData !== null) {
            
            getApartments({user_id: state.userData.id}, (result) => {
                setApartments(result.data);
            });
        }
    }, [state]);

    return (
        <Fragment>
            

            { apartments !== null ? (
                <Fragment>
                    <h1 className="h4 mb-3">My apartments</h1>

                    <div className="mb-3 d-flex flex-row-reverse">
                        <Link className="btn btn-primary" to="/apartments/new" role="button">Publish apartment</Link>
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
            ) : (
                null
            )}

        </Fragment>
    )
}
