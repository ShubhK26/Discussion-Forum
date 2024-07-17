import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import Robot from '../assets/robot.gif'

export default function Welcome({ currentUser }) {
    const [currentUsername, setCurrentUsername] = useState(undefined);
    useEffect(() => {
        if (currentUser) {
            setCurrentUsername(currentUser.username);

        }
    }, [currentUser]);
  return (
    <Container>
        <img src={Robot} alt="Hello" />
        <h1>
            Hello, <span>{currentUsername}</span>
        </h1>
        <h3>
            Please Select a Room and start chatting
        </h3>
    </Container>
  )
}
const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
color: white;
img{
    height: 20rem;
}
span{
    color: #902090;
}
`;