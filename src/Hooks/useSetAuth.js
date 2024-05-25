import { useEffect } from "react";
import { setAuth } from "../Redux/AuthSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { setUsername } from "../Redux/UserSlice";
import { jwtDecode } from 'jwt-decode'

const useSetAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authState = useSelector(store => store.auth)

    const helper = () => {
        const access = localStorage?.getItem('access');
        const refresh = localStorage?.getItem('refresh');
        if ((access && refresh) && (refresh || refresh?.length != 0)) {
            const decode = jwtDecode(access)
            dispatch(setUsername({ 'username': decode.username }))
            dispatch(setAuth({ access, refresh }));
        } else {
            toast.error('Please login to access');
            navigate('/login');
        }
    }

    if (!authState.refresh || authState?.refresh == 0) helper()
};

export default useSetAuth;
