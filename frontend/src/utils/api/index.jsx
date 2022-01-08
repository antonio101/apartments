import { apiCall } from "../apiCall";

/* ------ Aparments ------ */
export const insertApartment = (data, onComplete) => {
    apiCall.post('apartments', data, onComplete);
};
export const getApartments = (data, onComplete) => {
    apiCall.get('apartments', data, onComplete);
};
export const getApartment = (apartmentId, onComplete) => {
    apiCall.get(`apartments/${apartmentId}`, null, onComplete);
};

/* ------ Bookings ------ */
export const bookApartment = (apartmentId, data, onComplete) => {
    const dataToSend = {...data, apartment_id: apartmentId};
    apiCall.post(`bookings`, dataToSend, onComplete);
};
export const confirmBooking = (apartmentId, bookingId, onComplete) => {
    const dataToSend = {apartment_id: apartmentId, approved: true};
    apiCall.put(`bookings/${bookingId}`, dataToSend, onComplete);
};
export const getApartmentBookings = (apartmentId, onComplete) => {
    apiCall.get(`bookings`, {apartment_id: apartmentId}, onComplete);
};

/* ------ Users ------ */
export const userLogin = (data, onComplete) => {
    apiCall.post('login', data, onComplete);
};
export const getUserProfile = (onComplete) => {
    apiCall.get(`profile`, null, onComplete);
};
export const userRegister = (data, onComplete) => {
    apiCall.post('register', data, onComplete);
};

/* ------ Features ------ */
export const getFeatures = (onComplete) => {
    apiCall.get('features', null, onComplete);
};