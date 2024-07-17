import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { forgetPassRoute, forgotPassRoute } from '../utils/APIRoute'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios' // axios is one of the most famous library of react js for sending Http request and get response from the rest points oor the apis
import {resetPassRoute} from '../utils/APIRoute'
import {Icon} from 'react-icons-kit';
import {eye,eyeOff} from 'react-icons-kit/feather'

function ResetPassword() {
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
    const toastCss = {
    position: "top-right",
    theme: "dark",
    autoClose: 5000,
    pauseOnHover: true,
};
    const {id,token} = useParams();
    const [passswords, setPassswords] = useState({
        password: "",
        confirmPassword: ""
    });
    const changeHandler = (e)=>{
        setPassswords({...passswords, [e.target.name]: e.target.value });
        console.log(process.env.JWT_SECRET);
    };
    const submitHandler = async (e)=>{
        e.preventDefault();
        const { password, confirmPassword } = passswords;
        console.log(id, token);
        if(password === ""){
            toast.error("Password should not be empty",toastCss);
        }
        else if(password.length <8){
            toast.error("Password must contain atleast 8 characters",toastCss);
        }
        else if(confirmPassword !== password){
            toast.error("Passwords does not match",toastCss);
        }
        else{
            const { data } = await axios.post(`${resetPassRoute}/${id}/${token}`, {
                password
            });
            if (!data.status) {
                toast.error(data.msg, toastCss);
            }
            else{
                toast.success(data.msg,toastCss);
            }
        }
    }
  return (
    <>
            <ToastContainer />
            <FormContainer>
                <form onSubmit={(event) => { submitHandler(event) }}>
                    <div className="heading">
                        <h1>Smart Room</h1>
                    </div>
                    <span>
                        <p>Reset Password</p>
                    </span>
                    <div className="passwordFields"> 
                        <input type={type} name="password" placeholder='Password' onChange={(e) => { changeHandler(e) }} minLength="8" />
                        <span className='icons'><Icon icon={icon} size={20} onClick={()=>{toggleHandler()}} /></span>
                    </div>
                    <div className="passwordFields"> 
                        <input type={type2} name="confirmPassword" placeholder='Confirm Password' onChange={(e) => { changeHandler(e) }} minLength="8" />
                        <span className='icons'><Icon icon={icon2} size={20} onClick={()=>{toggleHandler2()}} /></span>
                    </div>
                    <button type='submit'>Reset</button>
                    <span>
                        Note: <p>Link will be valid for 15 minutes only</p>
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
    }
}
`;
export default ResetPassword