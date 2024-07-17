import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'
import ChatInput from './ChatInput';
import Icon from 'react-icons-kit';
import { userPlus } from 'react-icons-kit/feather';
import { addMessageRoute, getMessageRoute } from '../utils/APIRoute';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import { toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function ChatContainer({currentUser,  currentRoom, currentRoomId, roomUsers, roomUsersId, displaySetting,socket, onDisplay }) {
    //const socket = io(`${host}/`)
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [displayToast, setDisplayToast] = useState(false);
    const [latestRoomId, setLatestRoomId] = useState(undefined);
    const [userFrom, setUserFrom] = useState(null);
    const [roomFrom, setRoomFrom] = useState(null);
    const scrollRef = useRef(null);
    const toastCss = {
        position: "top-right",
        theme: "dark",
        autoClose: 5000,
        pauseOnHover: true,
        limit: 1
      };
    useEffect(() => {
        if(currentRoom){
            fetchData();
        }
        async function fetchData()  {
            const response = await axios.post(getMessageRoute,{
                from: currentUser._id,
                to: currentRoomId
            });
            setLatestRoomId(currentRoomId);
            console.log(currentRoomId+" in fetch data and "+latestRoomId);
            setMessages(response.data);
        };
    }, [currentRoom]);
    useEffect(()=>{
        if(socket.current){
            socket.current.on("msg-receive", (msg)=>{
                console.log(latestRoomId + msg.receiverRoomId)
                if(msg.receiverRoomId === latestRoomId){
                    setArrivalMessage({fromSelf: msg.from, message: msg.message});
                    setDisplayToast(false)
                }
                else{
                    setUserFrom(msg.from);
                    setRoomFrom(msg.fromRoom);
                    setArrivalMessage(null);
                    setDisplayToast(true)
                }   
            });
        }
    });
    useEffect(()=>{
        arrivalMessage && setMessages((prev)=>[...prev, arrivalMessage]);
    },[arrivalMessage]);
    useEffect(()=>{
        if(messages){
            scrollRef.current?.scrollIntoView({behaviour: "smooth"});
        }
    }, [messages]);
    const handleSendMessage = async (message) => {
        const {data} = await axios.post(addMessageRoute,{
            from: currentUser._id,
            to: currentRoomId,
            name: currentRoom,
            message: message
        });
        socket.current.emit("send-msg",{
            to: roomUsersId,
            receiverRoomId: data.data.receiver,
            receiverRoomName: data.roomName,
            from: currentUser._id,
            message: message
        });
        const msg = [...messages];
        msg.push({fromSelf: true, message: message});
        setMessages(msg);
    }
    const handleAddMembers = async (e)=>{
        e.preventDefault();
        displaySetting();
    }
    useEffect(()=>{
        if(displayToast){
            toast.info(`${userFrom} send new message in ${roomFrom}`,toastCss)
            setDisplayToast(false);
        }
    },[displayToast])
    return (
        <>
            {
                currentRoom && (
                    <>
                    <Container>
                        <div className="room-header">
                            <div className="room-details">
                                <div className="roomname">
                                    <h2>{currentRoom}</h2>
                                    <h5>
                                        {currentRoomId}
                                        &nbsp;&nbsp;&nbsp;Members:&nbsp;&nbsp;
                                        {
                                            roomUsers.map((user, i) => {
                                                return <>
                                                    {
                                                        ( i ? ', ': '') + user
                                                    }
                                                </>
                                            })
                                        }
                                    </h5>
                                </div>
                            </div>
                            <div className="add-member">
                                <form onSubmit={(e)=>{handleAddMembers(e)}}>
                                    <button>
                                        <Icon icon={userPlus} size={30} />
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="room-messages">
                            {
                                messages.map((message, index)=>{
                                    return(
                                        <div ref={scrollRef} key={uuidv4()}>
                                            <div className={
                                                `message ${
                                                    message.fromSelf === true ? `sent`:"received"
                                                }`
                                            }>
                                                <div className="content">
                                                    <h5>{message.fromSelf===true?"You":message.fromSelf}</h5>
                                                    <p>{message.message}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <ChatInput handleSendMessage={handleSendMessage} />
                    </Container>
                    </>
                )
            }
        </>
    )
}

const Container = styled.div`
display: grid;
grid-template-rows: 10% 81% 9%;
overflow: hidden;
scroll-behavior: smooth;
@media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 12% 73% 15% ;
}
.room-header{
    display: grid;
    grid-template-columns: 90% 10%;
    align-items: center;
    justify-content: center;
    padding: 0.2rem;
    height: 3rem;
    background-color: #262650;
    .room-details{
        display: flex;
        width: 90%;
        align-items: center;
        gap: 1rem;
        overflow-y: hidden;
        overflow-x: auto;
        white-space: nowrap;
    &::-webkit-scrollbar{
        height: 3px;
        background-color: #262650;
        &-thumb{
            background-color: white;
        }
    }
        .roomname{
            color: white;
            padding-left: 2rem;
            h5{
                color: grey;
            }
        }
    }
    .add-member{
        justify-content: center;
        width: 10%;
        align-items: center;
        form{
            align-items: center;
            button{
                justify-content: center;
                align-items: center;
                background-color: transparent;
                border: none;
                outline: none;
                svg{
                    background-color: white;
                    color: #262650;
                    align-self: center;
                    border: 2px solid white;
                    border-radius: 5px;
                    padding: 4px;
                    transition: 0.4s ease-in-out;
                    cursor: pointer;
                    &:hover{
                        background-color: transparent;
                        color: white;
                    }
                }
            }   
        }
    }
}
.room-messages{
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar{
        width: 0.3rem;
        background-color: transparent;
        &-thumb{
            background-color: #3e3884;
            border-radius: 3rem;
        }
    }
    .message{
        display: flex;
        align-items: center;
        .content{
            max-width: 40%;
            overflow-wrap: break-word;
            padding: 0.4rem 1rem;
            font-size: 1.1rem;
            border-radius: 1rem;
            color: #d1d1d1;
        }
        @media screen and (min-width: 380px) and (max-width: 720px) {
            .content{
                font-size: 0.9rem;
            }
        }
    }    
    .received{
        justify-content: flex-start;
        .content{   
            background-color: #262650;
        }
    }
    .sent{
        justify-content: flex-end;
        .content{
            background-color: #3e3884;
        }
    }
}

`;

