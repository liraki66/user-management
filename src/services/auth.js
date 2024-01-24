import React, {createContext, useContext, useEffect, useMemo, useState} from "react";
import axios from "axios";
import qs from 'qs'
import {keycloakBaseUrl, keycloakLoginUrl, getCurrentUserUrl} from "./constants";
import {useLocation, useNavigate} from "react-router-dom";
import jwt_decode from "jwt-decode";

//////////////////// login function ////////////////////////

export async function login(data) {
    const response = await axios.post(keycloakLoginUrl, qs.stringify({...data}),
        {baseURL: keycloakBaseUrl, headers: {'content-type': 'application/x-www-form-urlencoded'}});

    return response.data;
}

/////////////////// logout function ////////////////////////

export async function logout() {
    const response = await axios.delete(keycloakLoginUrl, {baseURL: keycloakBaseUrl});

    return response.data.data;
}

///////////////////// get current auth info //////////////////////

export async function getCurrentUser(id) {
    const response = await axios.get(getCurrentUserUrl + id, {baseURL: keycloakBaseUrl});

    return response.data.data;
}


////////////////////// custom hook for auth ///////////////////////

const AuthContext = createContext()

export function AuthProvider({children}) {

    const [user, setUser] = useState(null);
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [loadingInitial, setLoadingInitial] = useState(true);

    const navigation = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (error) setError(null);
    }, [location.pathname]);

    useEffect(() => {
        let accessToken = localStorage.getItem('access_token')
        if (accessToken) {
            let decodedAccessToken = jwt_decode(accessToken)
            setUser(decodedAccessToken)
        }
        // else{
        //     navigation('/login')
        // }
    }, []);


    function hookLogin({
                           username,
                           password,
                           client_id = 'broker-settlement',
                           grant_type = 'password',
                           client_secret = '12aa90a1-7c61-4cda-8483-a22fe83a47a2',
                           scope = 'banking-profile'
                       }) {
        setLoading(true);
        login({username, password, client_id, grant_type, client_secret, scope})
            .then((res) => {
                let userInfo = jwt_decode(res.access_token)
                setUser(userInfo);
                localStorage.setItem('access_token', res.access_token)
                localStorage.setItem('refresh_token', res.refresh_token)
                navigation("/");
            })
            .catch((error) => setError(error))
            .finally(() => setLoading(false));
    }

    function hookLogout() {
        logout().then(() => setUser(undefined));
    }

    const memoedValue = useMemo(
        () => ({
            user,
            loading,
            error,
            hookLogin,
            hookLogout,
        }),
        [user, loading, error]
    );

    return (
        <AuthContext.Provider value={memoedValue}>
            {/*{!loadingInitial && children}*/}
            {children}
        </AuthContext.Provider>
    );

}


export default function useAuth() {
    return useContext(AuthContext);
}