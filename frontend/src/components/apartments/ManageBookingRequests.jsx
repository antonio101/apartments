import React, { useState, useEffect, Fragment } from "react";
import { FormMainErrors } from '../FormMainErrors';
import { confirmBooking } from "../../utils/api";
import { getApartmentBookings } from "../../utils/api";

export function ManageBookingRequests({ apartment, setConfirmedBooking }) {

    const [mainErrors, setMainErrors]             = useState([]);
    const [sendingRequest, setSendingRequest]     = useState(false);
    const [sendingBookingId, setSendingBookingId] = useState(null);
    const [bookings, setBookings] = useState(null);

    useEffect(() => {
        getApartmentBookings(apartment.id, (result) => {

            if (result.status == 200) {

                result.data.forEach(function(booking) {
                    booking.createdAtObj = new Date(booking.created_at);
                });

                setBookings(result.data);
            } else {
                setBookings({});
            }
        });
    }, []);

    const confirmBookingApartment = (event) => {

        // Prevent double submission
        if (sendingRequest) {
            return;
        }
        
        setSendingRequest(true);
        setSendingBookingId(event.target.getAttribute('data-id'));
        
        const bookingId = event.target.getAttribute('data-id');
        
        setMainErrors([]);
        
        confirmBooking(apartment.id, bookingId, (result) => {
            
            setSendingRequest(false);
            setSendingBookingId(null);
    
            // If the booking confirmation has been made
            if (result.status === 200) {
                setConfirmedBooking(bookingId);
            }
  
            // If there are general errors
            if (typeof result.data.error !== 'undefined') {
                setMainErrors([result.data.error]);
            }
    
        });
        
    }

    return (
        <Fragment>
            { bookings === null ? (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )
            : !bookings.length ? (
                <div className="alert alert-secondary" role="alert">
                    No booking requests found.
                </div>
            )
            : (

                <Fragment>
                    <FormMainErrors errors={mainErrors} />
        
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Requested on</th>
                                <th scope="col">Applicant</th>
                                <th scope="col">Birthday</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            { bookings.map((booking) => (
                                
                                <tr key={booking.id + booking.created_at}>
                                    <td>{booking.createdAtObj.toISOString().split('T')[0]}</td>
                                    <td>{booking.name}</td>
                                    <td>{booking.birthday}</td>
                                    <td>
                                        { booking.approved ? (
                                            <div className="text-success">Confirmed</div>
                                        ) : apartment.available ? (
                                            <button className="btn btn-primary btn-sm" onClick={confirmBookingApartment} data-id={booking.id} disabled={sendingRequest}>
                                                { sendingBookingId == booking.id ? (
                                                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                                ) : (
                                                    null
                                                ) }
                                                Confirm
                                            </button>
                                        ) : (
                                            null
                                        )}
                                    </td>
                                </tr>
                            ))}
        
                        </tbody>
                    </table>
                </Fragment>
            )}
        </Fragment>

    )
}
