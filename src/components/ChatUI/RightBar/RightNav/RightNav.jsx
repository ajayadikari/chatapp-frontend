import React, { useEffect } from "react"
import './rightnav.css'
import { useSelector } from "react-redux"
import { useState } from "react"

const RightNav = () => {
    const receiver = localStorage.getItem('receiver')
    const [pp, setPp] = useState('')
    const img = useSelector(store => store.chat.receiverPic)
    useEffect(() => {
        setPp(img)
    }, [img])
    return (
        <div className="rightnav">
            <div className="detailbox">
                {
                    pp ? (<img src={pp} alt="" />) : (<div><i class="fa-solid fa-user"></i></div>)
                }
                <p>@{receiver}</p>
            </div>
        </div>
    )
}

export default RightNav