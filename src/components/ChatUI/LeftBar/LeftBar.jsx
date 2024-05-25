import React, { useState } from 'react'
import './leftbar.css'
import UserCard from '../UserCard/UserCard'
import { useEffect } from 'react'
import axiosInstance from '../../../axiosInstances.js'
import { toast } from 'react-toastify'
import { setSelectedReceiver, setSocket } from '../../../Redux/ChatSlice.js'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'
import OptionsBar from '../OptionsBar/OptionsBar.jsx'
import Profile from '../../Profile/Profile.jsx'



const LeftBar = () => {
  const [users, setUsers] = useState([])
  const [username, setUsername] = useState('')
  const user = localStorage.getItem('username')
  const [showProfile, setShowProfile] = useState(false)
  const receiver = useSelector(store => store.chat.receiver)
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [has_next, setHasnext] = useState(false)

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get(`api/v1/user/get-users/${page}`);
      setUsers(res.data.data)
      setHasnext(res.data.has_next)
    } catch (error) {
      console.log(error)
      toast.error('Error fetching users')
      // window.location.reload()
    }
  };

  useEffect(() => {
    setUsername(user)
    fetchUsers();
  }, [localStorage, page]);

  const profileClickHandler = () => (!showProfile) ? (true) : (false)

  const searchHandler = async () => {
    try {
      const res = await axiosInstance.get(`api/v1/user/filter-users/${searchTerm}`)
      setUsers(res.data.users)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (searchTerm.length > 0) searchHandler()
    else fetchUsers()
  }, [searchTerm])

  return (
    <div className='leftbar'>
      <div className='searchHolder'>
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" onChange={(e) => setSearchTerm(e.target.value)} placeholder='Search user...' />
      </div>
      {
        users.length > 0 ? (
          users.filter(user => {
            return user.username != username
          })
            .map(user => {
              return <UserCard user={user} />
            })

        ) : (
          <>No users</>
        )
      }
      <OptionsBar page={page} has_next={has_next} setPage={setPage} setShowProfile={setShowProfile} showProfile={showProfile} />
      <Profile setShowProfile={setShowProfile} showProfile={showProfile} />
    </div>
  )
}

export default LeftBar
