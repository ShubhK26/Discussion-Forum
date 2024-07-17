import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios' // axios is one of the most famous library of react js for sending Http request and get response from the rest points oor the apis
import { registrationRoute } from '../utils/APIRoute'
import styled from 'styled-components'
import {Icon} from 'react-icons-kit';
import {eye,eyeOff} from 'react-icons-kit/feather'

function Registration() {
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(eyeOff);
    const [type2, setType2] = useState('password');
    const [icon2, setIcon2] = useState(eyeOff);
    const toggleHandler = ()=>{
        if(type === 'password'){
            setIcon(eye);
            setType('text');
        }
        else{
            setIcon(eyeOff);
            setType('password');
        }
    }
    const toggleHandler2 = ()=>{
        if(type2 === 'password'){
            setIcon2(eye);
            setType2('text');
        }
        else{
            setIcon2(eyeOff);
            setType2('password');
        }
    }
    const navigate = useNavigate();
    const toastCss = {
        position: "top-right",
        theme: "dark",
        autoClose: 5000,
        pauseOnHover: true,
    };
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const submitHandler = async (event) => { // async is used for asyncronous functions here submitHandlers is async function. 
        event.preventDefault();
        if (validationHandler()) {
            const { username, email, password } = values;
            console.log(registrationRoute);
            const { data } = await axios.post(registrationRoute, {
                username, email, password
            }); // await is used to make the function wait for the promise or the result
            if (data.status === false) {
                toast.error(data.msg, toastCss);
            }
            if (data.status === true) {
                localStorage.setItem('chat-user', JSON.stringify(data.user));
                navigate("/setProfile");
            }
        }
    };
    const changeHandler = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };
    const validationHandler = () => {
        const { password, confirmPassword, username, email } = values;
        if (password.length < 8) {
            toast.error("Password should contain atleast 8 characters", toastCss);
        }
        else if (password !== confirmPassword) {
            toast.error("Passwords does not match!", toastCss);
            return false;
        }
        else if (username.length < 5) {
            toast.error("Username should contain 5 characters atleast", toastCss);
            return false;
        }
        else if (email.length === 0) {
            toast.error("Email is required", toastCss);
            return false;
        }
        return true;
    }
    return (
        <>
            <ToastContainer />
            <FormContainer>
                <form onSubmit={(event) => { submitHandler(event) }}>
                    <div className="heading">
                        <h1>Smart Room</h1>
                    </div>
                    <input type="text" name="username" placeholder='Username' onChange={(e) => { changeHandler(e) }} />
                    <input type="email" name="email" placeholder='Email' onChange={(e) => { changeHandler(e) }} />
                    <div className="passwordFields"> 
                        <input type={type} name="password" placeholder='Password' onChange={(e) => { changeHandler(e) }} minLength="8" />
                        <span className='icons'><Icon icon={icon} size={20} onClick={()=>{toggleHandler()}} /></span>
                    </div>
                    <div className="passwordFields"> 
                        <input type={type2} name="confirmPassword" placeholder='Confirm Password' onChange={(e) => { changeHandler(e) }} minLength="8" />
                        <span className='icons'><Icon icon={icon2} size={20} onClick={()=>{toggleHandler2()}} /></span>
                    </div>
                    <button type='submit'>Create Account</button>
                    <span>Already have an account? <Link to="/">Login</Link> </span>
                </form>
            </FormContainer>
        </>
    )
}
const FormContainer = styled.div`
height: 100vh;
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
        &.visited{ 
            color: black;
            border: 1px solid grey;
            border-bottom: 2px solid white;
            background: white;
        }
    }
    .passwordFields{
            display: grid;
            grid-template-columns: 85% 15%;
            justify-content: space-between;
            align-items: center;
            width: 118%;
            input{
                background: transparent;
                outline: none;
                border: 1px solid grey;
                border-bottom: 2px solid white;
                border-radius: 5px;
                color: white;
                font-size: 20px;
                transition: 0.4s ease-in-out;
                &:focus{
                   border: 1px solid blue;
                   border-bottom: 2px solid blue;
                }
            }
            span{
                justify-content: center;
                align-items: center;
                cursor: pointer;
                padding: 30%;
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
        color: white;
        width: 110%;
        font-size: 16px;
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

export default Registration