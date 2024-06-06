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
    baseURL: `${server}`,
    headers: {
        'Authorization': `Bearer ${access}`
    }
});

axiosInstance.interceptors.request.use(async req => {
    try {
      let access = localStorage.getItem('access');
      let refresh = localStorage.getItem('refresh');
  
      if (!access || !refresh) {
        toast.error('Authentication tokens not found');
        window.location.href = '/login';
        return Promise.reject(new Error('Authentication tokens not found'));
      }
  
      const accessDecode = jwtDecode(access);
      const accessExpired = dayjs.unix(accessDecode.exp).diff(dayjs()) < 1;
  
      if (!accessExpired) {
        req.headers.Authorization = `Bearer ${access}`;
        return req;
      }
  
      const refreshDecode = jwtDecode(refresh);
      const refreshExpired = dayjs.unix(refreshDecode.exp).diff(dayjs()) < 1;
  
      if (refreshExpired) {
        toast.error('Login expired');
        window.location.href = '/login';
        return Promise.reject(new Error('Refresh token expired'));
      }
  
      const response = await axios.post(`${server}api/v1/token/refresh/`, { refresh });
      const newAccess = response.data.access;
  
      localStorage.setItem('access', newAccess);
      req.headers.Authorization = `Bearer ${newAccess}`;
  
      return req;
    } catch (error) {
      console.error('Error in request interceptor', error);
      toast.error('An error occurred during token refresh');
      window.location.href = '/login';
      return Promise.reject(error);
    }
  });
  
  export default axiosInstance;