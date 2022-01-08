
import React, { Fragment } from 'react';

export function FormMainErrors({ errors }) {

    return (
        <Fragment>
            { errors instanceof Array && errors.length ? (
                <ul className="alert alert-danger list-unstyled">
                    {errors.map(errorText => (<li key={errorText}>{errorText}</li>))} 
                </ul>
            ) : (
                null
            )}
        </Fragment>
    )
}
