
import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();


export const AuthProvider = ({children}) => {
    const [refresh, setRefresh] = useState(0)

    
    return <AuthContext.Provider value={{refresh, setRefresh}} >{children}</AuthContext.Provider>
}

export const useRefreshUserData = () => {
    const auth = useContext(AuthContext);

    function refreshUser() {
        auth.setRefresh(prev => prev + 1)
    }

    return { refreshUser, refresh: auth.refresh }
}