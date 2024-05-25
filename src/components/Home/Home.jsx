import React, { useEffect, useState } from 'react';
import RightBar from '../ChatUI/RightBar/RightBar';
import LeftBar from '../ChatUI/LeftBar/LeftBar';
import './home.css';
import { useDispatch, useSelector } from 'react-redux';
import useSetAuth from '../../Hooks/useSetAuth';
import { toast } from 'react-toastify';
import { webserver } from '../../constants';
import axiosInstance from '../../axiosInstances';
import { setCn } from '../../Redux/ChatSlice';
import { appendMsg } from '../../Redux/ChatSlice';
import { json } from 'react-router-dom';

const Home = () => {
    const dispatch = useDispatch();
    const user = localStorage.getItem('username');
    const [username, setUsername] = useState('');
    const sendercn = useSelector(store => store.chat.sendercn);
    const receivercn = useSelector(store => store.chat.receivercn);
    const [socket, setSocket] = useState(null);

    useSetAuth();

    const sendMessage = (isFile, data) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            console.log(receivercn)
            if (!isFile) {
                const raw = {
                    receivercn: receivercn,
                    msg: data,
                    file: false
                };
                const obj = JSON.stringify(raw);
                socket.send(obj);
            }
            else {
                // const fr = new FileReader()
                // fr.onload = (e) => {
                    const raw = {
                        receivercn: receivercn,
                        msg: data,
                        file: true
                    };
                    console.log(data)
                    const obj = JSON.stringify(raw);
                    socket.send(obj);
                // }
                // fr.readAsDataURL(data)
            }
        }
    };


    const connectServer = () => {
        if (username) {
            const newSocket = new WebSocket(`${webserver}ws/sc/${username}`);

            newSocket.onopen = () => {
                toast.success('server connected');
            };

            newSocket.onerror = (error) => {
                toast.error('unable to connect server');
                console.error(error);
            };

            newSocket.onmessage = (e) => {
                const jsonObj = JSON.parse(e.data)
                const receiver = localStorage?.getItem('receiver')
                let obj = {}
                if (!jsonObj.is_file) {
                    obj = {
                        'receiver': user,
                        'sender': receiver,
                        'text': jsonObj.msg,
                        'is_file': false
                    }
                }
                else {
                    obj = {
                        'receiver': user,
                        'sender': receiver,
                        'file': jsonObj.msg,
                        'is_file': true
                    }
                }
                console.log(obj)
                if (obj.sender == receiver) dispatch(appendMsg({ "msg": obj }))
            };

            newSocket.onclose = (e) => {
                toast.error('Server disconnected!')
            }

            setSocket(newSocket);

            return () => {
                newSocket.close();
            };
        }
    };

    const setUserCn = async () => {
        if (user) {
            try {
                const res = await axiosInstance.get(`/api/v1/user/get-channel-name/${user}`);
                if (res.data.success) {
                    dispatch(setCn({ sender: true, cn: res.data.cn.channel_name }));
                } else {
                    toast.error("unable to fetch user's channel name");
                }
            } catch (error) {
                toast.error("Error fetching user's channel name");
                console.error(error);
            }
        } else {
            toast.error('username not found!');
        }
    };

    useEffect(() => {
        setUsername(user);
    }, [user]);

    useEffect(() => {
        setUserCn();
    }, [username]);

    useEffect(() => {
        const cleanup = connectServer();
        return cleanup;
    }, [username]);

    return (
        <div>
            <div className="chatSpace">
                <LeftBar />
                <RightBar sendMessage={sendMessage} />
            </div>
        </div>
    );
};

export default Home;
