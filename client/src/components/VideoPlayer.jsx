import { AgoraVideoPlayer } from "agora-rtc-react";

import { SocketContext } from "../context/SocketContext";
import { useContext } from "react";

export default function Video(props) {
  const { users, tracks, participants} = useContext(SocketContext);
  const localVideoTrack = tracks?.[1];
  

  return (

    <div className="videoPlayer-page">
      
        <div className="videoplayer-video" style={users.length < 1 ? {height: "72vh", width: "60vw"} : users.length === 1 ? {height: "65vh", width: "45vw"} : {}}>
          {localVideoTrack ? (
            <AgoraVideoPlayer
              style={users.length < 1 ? {height: "71vh", width: "60vw"} : users.length === 1 ? {height: "64vh", width: "45vw"} : {}}
              videoTrack={localVideoTrack}
            />
          ) : null}
            <p>You</p>
        </div>
      
      {users.length > 0 &&
        users.map((user) => {
          if (user.videoTrack) {
            return (
              
                <div key={user.uid} className="videoplayer-video" style={users.length === 1 ? {height: "65vh", width: "45vw"} : {}}>
                  <AgoraVideoPlayer
                    videoTrack={user.videoTrack}
                    style={users.length === 1 ? {height: "64vh", width: "45vw"} : {}}
                  />
                  <p>{participants[user.uid]}</p>
                </div>
              
            );
          } else return null;
        })}
    
    </div>
  );
}
