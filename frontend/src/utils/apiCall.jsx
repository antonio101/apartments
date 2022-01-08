import React from "react";
import axiosWithHeaders from "./axiosWithHeaders";

function apiCallFn() {

    const baseURL = process.env.REACT_APP_API_URL;
    
    var response = {
        data: null,
        error: null,
        isSuccess: false
    };

    const responseFromSuccess = (res, onComplete) => {
        onComplete({
            ...response,
            data: res.data,
            isSuccess: true,
            status: res.status
        });
    };

    const responseFromError = (err, onComplete) => {
        
        onComplete({
            ...response,
            data: err.response.data,
            error: err.message,
            status: err.response.status
        });
    };
    
    // Handles POST Requests
    const postRequest = (endpoint, data, onComplete) => {
        
        axiosWithHeaders().post(`${baseURL}/${endpoint}`, data)
        .then(function (response) {
            responseFromSuccess(response, onComplete);
        })
        .catch(function (error) {
            console.log(`${error}`);
            console.log(error.response.data);
            console.log(error.response.status);
            responseFromError(error, onComplete);
        });
    };
    
    // Handles GET Requests
    const getRequest = (endpoint, data, onComplete) => {

        let config = {};

        if(typeof data === 'object') {
            config.params = data;
        }
        
        axiosWithHeaders().get(`${baseURL}/${endpoint}`, config)
        .then(function (response) {
            responseFromSuccess(response, onComplete);
        })
        .catch(function (error) {
            console.log(`${error}`);
            responseFromError(error, onComplete);
        });
    };
    
    // Handles PUT Requests
    const putRequest = (endpoint, data, onComplete) => {
        
        axiosWithHeaders().put(`${baseURL}/${endpoint}`, data)
        .then(function (response) {
            responseFromSuccess(response, onComplete);
        })
        .catch(function (error) {
            console.log(`${error}`);
            responseFromError(error, onComplete);
        });
    };
    
    // Handles DELETE Requests
    const deleteRequest = (endpoint, onComplete) => {
        
        axiosWithHeaders().delete(`${baseURL}/${endpoint}`)
        .then(function (response) {
            responseFromSuccess(response, onComplete);
        })
        .catch(function (error) {
            console.log(`${error}`);
            responseFromError(error, onComplete);
        });
    };

    return {
        post:    postRequest,
        get:     getRequest,
        put:     putRequest,
        delete:  deleteRequest
    };
}

export var apiCall = apiCallFn();