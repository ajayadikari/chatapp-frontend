import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import './notfound.css'
import { useNavigate } from "react-router-dom"

const NotFound = () => {
    const params = useParams()
    const para = params['*']
    const [countdown, setCountdown] = useState(5)
    const navigate = useNavigate()

    useEffect(() => {
        setTimeout(() => {
            setCountdown(countdown - 1)
        }, 1000)
        if (countdown === 0) navigate('/')
    }, [countdown])

    return (
        <div className="notfound">
            <p>Not found <span>"{para}"</span>, Redirecting to home in <span>{countdown}</span> {countdown > 1 ? ('seconds') : ("second") }</p>
        </div>
    )
}

export default NotFound