import { useState, useEffect, createContext, useContext } from "react";
import { NotificationManager } from "react-notifications";
import { BackendApi } from "../client/backend-api";

const UserContext = createContext({
    user: null,
    loginUser: () => {},
    logoutUser: () => {},
    isAdmin: false
});

const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        setIsAdmin(user && user.role === 'admin');
    }, [user]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const { user, error } = await BackendApi.user.getProfile();
                if (error) {
                    console.error(error);
                } else {
                    setUser(user);
                }
            } catch (error) {
                console.error(error);
            }
        };
        
        fetchUserProfile();
    }, []);

    const loginUser = async (username, password) => {
        try {
            const { user, error } = await BackendApi.user.login(username, password);
            if (error) {
                NotificationManager.error(error);
            } else {
                NotificationManager.success("Logged in successfully");
                setUser(user);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const logoutUser = async () => {
        try {
            setUser(null);
            await BackendApi.user.logout();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <UserContext.Provider value={{ user, loginUser, logoutUser, isAdmin }}>
            {children}
        </UserContext.Provider>
    );
};

export { useUser, UserProvider };
