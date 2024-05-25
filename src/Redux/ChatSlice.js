import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    receiver: '', 
    chats: [], 
    socket: null,
    sendercn: '', 
    receivercn: '',
    receiverPic: '', 
};

const chatSlice = createSlice({
    name: 'chat', 
    initialState,
    reducers:{
        setSelectedReceiver: (state, action) =>{
            state.receiver = action.payload.username
        }, 
        setChats: (state, action) =>{
            state.chats = action.payload.chats
        }, 
        appendMsg: (state, action) =>{
            console.log(action.payload.msg)
            state.chats.push(action.payload.msg);
            console.log(state.chats)
        }, 
        setSocket: (state, action) =>{
            state.socket = action.payload.socket
        }, 
        setCn: (state, action) =>{
            if(action.payload.sender) state.sendercn = action.payload.cn
            else state.receivercn = action.payload.cn
        }, 
        setReceiverPic: (state, action) =>{
            console.log(action.payload.img)
            state.receiverPic = action.payload.img
        }, 
        clearChat: (state, action) =>{
            state.receiver= ''; 
            state.chats= []; 
            state.socket=null;
            state.sendercn= ''; 
            state.receivercn= '';
            state.receiverPic= ''; 
        }
    }
})


export const { setSelectedReceiver, setChats, appendMsg, setSocket, setCn, setReceiverPic, clearChat } = chatSlice.actions;

export default chatSlice.reducer;