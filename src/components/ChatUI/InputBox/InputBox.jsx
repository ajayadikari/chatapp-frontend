import './inputbox.css'
import React, { useEffect } from 'react'
import { useState } from 'react'
import axiosInstance from '../../../axiosInstances'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { appendMsg } from '../../../Redux/ChatSlice'

const InputBox = ({ sender, receiver, sendMessage }) => {
    const [msg, setMsg] = useState('')
    const dispatch = useDispatch()
    const [file, setFile] = useState(null)

    const clickHandler = async (e) => {

        if (e.key == 'Enter') {
            const data = {
                "sender": sender,
                "receiver": receiver,
                'text': msg,
            }
            const formdata = new FormData()
            formdata.append("sender", sender)
            formdata.append("receiver", receiver)
            formdata.append("text", msg)
            try {
                // const res = await axiosInstance.post(`api/v1/chat/store-msg/0`, formdata)
                setMsg('')
                dispatch(appendMsg({ 'msg': data }))
                sendMessage(false, msg)
            } catch (error) {
                toast.error('something went wrong')
                console.log(error)
            }
        }
    }

    const postFile = async (e) => {
        setFile(e.target.files[0])
        const formdata = new FormData()
        formdata.append("sender", sender)
        formdata.append("receiver", receiver)
        formdata.append('file', e.target.files[0])
        console.log(file)
        try {
            const res = await axiosInstance.post(`api/v1/chat/store-msg/1`, formdata, {
                headers: {
                    "Content-Type": 'multipart/form-data'
                }
            })
            console.log(res.data.data.file)
            const link = res.data.data.file
            sendMessage(true, link)
            // res.data.data.file = `http://localhost:8000${link}`
            dispatch(appendMsg({ "msg": { ...res.data.data } }))
        } catch (error) {
            console.log(error)
            toast.error('something went wrong!')
        }
    }

    return (
        <div className="msgbox">
            <input type="text" value={msg} placeholder='Type your message' onKeyDown={clickHandler} onChange={(e) => setMsg(e.target.value)} />
            <i class="fa-solid fa-paperclip" title='send file'>
                <input type="file" onChange={(e) => postFile(e)} name="" id="" />
            </i>
            <button value={'button'} className='btn'>
                <p>Message</p>
                <i class="fa-solid fa-paper-plane"></i>
            </button>
        </div>
    )
}

export default InputBox