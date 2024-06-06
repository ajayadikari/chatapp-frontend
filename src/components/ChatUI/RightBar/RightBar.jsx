import React, { useEffect, useRef } from 'react';
import './rightbar.css';
import Message from '../../Message/Message';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../../../axiosInstances';
import InputBox from '../InputBox/InputBox';
import { setChats } from '../../../Redux/ChatSlice';
import RightNav from './RightNav/RightNav';

const RightBar = ({ sendMessage, showLeft, smallScreen }) => {
    const receiver = useSelector(store => store.chat.receiver);
    const sender = localStorage.getItem('username');
    const chats = useSelector(store => store.chat.chats);
    const dispatch = useDispatch();
    const bottomViewRef = useRef();
    const rightBarRef = useRef();
    const chatBoxRef = useRef();

    const fetchChats = async () => {
        if (receiver && receiver.length > 0) {
            try {
                const res = await axiosInstance.get(`/api/v1/chat/fetch-chats/${sender}/${receiver}`);
                if (res.data.success) {
                    dispatch(setChats({ 'chats': res.data.data }));
                } else {
                    console.error(res.data.msg);
                }
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        }
    };

    // useEffect(() => {
    //     if (rightBarRef.current) {
    //         if (showLeft) {
    //             rightBarRef.current.style.display = "none";
    //         } else {
    //             rightBarRef.current.style.display = "block";
    //             rightBarRef.current.style.width = "100vh";
    //             // if (chatBoxRef) chatBoxRef.current.style.width = '100%';
    //         }
    //     }
    // }, [showLeft]);

    useEffect(() => {
        fetchChats();
    }, [receiver]);

    useEffect(() => {
        if (bottomViewRef.current) {
            bottomViewRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chats]);

    return (
        <div className={`rightbar  ${smallScreen ? ('phone') : ('')} ${showLeft ? ('') : ('show')} ${showLeft ? "showRight" : "closeRight"} ${smallScreen ? ('phone') : ('')}`} ref={rightBarRef}>
            {receiver && receiver.length > 0 ? (
                chats?.length > 0 ? (
                    <>
                        <RightNav />
                        <div className="chatbox" ref={chatBoxRef}>
                            {chats.map((chat, index) => (
                                <Message key={index} chat={chat} username={receiver} sender={chat.sender} />
                            ))}
                            <div className="bottomView" ref={bottomViewRef} ></div>
                        </div>
                        <InputBox sender={sender} receiver={receiver} sendMessage={sendMessage} />
                    </>
                ) : (
                    <>
                        <div className="chatbox emptybox">
                            START CHATING
                            <span>send your first message!</span>
                        </div>
                        <InputBox sender={sender} receiver={receiver} sendMessage={sendMessage} />
                    </>
                )
            ) : (
                <div className="chatBoxContainer">
                    <p>Select a chat to see messages</p>
                </div>
            )}
        </div>
    );
};

export default RightBar;
