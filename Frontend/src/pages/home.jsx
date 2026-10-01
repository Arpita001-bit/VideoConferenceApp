


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import withAuth from "../withAuth";

// import "../App.css";

// import { Button, IconButton, TextField } from '@mui/material';
// import { IoReload } from "react-icons/io5";
// import { AuthConext } from '../contexts/Authentication';

// function HomeComponent() {

//     let navigate = useNavigate();

//     const [meetingCode, setMeetingCode] = useState("");

//     const {addToUserHistory} = useContext(AuthConext);

//     let handleJoinVideoCall = async () => {
//         await addToUserHistory(meetingCode)
//         navigate(`/${meetingCode}`);
//     }

//     return (
//         <>
//             <div className="navBar">
//                 <div style={{ display: "flex", alignItems: "center" }}>
//                     <h3>Convo</h3>
//                 </div>

//                 <div style={{ display: "flex", alignItems: "center" }}>
//                     <IconButton>
//                         <p>History</p>
//                         <IoReload />
//                     </IconButton>
//                     <Button onClick={()=>{
//                         localStorage.removeItem("token")
//                         navigate("/auth")
//                     }} >
//                         Logout

//                     </Button>
//                 </div>
//             </div>

//             <div className="meetContainer">
//                 <div className="leftPanel">
//                     <div>
//                         <h3>Providing Quality Video Call </h3>
//                         <div style={{display:"flex", gap:"10px"}}>
//                             <TextField onChange={e=>setMeetingCode(e.target.value)} id="outlined-basic" label="Meeting Code" variant='outlined' />
//                                 <Button onClick={handleJoinVideoCall } variant='contained'>Join </Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default withAuth(HomeComponent);

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import withAuth from "../withAuth";

import "../App.css";

import { Button, IconButton, TextField } from '@mui/material';
import { IoReload } from "react-icons/io5";
import { AuthConext } from '../contexts/Authentication';

function HomeComponent() {
    const navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const { addToUserHistory } = useContext(AuthConext);

    const handleJoinVideoCall = async () => {
        await addToUserHistory(meetingCode);
        navigate(`/${meetingCode}`);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/auth");
    };

    return (
        <>
            <div className="navBar">
                <div style={{ display: "flex", alignItems: "center" }}>
                    <h3>Convo</h3>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <IconButton onClick={
                        ()=>{
                            navigate("/history")
                        }
                    }>
                        <p>History</p>
                        <IoReload />
                    </IconButton>
                    <Button onClick={handleLogout}>Logout</Button>
                </div>
            </div>

            <div className="meetContainer">
                <div className="leftPanel">
                    <div>
                        <h3>Providing Quality Video Call</h3>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <TextField
                                onChange={(e) => setMeetingCode(e.target.value)}
                                id="outlined-basic"
                                label="Meeting Code"
                                variant="outlined"
                            />
                            <Button onClick={handleJoinVideoCall} variant="contained">
                                Join
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default withAuth(HomeComponent);