import { getUserProfile as requestUserProfile } from "./api";

function authManagerFn() {

    const setToken = (token) => {
        localStorage.setItem('access_token', JSON.stringify(token));
    };

    const setUserData = (data) => {
        localStorage.setItem('user_data', JSON.stringify(data));
    };
    
    const getToken = () => {
        return JSON.parse(localStorage.getItem('access_token'));
    };
    
    const getUserData = () => {
        return JSON.parse(localStorage.getItem('user_data'));
    };
    
    const isLoggedIn = () => {
        let token = getToken();

        if (token === null || token === '') {
            return false;
        }

        let userData = getUserData();

        if (userData === null || userData.length === 0) {
            return false;
        }

        return true;
    };
    
    const logout = () => {
        setToken(null);
        setUserData(null);
    };
    
    const checkLoggedIn = (onComplete) => {

        if (typeof onComplete !== 'function') {
            onComplete = (isSuccess) => {};
        }

        let token = getToken();

        if (token === null || token === '') {
            logout();
            onComplete(false);
            return;
        }
        
        requestUserProfile(result => {

            if (result.status == 200) {
                setUserData(result.data);
                onComplete(true);
                return;
            }
            
            logout();
            onComplete(false);
        });

    };

    return {
        setToken,
        setUserData,
        getToken,
        getUserData,
        isLoggedIn,
        checkLoggedIn,
        logout,
    };
}

export var authManager = authManagerFn();