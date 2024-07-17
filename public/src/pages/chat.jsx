import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { addMemberRoute, allRoomsRoute, createRoomRoute, deleteRoomRoute, joinRoomRoute, host } from '../utils/APIRoute';
import Rooms from '../components/Rooms'
import Header from '../components/Header'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Icon from 'react-icons-kit';
import { xCircle } from 'react-icons-kit/feather';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import { io } from 'socket.io-client';
// import {w3cwebsocket as W3WebSocket } from 'websocket'

// const client = new W3WebSocket('wss://smart-room-app.herokuapp.com/')

function Chat() {
  const socket = useRef();
  const toastCss = {
    position: "top-right",
    theme: "dark",
    autoClose: 3000,
    pauseOnHover: true,
  };
  const [createRoom, setCreateRoom] = useState("");
  const [joinRoom, setJoinRoom] = useState("");
  const [displayCreate, setDisplayCreate] = useState('none');
  const [displayJoin, setDisplayJoin] = useState('none');
  const [displayDelete, setDisplayDelete] = useState('none');
  const [addMember, setAddMember] = useState("");
  const [displayAdd, setDisplayAdd] = useState("none");
  const [roomname, setRoomname] = useState(undefined);
  const [roomId, setRoomId] = useState(undefined);
  const [currentRoom, setCurrentRoom] = useState(undefined);
  const [currentRoomId, setCurrentRoomId] = useState(undefined);
  const [currentRoomUsers, setCurrentRoomUsers] = useState([]);
  const [currentRoomUsersId, setCurrentRoomUsersId] = useState([]);
  const [roomUsers, setRoomUsers] = useState([]);
  const [roomUsersId, setRoomUsersId] = useState([]);

  const handleRoomChange = (room, index) => {
    setCurrentRoom(room);
    setCurrentRoomId(roomIds[index]);
    setCurrentRoomUsers(roomUsers[index]);
    setCurrentRoomUsersId(roomUsersId[index]);
  }
  const changeHandler = (e) => {
    setCreateRoom(e.target.value);
  }
  const changeHandler2 = (e) => {
    setJoinRoom(e.target.value);
  }
  const changeHandler3 = (e) => {
    setAddMember(e.target.value);
  }
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [roomIds, setRoomIds] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  useEffect(() => {
    defaultFunction();
    async function defaultFunction() {
      if (!localStorage.getItem('chat-user')) {
        navigate('/');
      }
      else {
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-user")));
      }

    }
  }, []);
  useEffect(() => {
    if (currentUser) {
      socket.current = io(`${host}/`)
      socket.current.emit("add-user", currentUser._id);

    }
  }, [currentUser]);
  const displaySettings = () => {
    if (displayCreate === 'none') {
      setDisplayCreate('flex')
    }
    else {
      setDisplayCreate('none')
    }
  }
  const displaySettings2 = () => {
    if (displayJoin === 'none') {
      setDisplayJoin('flex')
    }
    else {
      setDisplayJoin('none')
    }
  }
  const displaySettings4 = () => {
    if (displayAdd === 'none') {
      setDisplayAdd('flex')
    }
    else {
      setDisplayAdd('none')
    }
  }
  const [received, setReceived] = useState(false);
  const [receivedRoomId, setReceivedRoomId] = useState("");
  useEffect(() => {
    defaultFunction();
    async function defaultFunction() {
      if (currentUser) {
        if (currentUser.isProfilePicSet) {
          const { data } = await axios.get(`${allRoomsRoute}/${currentUser._id}`);
          setRooms(data.data);
          setRoomIds(data.roomIds);
          setRoomUsers(data.roomUsers);
          setRoomUsersId(data.roomUsersId);
        }
        else {
          navigate("/setProfile")
        }
      }
    }
  }, [currentUser]);

  useEffect(() => {
    defaultFunction();
    async function defaultFunction() {
      if (currentUser) {
        if (currentUser.isProfilePicSet) {
          const { data } = await axios.get(`${allRoomsRoute}/${currentUser._id}`);
          setRooms(data.data);
          setRoomIds(data.roomIds);
          setRoomUsers(data.roomUsers);
          setRoomUsersId(data.roomUsersId);
        }
        else {
          navigate("/setProfile")
        }
      }
    }
  }, [rooms]);
  const sleep = async (milliseconds) => {
    return new Promise(resolve => { setTimeout(resolve, milliseconds) })
  }
  const onDisplay = (received, receivedRoomId)=>{
    setReceived(received);
    setReceivedRoomId(receivedRoomId);
  }
  const onCreate = async (e) => {
    e.preventDefault()
    if (createRoom === "") {
      toast.warning("Please enter Room name", toastCss)
    }
    else {
      const { data } = await axios.post(`${createRoomRoute}/${currentUser._id}`, {
        roomName: createRoom
      });
      if (!data.status) {
        toast.error(data.msg, toastCss)
      }
      else {
        toast.success(data.msg, toastCss);
        displaySettings();
        setCreateRoom("");
        // window.location.reload(true);
      }
    }
  }
  const displaySettings3 = (room, index) => {
    setRoomname(room)
    setRoomId(roomIds[index])
    if (displayDelete === 'none') {
      setDisplayDelete('flex')
    }
    else {
      setDisplayDelete('none')
    }
  }
  const onDelete = async (e) => {
    e.preventDefault();
    const { data } = await axios.post(`${deleteRoomRoute}/${currentUser._id}`, { roomName: roomname, roomId: roomId });
    if (!data.status) {
      toast.error(data.msg, toastCss)
    }
    else {
      toast.success(data.msg, toastCss);
      displaySettings3();
      setCurrentRoom(undefined);
      setCurrentRoomId(undefined);
      await sleep(5000);
      window.location.reload(true);
    }
  }
  const onJoin = async (e) => {
    e.preventDefault();
    const { data } = await axios.post(`${joinRoomRoute}/${currentUser._id}`, { roomId: joinRoom });
    if (!data.status) {
      toast.error(data.msg, toastCss);
    }
    else {
      toast.success(data.msg, toastCss);
      displaySettings2();
      setJoinRoom("");
      // window.location.reload(true);
    }
  }
  const onAdd = async (e) => {
    e.preventDefault();
    const { data } = await axios.post(`${addMemberRoute}/${currentUser._id}`, {
      userName: addMember,
      roomName: currentRoom,
      roomId: currentRoomId
    });
    if (!data.status) {
      toast.error(data.msg, toastCss);
    }
    else {
      toast.success(data.msg, toastCss);
      displaySettings4();
      setAddMember("");
      // window.location.reload();
    }
  }
  return (
    <>
      <ToastContainer limit={1} />
      <FormContainer>
        <div className='displayCreate' style={{ display: `${displayCreate}` }}>
          <div className="dialog-box">
            <span><Icon icon={xCircle} size={25} onClick={() => {
              if (displayCreate === 'none') { setDisplayCreate('flex') }
              else { setDisplayCreate('none') }
            }}></Icon></span>
            <h2>Create New Room</h2>
            <form onSubmit={(e) => { onCreate(e) }}>
              <input type="text" placeholder='Enter Name For Room' name='createRoom' value={createRoom} onChange={(event) => { changeHandler(event) }} />
              <button type='submit'>Create</button>
            </form>
          </div>
        </div>
        <div className='displayCreate' style={{ display: `${displayJoin}` }}>
          <div className="dialog-box">
            <span><Icon icon={xCircle} size={25} onClick={() => {
              if (displayJoin === 'none') { setDisplayJoin('flex') }
              else { setDisplayJoin('none') }
            }} ></Icon></span>
            <h2>Join Room</h2>
            <form onSubmit={(e) => { onJoin(e) }}>
              <input type="text" placeholder='Enter Room Id' name='joinRoom' value={joinRoom} onChange={(event) => { changeHandler2(event) }} />
              <button type='submit'>Join</button>
            </form>
          </div>
        </div>
        <div className='displayCreate' style={{ display: `${displayDelete}` }}>
          <div className="dialog-box">
            <span><Icon icon={xCircle} size={25} onClick={() => {
              if (displayDelete === 'none') { setDisplayDelete('flex') }
              else { setDisplayDelete('none') }
            }} ></Icon></span>
            <h2>Do you Want to Delete This room</h2>
            <form onSubmit={(e) => { onDelete(e) }} className='deleteForm'>
              <button type='submit' style={{ backgroundColor: "Red", border: "2px solid red" }}>Yes</button>
              <button type='button' onClick={() => {
                if (displayDelete === 'none') { setDisplayDelete('flex') }
                else { setDisplayDelete('none') }
              }}>No</button>
            </form>
          </div>
        </div>
        <div className='displayCreate' style={{ display: `${displayAdd}` }}>
          <div className="dialog-box">
            <span><Icon icon={xCircle} size={25} onClick={() => {
              if (displayAdd === 'none') { setDisplayAdd('true') }
              else { setDisplayAdd('none') }
            }} ></Icon></span>
            <h2>Add New Member</h2>
            <form onSubmit={(e) => { onAdd(e) }}>
              <input type="text" placeholder='Enter Username' name='addMember' value={addMember} onChange={(event) => { changeHandler3(event) }} />
              <button type='submit'>Add</button>
            </form>
          </div>
        </div>
      </FormContainer>
      <Container>
        <Header currentUser={currentUser} displaySettings={displaySettings} displaySettings2={displaySettings2}></Header>

        <div className="container">
          <Rooms rooms={rooms} roomIds={roomIds} currentUser={currentUser} displaySettings3={displaySettings3} changeRoom={handleRoomChange} receivedMessage={received} receivedRoom={receivedRoomId} />
          {
            currentRoom === undefined ?
              <>
                <Welcome currentUser={currentUser} />
              </>
              :
              <>
                <ChatContainer currentUser={currentUser} currentRoom={currentRoom} roomUsers={currentRoomUsers} roomUsersId={currentRoomUsersId} currentRoomId={currentRoomId} displaySetting={displaySettings4} socket={socket} onDisplay={onDisplay} />
              </>
          }
        </div>
      </Container>
    </>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 0.2rem;
  background-color: #131325;
  .container{
    margin-top: 2rem;
    height: 80vh;
    width: 90%;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px){
      grid-template-columns: 35% 65%;
    }
  }
  
`;
const FormContainer = styled.div`
.displayCreate{
  z-index: 99;
  transition: all 0.5ms ease-in-out;
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #2a2a2a6b;
  justify-content: center;
  align-items: center;
  span{
    width: 100%;
    display: flex;
    justify-content: flex-end;
      svg{
      color: white;
      cursor: pointer;
    }
  }
  .dialog-box{
    justify-content: center;
    padding: 5rem 3rem;
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    border: none;
    border-radius: 1rem;
    background-color: black;
    h2{
      color: white;
    }
    form{
    display: flex;
    gap: 2rem;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: black;
    padding: 3rem 7rem;
    border-radius: 3rem;
    input{
        background: transparent;
        outline: none;
        width: 110%;
        border: 1px solid grey;
        border-bottom: 2px solid white;
        padding: 13px;
        border-radius: 5px;
        color: white;
        font-size: 20px;
        transition: 0.4s ease-in-out;
        &:focus{
            border: 1px solid blue;
            border-bottom: 2px solid blue;
        }
        &.visited{ 
            color: black;
            border: 1px solid grey;
            border-bottom: 2px solid white;
            background: white;
        }
    }
    button{
        background-color:white;
        color: black;
        padding: 10px;
        width: 120%;
        justify-content:center;
        align-items:center;
        border-radius: 5px;
        font-size: 20px;
        border: 2px solid white;
        outline: none;
        font-weight: bold;
        cursor: pointer;
        transition: 0.4s ease-in-out;
        &:hover{
            color: white;
            background-color: black;
        }
    }
  }
  .deleteForm{
    display: inline;
    width: 66%;
    padding: none;
    gap: 0px;
    border-radius: none;
    justify-content: space-between;
    align-items: flex-start;
    button{
        display: inline;
        background-color:white;
        color: black;
        padding: 10px;
        margin-inline-end: 25px;
        width: 40%;
        justify-content:center;
        align-items:center;
        border-radius: 5px;
        font-size: 20px;
        border: 2px solid white;
        outline: none;
        font-weight: bold;
        cursor: pointer;
        transition: 0.4s ease-in-out;
        &:hover{
            color: white;
            background-color: black;
        }
    }
  }
  }
} 

`;

export default Chat