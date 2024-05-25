import React from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import server from '../../constants';
import './register.css'
import { NavLink } from 'react-router-dom';
import { loader } from '../../loader';
import { useNavigate } from 'react-router-dom';


const Register = () => {
    const [username, setUsername] = useState('')
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmpass, setConfirmpass] = useState('')
    const [profilepic, setProfilepic] = useState(null)
    const [showPass, setShowpass] = useState(false)
    const [showConPass, setShowConpass] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const onSubmitHandler = async (e) => {
        setLoading(true)
        e.preventDefault();
        if (username.length === 0) {
            toast.error('username should not be empty')
        }
        if (firstname.length === 0) {
            toast.error('firstname should not be empty')
        }
        if (email.length === 0) {
            toast.error('email should not be empty')
        }
        if (password.length === 0) {
            toast.error('password should not be empty')
        }
        if (confirmpass.length === 0) {
            toast.error('confirm password should not be empty')
        }
        if (password != confirmpass) toast.error('password and confirm password not matching')
        else {
            const formData = new FormData()
            const obj = {
                "username": username,
                "first_name": firstname,
                "last_name": lastname,
                "email": email,
                "profilepic": profilepic,
                "password": password
            }
            for (const key in obj) {
                formData.append(key, obj[key])
            }
            try {
                const res = await axios.post(`${server}api/v1/user/register`, formData, {
                    headers: {
                        "Content-Type": 'multipart/form-data'
                    }
                })
                toast.success('registration successful')
                navigate('/login')
            }
            catch {
                toast.error('something went wrong!')
            }
        }
        setLoading(false)
    }
    return (
        <div className='register'>
            <NavLink to='/login'>
                <i class="fa-solid fa-right-to-bracket login" title='login' ></i>
            </NavLink>
            <form action="" onSubmit={onSubmitHandler}>
                <h1>Register</h1>

                <div>
                    {/* <label htmlFor="username">Username: </label> */}
                    <input type='text' onChange={(e) => setUsername(e.target.value)} name='username' required placeholder='Enter your username'></input>
                </div>
                <div>
                    {/* <label htmlFor="">First name: </label> */}
                    <input type='text' onChange={(e) => setFirstname(e.target.value)} required placeholder='Enter your firstname'></input>
                </div>
                <div>
                    {/* <label htmlFor="">Last name: </label> */}
                    <input type='text' onChange={(e) => setLastname(e.target.value)} placeholder='Enter your lastname'></input>
                </div>
                <div>
                    {/* <label htmlFor="">email: </label> */}
                    <input type='email' onChange={(e) => setEmail(e.target.value)} required placeholder='Enter your email'></input>
                </div>
                <div className='pic'>
                    <label htmlFor="profilepic">Upload Profile Pic:</label>
                    <input type="file" name="profilepic" id="" onChange={(e) => setProfilepic(e.target.files[0])} />
                </div>
                <div className='pass'>
                    {/* <label htmlFor="">Password: </label> */}
                    {showPass ? (<i class="fa-regular fa-eye" onClick={() => setShowpass(!showPass)}></i>) : (<i class="fa-regular fa-eye-slash" onClick={() => setShowpass(!showPass)}></i>)}
                    <input type={`${showPass ? 'text' : 'password'}`} onChange={(e) => setPassword(e.target.value)} required placeholder='Enter your password'></input>
                </div>
                <div className='pass'>
                    {/* <label htmlFor="confirmpassword">Confirm Password: </label> */}
                    {showConPass ? (<i class="fa-regular fa-eye" onClick={() => setShowConpass(!showConPass)}></i>) : (<i class="fa-regular fa-eye-slash" onClick={() => setShowConpass(!showConPass)}></i>)}
                    <input type={`${showConPass ? 'text' : 'password'}`} onChange={(e) => setConfirmpass(e.target.value)} required placeholder='Confirm Your password'></input>
                </div>
                <button type='submit'>{loading ? (<div className='loader'>{loader}</div>) : ('Register')}</button>
            </form>
        </div>
    )
}

export default Register