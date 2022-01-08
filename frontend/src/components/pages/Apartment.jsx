import React, { useState, useEffect, useContext, Fragment } from "react";
import { useParams } from "react-router-dom";
import { getApartment } from "../../utils/api";
import { ApartmentElem } from "../apartments/ApartmentElem";
import { BookApartment } from "../apartments/BookApartment";
import { ManageBookingRequests } from "../apartments/ManageBookingRequests";
import { UserContext } from "../../contexts/User";

export function Apartment() {

    const {apartmentId}             = useParams();
    const [apartment,setApartment ] = useState(null);
    const [state, dispatch ]        = useContext(UserContext);

    const setConfirmedBooking = (bookingId) => {
        bookingId                 = parseInt(bookingId);
        const clonedApartment     = { ...apartment };
        const selectedBooking     = clonedApartment.bookings.find((booking) => booking.id === bookingId);
        selectedBooking.approved  = true;
        clonedApartment.available = false;

        setApartment(clonedApartment);
    };

    useEffect(() => {
        getApartment(apartmentId, (result) => {

            if (result.status == 200) {
                setApartment(result.data);
            } else {
                setApartment(false);
            }
        });
    }, []);

    return (
        <Fragment>
            <h1 className="h4 mb-3">Apartment</h1>

            { apartment === null ? (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )
            : apartment === false ? (
                <div className="alert alert-secondary" role="alert">
                    Apartment not found.
                </div>
            )
            : (
                <Fragment>
                    <div className="list-group mb-3">
                        <ApartmentElem apartment={apartment} />
                    </div>
                    { /*if this user is the landlord*/ }
                    { state.userData !== null && state.userData.id == apartment.user.id ? (
                        <Fragment>
                            <h3 className="h5 mb-3">Booking requests</h3>
                            <ManageBookingRequests apartment={apartment} setConfirmedBooking={setConfirmedBooking} />
                        </Fragment>
                    )
                    : (
                        <Fragment>
                            <h3 className="h5 mb-3">Book it</h3>
                            <BookApartment apartment={apartment} />
                        </Fragment>
                     )}

                </Fragment>
            )}
        </Fragment>
    )
}
