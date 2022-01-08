import React, { useReducer, createContext } from "react"
import { reducer, initialState } from "./reducer"

export const UserContext = createContext({
    state: initialState,
    dispatch: () => null
});

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <UserContext.Provider value={[ state, dispatch ]}>
    	{ children }
    </UserContext.Provider>
  )
}