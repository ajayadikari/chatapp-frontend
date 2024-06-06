import React, { useEffect, useState } from 'react'
import './message.css'
import server from '../../constants'

const Message = ({ chat, username, sender }) => {
    // console.log(chat?.file)
    const [ext, setExt] = useState(null)
    const [filename, setFilename] = useState(null)
    // const [isDataUrl, setIsDataUrl] = useState(false)

    const findext = () => {
        setExt(chat?.file.split('.')[1])
        setFilename(chat?.file.split('/')[3])
    }
    useEffect(() => {
        if (chat && chat.is_file && chat.file != null === true) findext()
    }, [chat])
    return (
        <div className={`message ${username != sender ? ('placeRight') : ('placeLeft')}`}>
            {/* <div className={`msg`}>{msg}</div> */}
            {
                !chat?.is_file ? (
                    chat?.text && <div className="text">{chat?.text}</div>
                ) : (
                    <>
                        {
                            (ext !== 'pdf' && ext != 'docx') ? (
                                <a href={`${server}${chat?.file}`} target='_blank'>
                                    <img src={`${server}${chat?.file}`} className='file' alt="img file" srcset="" />
                                </a>
                            ) : (
                                <a href={`${server}${chat?.file}`} target='_blank' className='file'>{
                                    <>
                                        <i class="fa-regular fa-folder-open"></i>
                                        <>{filename.substring(0, 10)}...{ext}</>
                                    </>
                                }</a>
                            )
                        }
                    </>
                )
            }
        </div>
    )
}

export default Message
