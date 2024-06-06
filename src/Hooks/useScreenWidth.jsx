import { useEffect, useState } from "react";

const useScreenWidth = () =>{
    const [screenWidth, setScreenWidth] = useState(window.innerWidth) 
    useEffect(()=>{
        setScreenWidth(window.innerWidth)
    }, [])

    return screenWidth
}


export default useScreenWidth