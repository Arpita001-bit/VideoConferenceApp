import React, { useState, useRef, useEffect } from 'react'
import { Button, IconButton, TextField , Badge } from '@mui/material';
import { io } from "socket.io-client";
import styles from "../styles/videoComponent.module.css"
import { Input } from "@mui/material";
import VideocamIcon from '@mui/icons-material/Videocam'
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import { useNavigate } from 'react-router-dom';
import servers from '../environment';




const server_url = servers.prod;

var connections = {}

const peerConfigConnections = {
    "iceServers":[
        {"urls":"stun:stun.l.google.com:19302"}
    ]
}

export default function VideoMeetComponent(){

var socketRef = useRef();
let socketId = useRef();

let localVedioRef = useRef();
let [videoAvailable , setVideoAvailable] = useState(true);
let [audioAvailable , setAudioavailable] = useState(true);

let [video , setVideo] = useState(true);
let [audio , setAudio] =  useState(true);

let [screen, setScreen] = useState(false);  
let [showModel , setModel] = useState(true);

let [screenAvailable , setScreenAvailable] = useState(true);

let [messages , setMessages] = useState([])
let [message , setMessage] = useState("")
let [newMessages , setNewMessages ] = useState(7)

let [askForUsername, setAskForUsername] = useState(true)
let [username, setUsername] = useState("");

const videoRef = useRef([])

let [videos , setVideos] = useState([])


const negotiating = useRef({})

const getPermissions = async()=>{
    try{
       
        let hasVideo = false;
        let hasAudio = false;

        try{
            const videoPermission = await navigator.mediaDevices.getUserMedia({video:true})
            if(videoPermission){
                hasVideo = true;
                setVideoAvailable(true);
                
                videoPermission.getTracks().forEach(t=>t.stop());
            }else{
                setVideoAvailable(false);
            }
        }catch(e){
            setVideoAvailable(false);
        }

        try{
            const audioPermission = await navigator.mediaDevices.getUserMedia({audio:true})
            if(audioPermission){
                hasAudio = true;
                setAudioavailable(true);
                audioPermission.getTracks().forEach(t=>t.stop());
            }else{
                setAudioavailable(false);
            }
        }catch(e){
            setAudioavailable(false);
        }

        if(navigator.mediaDevices.getDisplayMedia){
            setScreenAvailable(true);
        }else{
            setScreenAvailable(false);
        }

        
        if(hasVideo || hasAudio){
            const UserMediaStream = await navigator.mediaDevices.getUserMedia({video:hasVideo , audio:hasAudio});

            if(UserMediaStream){
                window.localStream = UserMediaStream;
                if(localVedioRef.current){
                    localVedioRef.current.srcObject = UserMediaStream;
                }
            }
        }
    }catch (error){
        console.log(error);
    }
}

useEffect(() => {
    getPermissions();
}, [])

useEffect(() => {
    if (localVedioRef.current && window.localStream) {
        localVedioRef.current.srcObject = window.localStream;
    }
    const retry = setTimeout(() => {
        if (localVedioRef.current && window.localStream) {
            localVedioRef.current.srcObject = window.localStream;
        }
    }, 500);
    return () => clearTimeout(retry);
}, [askForUsername])


const applyLocalStreamToConnection = (id) => {
    let needsRenegotiation = false;
    const senders = connections[id].getSenders();

    window.localStream.getTracks().forEach((track) => {
        const existingSender = senders.find(s => s.track && s.track.kind === track.kind);
        if (existingSender) {
            existingSender.replaceTrack(track);
        } else {
            connections[id].addTrack(track, window.localStream);
            needsRenegotiation = true;
        }
    });

    return needsRenegotiation;
}

const renegotiate = (id) => {
    if (negotiating.current[id]) return;
    negotiating.current[id] = true;

    connections[id].createOffer().then((description)=>{
        connections[id].setLocalDescription(description)
        .then(()=>{
            socketRef.current.emit("signal", id, JSON.stringify({"sdp":connections[id].localDescription}))
        })
        .catch(e=>console.log(e))
        .finally(()=>{ negotiating.current[id] = false; })
    }).catch(e=>{
        console.log(e);
        negotiating.current[id] = false;
    })
}

let getUserMediaSuccess = (stream)=>{
    try{
        if (window.localStream) {
            window.localStream.getTracks().forEach(track=>track.stop())
        }
    }catch(e){
        console.log(e);
    }

   window.localStream = stream;
if (localVedioRef.current) {
    localVedioRef.current.srcObject = stream;
}
    for(let id in connections){
        if(id == socketId.current) continue;

        const needsRenegotiation = applyLocalStreamToConnection(id);
        if (needsRenegotiation) {
            renegotiate(id);
        }
    }

    stream.getTracks().forEach(track=>track.onended=()=>{
        setVideo(false);
        setAudio(false);

        try{
            let tracks = localVedioRef.current.srcObject.getTracks()
            tracks.forEach(track=>track.stop())
        }catch(e){console.log(e)}

        let blackSilence = (...args)=>new MediaStream([black(...args),silence()]);
        window.localStream = blackSilence();
        localVedioRef.current.srcObject = window.localStream;

        for(let id in connections){
           
            if(id == socketId.current) continue;

            const needsRenegotiation = applyLocalStreamToConnection(id);
            if (needsRenegotiation) {
                renegotiate(id);
            }
        }
    })
}

let silence = ()=>{
    let cntx = new AudioContext()
    let oscillator = cntx.createOscillator()

    let dst = oscillator.connect(cntx.createMediaStreamDestination());

    oscillator.start();
    cntx.resume()
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
}

let black = ({width=640,height=480}={})=>{
    let canvas  = Object.assign(document.createElement("canvas"),{width,height});
    canvas.getContext('2d').fillRect(0,0,width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0],{enabled:false})
}

let getUserMedia = ()=>{
    if((video && videoAvailable)||(audio && audioAvailable)){
        navigator.mediaDevices.getUserMedia({video:video , audio:audio})
        .then(getUserMediaSuccess)
        .then((stream)=>{ })
        .catch((e)=> console.log(e))
    }else{
        try{
            let tracks = localVedioRef.current.srcObject.getTracks();
            tracks.forEach(track=>track.stop())
        }catch(e){
        }
    }
}

useEffect(()=>{
    if(video!== undefined && audio !== undefined){
        getUserMedia();
    }
},[audio,video])

let addMessage = (data , sender , socketIdSender)=>{

    setMessages((prevMessages)=>[
        ...prevMessages,
        {sender:sender,data:data}
    ]);

    if(socketIdSender !== socketId.current){
        setNewMessages((prevMessage)=>prevMessage+1)

    }

}

const pendingCandidates = useRef({});


let gotMessageFromServer = (fromId,message)=>{
    var signal = JSON.parse(message)

   if(fromId !== socketId.current){
       
        const conn = connections[fromId];
        if(!conn){
            console.log(`Received signal for unknown connection ${fromId}, dropping`);
            return;
        }

        if(signal.sdp){
            conn.setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(()=>{

               
                (pendingCandidates.current[fromId] || []).forEach(c =>
                    conn.addIceCandidate(c).catch(e=>console.log(e))
                );
                pendingCandidates.current[fromId] = [];

                if(signal.sdp.type == "offer"){
                    conn.createAnswer().then((description)=>{
                        conn.setLocalDescription(description).then(()=>{
                            socketRef.current.emit("signal",fromId,JSON.stringify({"sdp":conn.localDescription}))
                        }).catch((e)=>console.log(e))
                    }).catch(e=>console.log(e))
                }
            }).catch(e=>console.log(e))
        }

        if(signal.ice){
            if(conn.remoteDescription && conn.remoteDescription.type){
                conn.addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e=>console.log(e));
            } else {
                if(!pendingCandidates.current[fromId]) pendingCandidates.current[fromId] = [];
                pendingCandidates.current[fromId].push(new RTCIceCandidate(signal.ice));
            }
        }
    }
}

let connectToScoketServer =()=>{
    socketRef.current = io.connect(server_url,{secure:false})
    socketRef.current.on('signal',gotMessageFromServer);
    socketRef.current.on("connect",()=>{
        socketRef.current.emit("join-call",window.location.href)
        socketId.current = socketRef.current.id
        socketRef.current.on("chat-message", addMessage)

        socketRef.current.on("user-left",(id)=>{
            setVideos((prevVideos)=> prevVideos.filter((video)=>video.socketId!== id))
        })

        socketRef.current.on("user-joined",(id,clients)=>{
            clients.forEach((socketListId)=>{
                connections[socketListId] = new RTCPeerConnection(peerConfigConnections)

                connections[socketListId].onicecandidate = (event)=>{
                    if(event.candidate != null){
                        socketRef.current.emit("signal", socketListId, JSON.stringify({'ice':event.candidate}))
                    } 
                }

                connections[socketListId].ontrack = (event)=>{
                    let videoExsists = videoRef.current.find(video=>video.socketId == socketListId);

                    if(videoExsists){
                        setVideos((videos)=>{
                            const updatedVideos = videos.map(video=>
                                video.socketId == socketListId?{...video,stream:event.streams[0]}:video
                            );
                            videoRef.current = updatedVideos;
                            return updatedVideos;
                        })
                    }else{
                        let newVideo = {
                            socketId : socketListId,
                            stream:event.streams[0],
                            autoPlay:true,
                            playsinline:true
                        }

                        setVideos(videos=>{
                            const updatedVideos = [...videos , newVideo];
                            videoRef.current = updatedVideos;
                            return updatedVideos;
                        })
                    }
                };

                if(window.localStream !== undefined && window.localStream !== null){
                    window.localStream.getTracks().forEach(track=>{
                        connections[socketListId].addTrack(track, window.localStream);
                    });
                }else{
                    let blackSilence = (...args)=> new MediaStream([black(...args),silence()]);
                    window.localStream = blackSilence();
                    window.localStream.getTracks().forEach(track=>{
                        connections[socketListId].addTrack(track, window.localStream);
                    });
                }
            })

            if( id === socketId.current){
                for( let id2 in connections){
                    if(id2 === socketId.current) continue

                    try{
                        window.localStream.getTracks().forEach(track=>{
                            connections[id2].addTrack(track, window.localStream);
                        });
                    }catch(e){}

                    renegotiate(id2);
                }
            }
        })
    })
}

let getMedia = ()=>{
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    getUserMedia();          

    connectToScoketServer();
}

let routeTo = useNavigate();

let handleVideo=()=>{
    setVideo(!video);
}

let handleAudi=()=>{
    setAudio(!audio)
}

let handleScreen = ()=>{
    setScreen(!screen);
}

let handleEndCall = () => {
    console.log("END CALL CLICKED");

    routeTo("/home");

    console.log("NAVIGATION CALLED");
};

let sendMessage = ()=>{
    socketRef.current.emit("chat-message",message,username);
    setMessage("");
}

let getDisplayMediaSuccess = (stream)=>{
    try{
        window.localStream.getTracks().forEach(track=>track.stop())
    }catch(e){
        console.log(e)
    }

    window.localStream = stream;
    localVedioRef.current.srcObject = stream;

    for( let id in connections){
        if(id === socketId.current) continue;

        connections[id].addStream(window.localStream)
        connections[id].createOffer().then((description)=>[
            connections[id].setLocalDescription(description)
            .then(()=>{
                socketRef.current.emit("signal",id,JSON.stringify({"sdp" :connections[id].localDescription}))
            })
            .catch(e => console.log(e))
        ])
    }
     stream.getTracks().forEach(track=>track.onended=()=>{
        setScreen(false);
        setAudio(false);

        try{
            let tracks = localVedioRef.current.srcObject.getTracks()
            tracks.forEach(track=>track.stop())
        }catch(e){console.log(e)}

        let blackSilence = (...args)=>new MediaStream([black(...args),silence()]);
        window.localStream = blackSilence();
        localVedioRef.current.srcObject = window.localStream;

       getUserMedia();
    })
}


let getDisplayMedia = () => {
    if (screen && navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
            .then(getDisplayMediaSuccess)
            .catch((e) => console.log(e));
    }
}
useEffect(()=>{
    if(screen !== undefined){
        getDisplayMedia();
    }
},[screen])
let connect = ()=>{
    setAskForUsername(false);
    getMedia();
}

    return (<div>
       {askForUsername === true ?
       
       <div>
        <h2>Enter The Lobby </h2>
        <TextField id="outlined-basic" label="username" value={username} onChange={e=>setUsername(e.target.value)} variant="outlined" />
            <Button variant="contained" onClick={connect}>Connect</Button>

            <div>
                <video ref={localVedioRef} autoPlay muted></video>
            </div>
       </div>:
       <div className={styles.meetVideoContained}>
        {showModel ? 
        <div className={styles.chatRoom}>
            <div className={styles.chatContainer}>
            <h1>ChatRoom</h1>

<div className={styles.chatingDisplay}>
  {messages.length > 0 ? (
    messages.map((item, index) => (
      <div style={{ marginBottom: "20px" }} key={index}>
        <p style={{ fontWeight: "bold" }}>{item.sender}</p>
        <p>{item.data}</p>
      </div>
    ))
  ) : (
    <p>no messages yet</p>
  )}
</div>
            <div className={styles.chatingArea}>
            <TextField  value={message} onChange={e=>setMessage(e.target.value)} id="standard-basic" label="Message" variant="standard" />
            <Button onClick={sendMessage} variant = "contained">Send</Button>
            </div>
            </div>

        </div>:<></>}
        <div className={styles.buttonContainer}>
            <IconButton onClick={handleVideo} style={{color:"white"}}>
                {(video===true)?<VideocamIcon/>:<VideocamOffIcon/>}
            </IconButton>
            <IconButton   onClick={handleEndCall} style={{color:"red"}}>
                <CallEndIcon/>
            </IconButton>
            <IconButton onClick={handleAudi} style={{color:"white"}}>
                {audio === true ? <MicIcon/>:<MicOffIcon/>}
            </IconButton>

            {screenAvailable===true?
            <IconButton onClick={handleScreen} style={{color:"white"}}>{screen==true?<ScreenShareIcon/>:<StopScreenShareIcon/>}
            </IconButton>:<></>}
            <Badge badgeContent = {newMessages} max={999} color='secondary'>
            <IconButton onClick={()=>setModel(!showModel)} style={{color:"white"}}>
                <ChatIcon/>
            </IconButton>
            </Badge>
        </div>


       <video className={styles.meetUserVideo} ref = {localVedioRef} autoPlay muted></video>

       {videos.map((video)=>(
        <div className={styles.conference} key={video.socketId}>
            <h2>{video.socketId}</h2>
            
            <video 
            data-socket={video.socketId}
            ref={ref=>{
                if(ref && video.stream){
                    ref.srcObject = video.stream;
                }
            }}
            autoPlay
            >

            </video>
        </div>
       ))}
       
       </div>
       }
        
    </div>)
}