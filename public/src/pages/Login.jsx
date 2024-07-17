import React, { useState } from 'react'
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios' // axios is one of the most famous library of react js for sending Http request and get response from the rest points oor the apis
import { loginRoute } from '../utils/APIRoute'
import {Icon} from 'react-icons-kit';
import {eye,eyeOff} from 'react-icons-kit/feather'

function Login() {
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(eyeOff);
    const navigate = useNavigate();
    const toastCss = {
        position: "top-right",
        theme: "dark",
        autoClose: 5000,
        pauseOnHover: true,
    };
    const [values, setValues] = useState({
        username: "",
        password: "",
    });

    const submitHandler = async (event) => { // async is used for asyncronous functions here submitHandlers is async function. 
        event.preventDefault();
        if (validationHandler()) {
            const { username, password } = values;
            console.log(loginRoute);
            const { data } = await axios.post(loginRoute, {
                username, password
            }); // await is used to make the function wait for the promise or the result
            if (data.status === false) {
                toast.error(data.msg, toastCss);
            }
            if (data.status === true) {
                localStorage.setItem('chat-user', JSON.stringify(data.user));
                console.log(localStorage.getItem('chat-user'))
                console.log(data.profileSet);
                if (data.profileSet === true)
                    navigate("/chats");
                else
                    navigate("/setProfile");
            }
        }
    };
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
    const changeHandler = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };
    const validationHandler = () => {
        const { password, username } = values;
        if (password === "") {
            toast.error("Password is required", toastCss);
            return false;
        }
        else if (username === "") {
            toast.error("Username is required", toastCss);
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
                    <input type="text" name="username" placeholder='Username' onChange={(e) => { changeHandler(e) }} min="5" />
                    <div className="passwordFields"> 
                        <input type={type} name="password" placeholder='Password' onChange={(e) => { changeHandler(e) }} minLength="8" />
                        <span className='icons'><Icon icon={icon} size={20} onClick={()=>{toggleHandler()}} /></span>
                    </div>
                    <span>
                        <Link to="/forgetPassword">Forgot Password?</Link>
                    </span>
                    <button type='submit'>Login</button>
                    <span>Don't have an account? <Link to="/register">Register Here</Link> </span>
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
            width: 115%;
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
export default Login