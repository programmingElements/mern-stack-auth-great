import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUserInfo, isUserLoggedIn } from "../services/user.services";

export const AppContext = createContext();

export const AppProvider = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);

    const getAuthState = async () => {
        try {
            const {data} = await isUserLoggedIn();
            if (data.success) {
                setIsLoggedIn(true);
                getUserDetails();
            }
        } catch (error) {
            // console.log(error);
            toast.error(error.message);
            throw new Error(error.message);
        }
      }

    const getUserDetails = async () => {
        try {
            const {data} = await getUserInfo();
            if (data.success) {
                setUserData(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(data.message);
            throw new Error(error.message);
        }
    }

    useEffect(() => {
            getAuthState();
    }, [])
    
    const value = {
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserDetails
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContext;