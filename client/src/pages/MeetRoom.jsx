import React, { useContext, useEffect, useRef, useState } from 'react';
import '../styles/MeetPage.css';
import {useParams} from 'react-router-dom';
import { SocketContext } from '../context/SocketContext';
import { config } from '../AgoraSetup';
import VideoPlayer from '../components/VideoPlayer';
import Controls from '../components/Controls';
import Participants from '../components/Participants';
import Chat from '../components/Chat';


const MeetRoom =  () => {
  const {id} = useParams();
  const [roomName, setroomName] = useState('')
  const {socket, setInCall, client, users, setUsers, ready, tracks, setStart, setParticipants, start} = useContext(SocketContext);
  const userId = localStorage.getItem("userId");
  const agoraUidRef = useRef(userId && userId !== 'null' ? userId : `guest-${Date.now()}`);

  // let useRtmChannel = null;
  useEffect(() =>{
    // socket.emit('request-to-join-room', {userId, roomId: id});
    socket.emit('join-room', {userId, roomId: id});
    const onUserJoined = async () => {
      setInCall(true);
    };

    socket.emit('get-participants', {roomId: id});
    const onParticipantsList = async ({usernames, roomName}) => {
      setParticipants(usernames);
      setroomName(roomName);
    };

    socket.on("user-joined", onUserJoined);
    socket.on("participants-list", onParticipantsList);

    // socket.on("user-requested-to-join", async ( {participantId, hostId})=>{
      
    //   if (hostId === userId){

    //     if (window.confirm("Do you really want to leave?")) {
    //       alert("holaa");
    //     }
    //   }
    //   }) 
    return () => {
      socket.off("user-joined", onUserJoined);
      socket.off("participants-list", onParticipantsList);
    };
    }, [socket, id, userId, setInCall, setParticipants]);
   

      // const chan = useRtmChannel(rtmClient);
      // setMsgChannel(chan);
    
    
    useEffect(() => {
      const onUserPublished = async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          if (mediaType === "video") {
            setUsers((prevUsers) => {
              if (prevUsers.some((existingUser) => existingUser.uid === user.uid)) {
                return prevUsers;
              }
              return [...prevUsers, user];
          });
          }
          if (mediaType === "audio") {
            user.audioTrack.play();
          }
        };
  
      const onUserUnpublished = (user, mediaType) => {
          if (mediaType === "audio") {
            if (user.audioTrack) user.audioTrack.stop();
          }
          if (mediaType === "video") {
            setUsers((prevUsers) => {
              return prevUsers.filter((User) => User.uid !== user.uid);
            });
          }
        };
  
      const onUserLeft = (user) => {
          socket.emit("user-left-room", {userId: user.uid, roomId: id});
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        };

      const init = async (name) => {
        client.on("user-published", onUserPublished);
        client.on("user-unpublished", onUserUnpublished);
        client.on("user-left", onUserLeft);
  
        try {
          await client.join(config.appId, name, config.token, agoraUidRef.current);
        } catch (error) {
          console.log("Join failed", error);
          return;
        }
  
        if (tracks && tracks[0] && tracks[1]) {
          await client.publish([tracks[0], tracks[1]]);
        }
        setStart(true);
  
        
        
      };
      
        
        if (ready && tracks) {
        try {
          init(id);
        } catch (error) {
          console.log(error);
        }
      }

      return () => {
        client.off("user-published", onUserPublished);
        client.off("user-unpublished", onUserUnpublished);
        client.off("user-left", onUserLeft);
      };
    }, [id, client, ready, tracks, socket, setUsers, setStart]);

  


 
  return (

    <div className='meetPage'>

        <div className="meetPage-header">
          <h3>Meet: <span>{roomName}</span></h3>
          <p>Meet Id: <span id='meet-id-copy'>{id}</span></p>
        </div>

        

        <Participants />

        <Chat roomId={id} userId={userId}  />
       

        <div className="meetPage-videoPlayer-container">

        {start && tracks ?
        <VideoPlayer tracks={tracks} users={users} />
        : ''
        }

        </div>

        <div className="meetPage-controls-part">

        {ready && tracks && (
          <Controls tracks={tracks} roomId={id} userId={userId} />
        )}

        </div>

        

    </div>
  )
}

export default MeetRoom;