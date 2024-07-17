import React, { useState, useEffect } from 'react';
import axios from 'axios';
import loading from '../assets/loading3.gif';
import { ToastContainer, toast } from 'react-toastify';
import { profileRoute } from '../utils/APIRoute';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Buffer } from 'buffer';

function ProfilePic() {
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchData() {
            if(!localStorage.getItem("chat-user")){
                navigate("/login");
            }
        };
        fetchData();
    }, []);
    const api = "https://api.multiavatar.com/456789";
    const [profiles, setProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState(undefined);
    const toastCss = {
        position: "top-right",
        theme: "dark",
        autoClose: 5000,
        pauseOnHover: true,
    };
    const setProfilePic = async () => {
        if (selected === undefined) {
            toast.error("Please Select an Avatar",toastCss);
        }
        else{
            console.log(localStorage.getItem('chat-user'));
            const user = await JSON.parse(localStorage.getItem('chat-user'));
            console.log(user, user._id);
            const {data} = await axios.post(`${profileRoute}/${user._id}`,{
                image: profiles[selected]
            });
            console.log(data);
            if(data.profileSetStatus){
                user.isProfilePicSet = true;
                user.ProfilePic = data.image;
                localStorage.setItem("chat-user", JSON.stringify(user));
                navigate("/chats");
            }
            else{
                toast.error("Error setting profile Picture please try again!!", toastCss);
            }
        }
    };
    useEffect(() => {
        async function fetchData() {
            const data = [];
            for (let i = 0; i < 5; i++) {
                const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
                const buffer = new Buffer(image.data);
                data.push(buffer.toString("base64"));
            }
            setProfiles(data);
            setIsLoading(false);
        }
        fetchData();
    }, []);


    return (
        <>
            {
                isLoading ? 
                <Container>
                    <img src={loading} alt="loading" className='loader' />
                </Container> :
                    <Container>
                        <div className="heading">
                            <h1>Choose a Profile Picture that suits you</h1>
                        </div>
                        <div className="profiles">
                            {
                                profiles.map((profile, index) => {
                                    return (
                                        <div key={index} className={`profile ${selected === index ? "selected" : ""}`}>
                                            <img src={`data: image/svg+xml;base64,${profile}`} alt="profile"
                                                onClick={() => { setSelected(index) }}
                                            />
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <button type='submit' onClick={() => { setProfilePic() }} >Set Profile</button>
                    </Container>
            }
            <ToastContainer />

        </>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #131325;
    gap: 2rem;
    height: 100vh;
    width: 100%;
    .loader{
        max-inline-size: 100%;
        background-color: transparent;
        border-radius: 3rem;
    }
    .heading{
        h1{
            color: white;
        }
    }
    .profiles{
        display: flex;
        gap: 3rem;
        .profile{
            border: 5px solid transparent;
            padding: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            transition: 0.4s ease-in-out;
            img{
                height: 6rem;
            }
        }
        .selected{
            border: 5px solid white;
        }
    }
    button{
        background-color:white;
        color: #131325;
        padding: 10px;
        width: auto;
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
            background-color: transparent;
        }
    }
`;

export default ProfilePic;