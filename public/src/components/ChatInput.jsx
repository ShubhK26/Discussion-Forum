import React, {useState} from 'react';
import styled from 'styled-components';
import Picker from 'emoji-picker-react'
import { Icon } from 'react-icons-kit';
import { send } from 'react-icons-kit/feather';
import { BsEmojiSmileFill } from 'react-icons/bs';

export default function ChatInput({ handleSendMessage }) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [message, setMessage] = useState("");
    const handleEmojiPickerHideShow = ()=>{
        setShowEmojiPicker(!showEmojiPicker)
    } 
    const handleEmojiClick = (event, emoji)=>{
        let msg = message;
        msg += emoji.emoji;
        setMessage(msg);
    }
    const sendChat = (e)=>{
        e.preventDefault();
        if(message.length>0){
            handleSendMessage(message);
            setMessage("");
        }
    }
    return (
        <Container>
            <div className="button-container">
                <div className="emoji">
                    <BsEmojiSmileFill onClick={()=>{handleEmojiPickerHideShow()}} />{
                        showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />
                    }
                </div>
            </div>
            <form className="input-container" onSubmit={(e)=>{sendChat(e)}}>
                <input type="text" autoComplete='off' name="textMessage" id="textMessage" placeholder='Type a message' value={message} onChange={(e)=>{setMessage(e.target.value)}} />
                <button className='submit'>
                    <Icon icon={send} size={25} />
                </button>
            </form>
        </Container>
    )
}

const Container = styled.div`
display: grid;
grid-template-columns: 5% 95%;
align-items: center;
background-color: #262650;
padding: 0.2rem;
padding-bottom: 0.3rem;
.button-container{
    margin-top: 5%;
    display: flex;
    color: white;
    gap: 1rem;
    height: 100%;
    align-items: center;
    justify-content: center;
    .emoji{
        position: relative;
        .emoji-picker-react{
            position: absolute;
            top: -350px;
            background-color: #080420;
            box-shadow: 0 2px 5px #905090;
            border-color: #905090;
            .emoji-scroll-wrapper::-webkit-scrollbar{
                background-color: #080420;
                width: 5px;
                &-thumb{
                    background-color: #905090;
                }
            }
            .emoji-categories{
                button{
                    filter: contrast(0);
                }
            }
            .emoji-search{
                background-color: transparent;
                border-color: #905090;
                color: white;
            }
            .emoji-group::before{
                background-color: #080420;
            }
        }
        svg {
            font-size: 1.4rem;
            cursor:  pointer;
        }
    }
}
.input-container{
    width: 95%;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff39;
    input{
        width: 90%;
        height: 60%;
        background-color: transparent;
        color: white;
        border: none;
        outline: none;
        padding-left: 1rem;
        font-size: 18px;
        &::selection{
            background-color: #262650;
        }
        &:focus{
            outline: none;
        }
    }
    button{
        padding: 0.3rem 2rem;
        border-radius: 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #901090;
        color: white;
        border: 2px solid #901090;
        outline: none;
        cursor: pointer;
        transition: 0.3s ease-in-out;
        &:hover{
            color: white;
            background-color: #ac79ff;
        }
    }
}
`;
