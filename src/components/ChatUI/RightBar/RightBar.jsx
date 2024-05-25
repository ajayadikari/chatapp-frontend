import React, { useEffect, useState } from 'react';
import './rightbar.css';
import Message from '../../Message/Message';
import { useSelector } from 'react-redux';
import axiosInstance from '../../../axiosInstances';
import InputBox from '../InputBox/InputBox';
import { setChats, appendMsg } from '../../../Redux/ChatSlice';
import { useDispatch } from 'react-redux';
import { useRef } from 'react';
import RightNav from './RightNav/RightNav';


const RightBar = ({ sendMessage }) => {
    const receiver = useSelector(store => store.chat.receiver);
    const sender = localStorage.getItem('username');
    const chats = useSelector(store => store.chat.chats)
    const dispatch = useDispatch()
    const bottomViewRef = useRef()

    const fetchChats = async () => {
        if (receiver && receiver.length > 0) {
            try {
                const res = await axiosInstance.get(`/api/v1/chat/fetch-chats/${sender}/${receiver}`);
                console.log(res.data);
                if (res.data.success) {
                    dispatch(setChats({ 'chats': res.data.data }))
                    console.log(res.data.data)
                } else {
                    console.error(res.data.msg);
                }
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        }
    };

    useEffect(() => {
        fetchChats();
    }, [receiver]);

    useEffect(() => {
        if (bottomViewRef.current) {
            bottomViewRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [dispatch, chats])

    return (
        <div className='rightbar'>
            {receiver && receiver.length > 0 ? (
                chats?.length > 0 ? (
                    <>
                        <div className="chatboxContainer">
                            <RightNav />
                            <div className="chatbox">
                                {chats.length > 0 ? (
                                    chats.map((chat, index) => (
                                        <Message key={index} chat={chat} username={receiver} sender={chat.sender} />
                                    ))
                                ) : (
                                    <p>No messages</p>
                                )}
                                <div className="bottomView" ref={bottomViewRef} ></div>
                            </div>
                        </div>
                        <InputBox sender={sender} receiver={receiver} sendMessage={sendMessage} />
                    </>
                ) : (
                    <>
                        <div className="chatbox">start chating</div>
                        <InputBox sender={sender} receiver={receiver} sendMessage={sendMessage} />
                    </>
                )
            ) : (
                <div className="chatBoxContainer">
                    <p>Select a chat to see messages</p>
                </div>
            )}
            {/* <InputBox sender={sender} receiver={receiver} sendMessage={sendMessage} /> */}
        </div>
    );
};

export default RightBar;
