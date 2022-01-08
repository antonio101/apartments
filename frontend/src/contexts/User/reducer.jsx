export const reducer = (state, action) => {
    
    switch (action.type) {
        case "user_data":
            return {
                ...state,
                userData: action.userData
            }

        default:
            return state
    }
}

export const initialState = {
    userData: null
}