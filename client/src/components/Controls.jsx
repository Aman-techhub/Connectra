import { useContext, useEffect, useRef, useState } from "react";
import '../styles/MeetPage.css';
import Button from "@mui/material/Button";
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import LogoutIcon from '@mui/icons-material/Logout';
import PresentToAllIcon from '@mui/icons-material/PresentToAll';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import ForumIcon from '@mui/icons-material/Forum';
import PersonIcon from '@mui/icons-material/Person';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { SocketContext } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";


import RecordRTC from 'recordrtc';
import download from 'downloadjs';
import { Tooltip } from "@mui/material";
import Badge from "@mui/material/Badge";



export default function Controls(props) {
  const { roomId, userId } = props;
  const { tracks, client, socket, setStart, setInCall,  screenTrack, setScreenTrack, participantsListOpen, setParticipantsListOpen, chatsContainerOpen, setChatsContainerOpen} = useContext(SocketContext);
  const [trackState, setTrackState] = useState({ video: true, audio: true });
  const [unreadChats, setUnreadChats] = useState(0);
 
  const [screenSharing, setScreenSharing] = useState(false);


  

  // Screen recording
  const [screenRecording, setScreenrecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const recorderRef = useRef(null);

  const startRecording = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const videoStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const stream = new MediaStream([...audioStream.getTracks(), ...videoStream.getTracks()]);
      const recorder = RecordRTC(stream, { type: 'video' });
      recorderRef.current = recorder;
      recorder.startRecording();
      setScreenrecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    recorderRef.current.stopRecording( async() => {
      const blob = recorderRef.current.getBlob();
      setRecordedBlob(blob);
      setScreenrecording(false);
    });
  };

  const downloadVideo = async () => {
    if (recordedBlob) {
      await download(recordedBlob, 'recorded-video.webm');
      setRecordedBlob(null);
    }
  };



  // Screen sharing
  
  const startScreenSharing = async () => {
    try {
      const screenSharingTrack = await AgoraRTC.createScreenVideoTrack({
        encoderConfig: '1080p_1',
      });
      setScreenTrack(screenSharingTrack);
      setScreenSharing(true);
    } catch (error) {
      console.error('Failed to create screen sharing track:', error);
    }
  };

  const stopScreenSharing = async () => {
    if (!screenTrack) return;

    try {
      await client.unpublish(screenTrack);

      const cameraTrack = tracks?.[1];
      if (cameraTrack && trackState.video) {
        await client.publish(cameraTrack);
      }
    } catch (error) {
      console.error('Failed to stop screen sharing:', error);
    } finally {
      screenTrack.stop();
      setScreenTrack(null);
      setScreenSharing(false);
    }
  };

  useEffect(() =>{
    if(screenSharing){
      
      const cameraTrack = tracks?.[1];
      if (screenTrack && cameraTrack){
        const fun = async () =>{
          try {
            await client.unpublish(cameraTrack);
            await client.publish(screenTrack);
          } catch (error) {
            console.error('Failed to publish screen track:', error);
          }
        }
        fun();
      }
    }
    
  }, [screenTrack, client, screenSharing, tracks]);

  useEffect(() => {
    const onNewChatArrived = ({ msg, room }) => {
      if (room !== roomId) return;
      if (msg?.senderId === userId) return;
      if (!chatsContainerOpen) {
        setUnreadChats((prev) => prev + 1);
      }
    };

    socket.on("new-chat-arrived", onNewChatArrived);

    return () => {
      socket.off("new-chat-arrived", onNewChatArrived);
    };
  }, [socket, roomId, userId, chatsContainerOpen]);

 


  // Conference controls (video and audio)

  const mute = async (type) => {
    if (!tracks) return;

    try {
      if (type === "audio" && tracks[0]) {
        await tracks[0].setEnabled(!trackState.audio);
        setTrackState((ps) => {
          return { ...ps, audio: !ps.audio };
        });
      } else if (type === "video" && tracks[1]) {
        await tracks[1].setEnabled(!trackState.video);
        setTrackState((ps) => {
          return { ...ps, video: !ps.video };
        });
      }
    } catch (error) {
      console.log(`Failed to toggle ${type} track`, error);
    }
  };

  const navigate = useNavigate()

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    tracks[0].close();
    tracks[1].close();
    setStart(false);
    setInCall(false);
    navigate('/');
  };
  


  return (
    <div className="controls-page">

      <div className="controllers-video-part">

          <Tooltip title={trackState.audio ? "Mike is on" : "Mike is off"} placement="top">
            <Button
              variant="contained"
              color={trackState.audio ? "primary" : "secondary"}
              onClick={() => mute("audio")}
            >
              {trackState.audio ? <MicIcon /> : <MicOffIcon />}
            </Button>
          </Tooltip>
        
        
      
        <Tooltip title={trackState.video ? "Camera is on" : "Camera is off"} placement="top">
          <Button
            variant="contained"
            color={trackState.video ? "primary" : "secondary"}
            onClick={() => mute("video")}
          >
            {trackState.video ? <VideocamIcon /> : <VideocamOffIcon />}
          </Button>
        </Tooltip>

        <Tooltip title={screenTrack ? "Stop screen sharing" : "Screen share"} placement="top">
          <Button
            variant="contained"
            color={trackState.video ? "primary" : "secondary"}
            onClick={screenTrack ? stopScreenSharing : startScreenSharing}
          >
            {screenTrack ? <StopScreenShareIcon /> : <PresentToAllIcon />}
          </Button>
        </Tooltip>

        <Tooltip title={screenRecording ? "Stop recording" : "Start recording"} placement="top">
          <Button
            variant="contained"
            color={trackState.video ? "primary" : "secondary"}
            onClick={screenRecording ? stopRecording : startRecording}
          >
            {screenRecording ? <StopCircleIcon /> : <RadioButtonCheckedIcon />}
          </Button>
        </Tooltip>
      {recordedBlob ? 
      
      <Tooltip title="Download" placement="top">
        <Button
          variant="contained"
          color={"error"}
          onClick={downloadVideo}
        >
          <CloudDownloadIcon />
        </Button>
      </Tooltip>
     : ''
    }
      
        <Tooltip title="Leave meet" placement="top">
          <Button
            variant="contained"
            color="inherit"
            onClick={() => leaveChannel()}
          >
            <LogoutIcon />
          </Button>
        </Tooltip>
      
      </div>

      <div className="controllers-chat-participants">
      <Tooltip title="Chats" placement="top">
        <button onClick={()=>{
            const nextOpenState = !chatsContainerOpen;
            setParticipantsListOpen(false);
            setChatsContainerOpen(nextOpenState);
            if (nextOpenState) {
              setUnreadChats(0);
            }
          }}>
           <Badge color="error" badgeContent={unreadChats} max={99} invisible={unreadChats === 0}>
            <ForumIcon />
           </Badge>
        </button>
      </Tooltip>
        <Tooltip title="Participants" placement="top">
          <button onClick={()=>{
            setParticipantsListOpen(!participantsListOpen);
            setChatsContainerOpen(false);
          }}>
           <PersonIcon />
          </button>
        </Tooltip>
      </div>
      
    </div>
      
      
  );
}
