import React, { useEffect, useRef, useState } from "react"
import './profile.css'
import axiosInstance from "../../axiosInstances"
import { toast } from "react-toastify"

const Profile = ({ setShowProfile, showProfile }) => {
    const [user, setUser] = useState(null)
    const [selected, setSelected] = useState([])
    const [edit, setEdit] = useState({})
    const [updateDetails, setUpdateDetails] = useState(false)
    const profileWindow = useRef(null)
    const [img, setImg] = useState(null)
    const [imgUrl, setImgUrl] = useState('')
    const [profilePicImg, setProfilePicImg] = useState(null)


    const maxWindow = () => {
        const ele = profileWindow.current
        ele.style.width = "100vw"
        ele.style.height = "100vh"
    }

    const fetch = async () => {
        const username = localStorage.getItem('username')
        const res = await axiosInstance.get(`/api/v1/user/get-user/${username}`)
        setUser(res.data.user)
        setEdit(res.data.user)
        const url = `http://localhost:8000/MEDIA/${res.data.user.profile_pic__pic}`
        setProfilePicImg(url)
    }

    useEffect(() => {
        fetch()
    }, [])

    const selectedHandler = (sel) => {
        if (!updateDetails) setUpdateDetails(false)
        setSelected(prev => [...prev, sel])
    }

    const onSubmitHandler = async () => {
        const formdata = new FormData()
        Object.entries(edit).forEach(pair => {
            formdata.append(pair[0], pair[1])
        })
        if (img) {
            formdata.append('profile_pic', img)
        }
        for (let [key, pair] of formdata) {
            console.log(key, pair)
        }
        const username = await localStorage.getItem('username')
        const res = await axiosInstance.patch(`/api/v1/user/update-user/${username}`, formdata, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        if (res.data.success) toast.success('Profile updated')
        else toast.error('something went wrong!')
    }

    const updateUserObj = (key, value) => {
        setUpdateDetails(true)
        setEdit(prev => ({ ...prev, [key]: value }))
    }

    const updateCancelHandler = () => {
        setEdit({ ...user })
        setSelected([])
        setUpdateDetails(false)
    }


    const closeProfile = () => {
        setShowProfile(false)
        setImgUrl(null)
        setProfilePicImg(null)
        updateCancelHandler()
    }

    const imgUploader = async (e) => {
        const file = e.target.files[0]
        if (file) {
            setImg(file)
            const url = await readFileAsDataURL(file)
            setImgUrl(url)
            setProfilePicImg(url)
        }
    }


    const readFileAsDataURL = (file) => {
        setUpdateDetails(true)
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = () => {
                reject(fileReader.error);
            };
            fileReader.readAsDataURL(file);
        });
    };


    return (
        <div ref={profileWindow} className={`profile ${showProfile ? '' : ('deactivate')}`}>
            <h1 onClick={maxWindow}>Profile</h1>
            <div className={`inner ${showProfile ? ('activate') : ('disable')}}`}>
                <i class="fa-solid fa-x closebutton" onClick={() => closeProfile()}></i>
                <div className="picContainer">
                    {user?.profile_pic__pic != null ? (
                        <img src={profilePicImg} alt="" />
                    ) : (imgUrl?.length > 0 ? <img src={imgUrl} alt="" srcset="" /> : (<div className="pic">
                        <i class="fa-solid fa-user noprofile"></i>
                        <i class="fa-solid fa-pencil edit"></i>
                    </div>))}
                    <input className="img" type="file" name="" id="" title="upload photo" onChange={(e) => imgUploader(e)} />
                </div>
                <div className="box">
                    <p htmlFor="username">Username: {user?.username}</p>
                </div>
                <div className="box">
                    {
                        selected.includes('firstname') ? (
                            <input type="text" value={edit.first_name} autoFocus onChange={(e) => updateUserObj('first_name', e.target.value)} placeholder="Enter your new firstname" />
                        ) : (
                            <p htmlFor="firstname">First Name: {user?.first_name}</p>
                        )
                    }
                    {
                        !selected.includes('firstname') && <i class="fa-solid fa-pencil" onClick={() => selectedHandler('firstname')}></i>
                    }
                </div>
                <div className="box">
                    {
                        selected.includes('lastname') ? (
                            <input type="text" value={edit ? (edit.last_name) : user.last_name} autoFocus onChange={(e) => updateUserObj('last_name', e.target.value)} placeholder="Enter your new lastname" />
                        ) : (
                            <p htmlFor="lastname">Last Name: {user?.last_name}</p>
                        )
                    }
                    {
                        !selected.includes('lastname') && <i class="fa-solid fa-pencil" onClick={() => selectedHandler('lastname')}></i>
                    }
                </div>
                <div className="box">
                    {
                        selected.includes('email') ? (
                            <input type="text" value={edit ? edit.email : (user.email)} autoFocus onChange={(e) => updateUserObj('email', e.target.value)} placeholder="Enter your new email" />
                        ) : (
                            !selected.includes('email') && <p htmlFor="email">Email: {user?.email}</p>
                        )
                    }
                    {
                        !selected.includes('email') && <i class="fa-solid fa-pencil" onClick={() => selectedHandler('email')}></i>
                    }
                </div>

                {
                    updateDetails ? (
                        <div className="btns">
                            <button onClick={onSubmitHandler}>Update</button>
                            <button onClick={updateCancelHandler}>Cancel</button>
                        </div>
                    ) : ('')
                }
            </div>
        </div>
    )
}

export default Profile