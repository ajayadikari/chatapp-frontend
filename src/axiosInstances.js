import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from 'dayjs'
import { toast } from "react-toastify";
import server from "./constants";
import { useSelector } from "react-redux";
import { store } from "./Redux/store";

const access = localStorage.getItem('access')
const refresh = localStorage.getItem('refresh')
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/',
    headers: {
        'Authorization': `Bearer ${access}`
    }
});

axiosInstance.interceptors.request.use(async req => {
    const accessdecode = await jwtDecode(access)
    const access_expired = await dayjs.unix(accessdecode.exp).diff(dayjs()) < 1;
    if (!access_expired) return req
    const refreshdecode = await jwtDecode(refresh)
    const refresh_expired = dayjs.unix(refreshdecode.exp).diff(dayjs()) < 1;
    if (!refresh_expired) {
        const res = await axios.post(`${server}api/v1/token/refresh/`, { refresh: refresh })
        req.headers.Authorization = 'Bearer ' + res.data.access
        await localStorage.setItem('access', res.data.access)
        return req
    }
    toast.error('Login expired')
    window.location.href = '/login'
})




export default axiosInstance;
