
import React, { Fragment } from 'react';

export function FormErrors({ errors }) {

    return (
        <Fragment>
            { errors instanceof Array && errors.length ? (
                <ul className="invalid-feedback d-block list-unstyled mb-0">
                    {errors.map(errorText => (<li key={errorText}>{errorText}</li>))} 
                </ul>
            ) : (
                null
            )}
        </Fragment>
    )
}
