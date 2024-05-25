import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import server from '../../constants'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setAuth } from '../../Redux/AuthSlice'
import { loader } from '../../loader'


const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowpass] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (username.length === 0 || password.length === 0) toast.error('username and password should be filled!')
        else {
            try {
                const obj = {
                    "username": username,
                    "password": password
                }
                const res = await axios.post(`${server}api/v1/token/`, obj)
                localStorage.setItem('access', res.data.access)
                localStorage.setItem('refresh', res.data.refresh)
                dispatch(setAuth({ "access": res.data.access, "refresh": res.data.refresh }))
                localStorage.setItem('username', username)
                navigate('/')
            } catch (error) {
                toast.error('something went wrong!')
            }
        }
        setLoading(false)
    }
    return (
        <form action="" onSubmit={submitHandler}>
            <h1>Login</h1>
            <div>
                {/* <label htmlFor="username" >Username</label> */}
                <input type="text" onChange={(e) => setUsername(e.target.value)} placeholder='Enter your username' required />
            </div>
            <div>
                {/* <label htmlFor="password" >Password</label> */}
                <div className='pass'>
                    {/* <label htmlFor="">Password: </label> */}
                    {showPass ? (<i class="fa-regular fa-eye" onClick={() => setShowpass(!showPass)}></i>) : (<i class="fa-regular fa-eye-slash" onClick={() => setShowpass(!showPass)}></i>)}
                    <input type={`${showPass ? 'text' : 'password'}`} onChange={(e) => setPassword(e.target.value)} required placeholder='Enter your password'></input>
                </div>
            </div>
            <button type='submit'>{loading ? (<div className='loader'>{loader}</div>) : ('Login')}</button>
            {/* <input type="submit" value="Login" /> */}
            <button onClick={() => navigate('/register')}>Register</button>
        </form>
    )
}

export default Login
