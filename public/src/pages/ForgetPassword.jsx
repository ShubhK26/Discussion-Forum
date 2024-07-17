import React, { useState } from 'react'
import styled from 'styled-components'
import { forgetPassRoute, forgotPassRoute } from '../utils/APIRoute'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios' // axios is one of the most famous library of react js for sending Http request and get response from the rest points oor the apis


function ForgetPassword() {
    const navigate = useNavigate();
    const toastCss = {
        position: "top-right",
        theme: "dark",
        autoClose: 5000,
        pauseOnHover: true,
    };
    const [email, setEmail] = useState('');
    const changeHandler=(e)=>{
        setEmail(e.target.value);
    }
    const submitHandler = async (event)=>{
        event.preventDefault();
        if(email === ''){
            toast.error("Email is Required",toastCss);
        }
        else{
            const {data} = await axios.post(forgetPassRoute, { email });
            if (data.status === false){
                toast.error(data.msg,toastCss);
            }
            else{
                toast.success(data.msg, toastCss);
            }
        }
    };
    return (
        <>
            <ToastContainer />
            <FormContainer>
                <form onSubmit={(event) => { submitHandler(event) }}>
                    <div className="heading">
                        <h1>Smart Room</h1>
                    </div>
                    <span>
                        <p>Enter the Registered Email ID</p>
                    </span>
                    <input type="email" name="email" placeholder='Email Address' onChange={(e) => { changeHandler(e) }} min="5" />
                    <button type='submit'>Send Link</button>
                    <span>
                        Note: <p>Link will be valid for 15 minutes only</p><br />
                        Back to <Link to='/'>Login</Link>
                    </span>
                </form>
            </FormContainer>
        </>
    )
}
const FormContainer = styled.div` height: 100vh;
width: 100%;
display: flex;
flex-direction: column;
gap: 1rem;
justify-content: center;
align-items: center;
background-color: #131325;
.heading{
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    h1{
        color: white;
        text-transform: uppercase;
    }
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
    span{
        display: block;
        justify-content: center;
        align-items: center;
        width: 115%;
        color: white;
        font-weight: bold;
        p{
            display: inline-block;
            font-weight: normal;
            font-size: 16px;
        }
            a{
                color: grey;
                font-weight:bold;
                text-decoration: none;
                &:hover{
                    color: white;
                    text-decoration: underline;
                }
            }
    }
}
`;

export default ForgetPassword