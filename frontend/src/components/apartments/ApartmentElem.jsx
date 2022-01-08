import React from 'react'
import { Link } from "react-router-dom";

export function ApartmentElem({ apartment }) {
    return (
        <Link to={`/apartments/${apartment.id}`} className="list-group-item list-group-item-action flex-column align-items-start">
            <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{apartment.title}</h5>
                <small className="text-muted">{apartment.user.name}</small>
            </div>
            <p className="mb-1 text-muted mt-2">{apartment.description}</p>
            <ul className="list-inline m-0 float-left">
                { apartment.features.map((feature) => (
                    <li className="list-inline-item" key={feature.id}>
                        <small className="text-muted">{feature.name}</small>
                    </li>
                ))}
            </ul>
            {apartment.available ?
            (
                <span className="badge badge-success float-right px-2 py-1">Available</span>
            ) : (
                <span className="badge badge-danger float-right px-2 py-1">Not available</span>
            )}
        </Link>
    )
}
