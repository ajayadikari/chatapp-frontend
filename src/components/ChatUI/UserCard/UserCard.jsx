import './usercard.css'
import { toast } from 'react-toastify'
import { setCn } from '../../../Redux/ChatSlice'
import { useDispatch } from 'react-redux'
import axiosInstance from '../../../axiosInstances'
import { setSelectedReceiver, setReceiverPic } from '../../../Redux/ChatSlice'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const UserCard = ({ user }) => {

    const dispatch = useDispatch()
    const username = localStorage.getItem('username')
    const [profilepic, setProfilepic] = useState(null)
    const selectedReceiver = useSelector(state => state.chat.receiver)

    const clickHandler = async (receiver) => {
        localStorage.setItem('receiver', receiver)
        dispatch(setSelectedReceiver({ 'username': receiver }))
        dispatch(setReceiverPic({ 'img': profilepic }))
        if (username && username.length > 0) {
            const res = await axiosInstance.get(`api/v1/user/get-channel-name/${receiver}`)
            if (res.data.success) {
                dispatch(setCn({ "sender": false, 'cn': res.data.cn.channel_name }))
                toast.success('user\'s channel is set')
            }
            else {
                toast.error("unable to fetch receiver's channel name")
                console.log(res)
            }
        }
    }

    console.log(selectedReceiver)

    useEffect(() => {
        if (user.profile_pic__pic) setProfilepic(`http://localhost:8000/MEDIA/${user.profile_pic__pic}`)
    }, [])



    return (
        <div className={`usercard ${selectedReceiver === user.username && 'active'}`} onClick={() => clickHandler(user.username)}>
            <div className="userCardLeft">
                <div className="profilepic">
                    {profilepic ? <img src={`${profilepic}`} alt="" srcset="" /> : <i class="fa-solid fa-user"></i>}
                </div>
            </div>
            <div className="userCardRight">
                <div className="upper">{user.first_name + ' ' + user.last_name}</div>
                <div className="lower">{ }</div>
            </div>
        </div>
    )
}

export default UserCard
