import React, { useRef, useState, useEffect } from 'react';
import './leftbar.css';
import UserCard from '../UserCard/UserCard';
import axiosInstance from '../../../axiosInstances';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import OptionsBar from '../OptionsBar/OptionsBar';
import Profile from '../../Profile/Profile';
import { setSelectedReceiver, setSocket } from '../../../Redux/ChatSlice';

const LeftBar = ({ showLeft, setShowLeft, smallScreen }) => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const user = localStorage.getItem('username');
  const [showProfile, setShowProfile] = useState(false);
  const receiver = useSelector(store => store.chat.receiver);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const leftBarRef = useRef(null);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get(`api/v1/user/get-users/${page}`);
      setUsers(res.data.data);
      setHasNext(res.data.has_next);
    } catch (error) {
      console.log(error);
      toast.error('Error fetching users');
    }
  };

  useEffect(() => {
    setUsername(user);
    fetchUsers();
  }, [user, page]);

  const profileClickHandler = () => setShowProfile(prev => !prev);

  const searchHandler = async () => {
    try {
      const res = await axiosInstance.get(`api/v1/user/filter-users/${searchTerm}`);
      setUsers(res.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (searchTerm.length > 0) {
      searchHandler();
    } else {
      fetchUsers();
    }
  }, [searchTerm]);

  // const onHamBurgerClick = () => {
  //   setShowLeft(prev => !prev);
  //   if (leftBarRef.current) {
  //     if (showLeft) {
  //       leftBarRef.current.style.display = "none";
  //     } else {
  //       leftBarRef.current.style.width = "flex";
  //     }
  //   }
  // };


  // useEffect(()=>{
  //   if (leftBarRef.current) {
  //         if (showLeft) {
  //           leftBarRef.current.style.display = "block";
  //           leftBarRef.current.style.width = "100vh";
  //         } else {
  //           leftBarRef.current.style.display = "none";
  //         }
  //       }
  // }, [showLeft])

  return (
    <div className={`leftbar ${smallScreen ? ('phone') : ('')} ${showLeft ? ('') : ('close')}`} ref={leftBarRef}>
      <div>
        <div className='searchHolder'>
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="text" onChange={(e) => setSearchTerm(e.target.value)} placeholder='Search user...' />
        </div>
      </div>
      {users.length > 0 ? (
        users.filter(u => u.username !== username)
          .map(user => (
            <UserCard showLeft={showLeft} key={user.username} user={user} setShowLeft={setShowLeft} />
          ))
      ) : (
        <>No users</>
      )}
      <OptionsBar page={page} hasNext={hasNext} setPage={setPage} setShowProfile={setShowProfile} showProfile={showProfile} />
      <Profile smallScreen={smallScreen} setShowProfile={setShowProfile} showProfile={showProfile} />
    </div>
  );
};

export default LeftBar;
