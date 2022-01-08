import React, { useState, Fragment } from "react";
import { FormErrors } from '../FormErrors';
import { FormMainErrors } from '../FormMainErrors';
import { bookApartment } from "../../utils/api";

export function BookApartment({ apartment }) {

    const [elemErrors, setElemErrors]           = useState([]);
    const [mainErrors, setMainErrors]           = useState([]);
    const [bookingSuccess, setBookingSuccess]   = useState(false);
    const [sendingRequest, setSendingRequest]   = useState(false);

    const submitBookApartment = async event => {
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
            birthday: event.target.birthday.value
        };

        bookApartment(apartment.id, formData, (result) => {

            setSendingRequest(false);
    
            // If the booking has been registered
            if (result.status === 201) {
                setBookingSuccess(true);
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
            { bookingSuccess ? (
                <div className="alert alert-primary" role="alert">
                    Booking request sent.
                </div>
            ) : !apartment.available ? (
                <div className="alert alert-secondary" role="alert">
                    Apartment already booked.
                </div>
            ) :
            (
                <Fragment>
                    <FormMainErrors errors={mainErrors} />

                    <form className="bg-light p-3 border rounded" onSubmit={submitBookApartment}>
                        <div className="form-group row">
                            <label htmlFor="name_field" className="col-sm-2 col-form-label">Name</label>
                            <div className="col-sm-10">
                                <input type="text" name="name" className="form-control" id="name_field" placeholder="Name" />
                                <FormErrors errors={elemErrors.name} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="birthday_field" className="col-sm-2 col-form-label">Birthday</label>
                            <div className="col-sm-10">
                                <input type="date" name="birthday" className="form-control" id="birthday_field" placeholder="Birthday" />
                                <FormErrors errors={elemErrors.birthday} />
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
                                    Request booking
                                </button>
                            </div>
                        </div>
                    </form>
            </Fragment>
            )}
        </Fragment>

    )
}
