import React from "react"
import './optionsbar.css'
import { useNavigate } from "react-router-dom"
import { clearAuth } from "../../../Redux/AuthSlice"
import { clearChat } from "../../../Redux/ChatSlice"
import { clearUser } from "../../../Redux/UserSlice"
import { useState } from "react"

/* eslint-disable no-restricted-globals */

const OptionsBar = ({ setShowProfile, showProfile, has_next, page, setPage }) => {
    const navigate = useNavigate()
    const logoutHandler = () => {
        const yes = confirm("Do you really want to logout?")
        if (yes) {
            localStorage.clear()
            clearAuth()
            clearChat()
            clearUser()
            navigate('/login')
        }
    }

    const paginator = (next) => {
        if (next && has_next) setPage(prev => prev + 1)
        else if (!next && page > 1) setPage(prev => prev - 1)
    }

    return (
        <div className={`optionsbar ${showProfile ? ('deactivate') : ('activate')}`}>
            <div className="left">
                <button className={`${page <= 1 && 'deactive'}`} title="go to previous page" onClick={() => paginator(false)}>
                    <i class="fa-solid fa-arrow-right leftarrow"></i>
                    prev
                </button>
                <button className={`${!has_next && 'deactive'}`} title="go to next page" onClick={() => paginator(true)}>
                    next
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
            <div className="right">
                <i class="fa-regular fa-user" title="profile" onClick={() => setShowProfile(true)}></i>
                <i class="fa-solid fa-arrow-right-from-bracket" onClick={() => logoutHandler()} title="logout"></i>
            </div>
        </div>
    )
}

export default OptionsBar

/* eslint-enable no-restricted-globals */