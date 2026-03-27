import { createClient, createMicrophoneAndCameraTracks, createScreenVideoTrack } from "agora-rtc-react";

import AgoraRTM from 'agora-rtm-sdk';

const appId = "9018a94d10f34248aa03f0d14a011fb9";
const token = null;
export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

// Lazy create screen video track to avoid initialization errors
export const getScreenVideoTrack = () => {
  try {
    return createScreenVideoTrack();
  } catch (err) {
    console.error('Failed to initialize screen video track:', err);
    return null;
  }
};

let rtmClientInstance = null;
export const getRtmClient = () => {
  if (!rtmClientInstance) {
    try {
      rtmClientInstance = AgoraRTM.createInstance(appId);
    } catch (err) {
      console.error('Failed to create RTM client:', err);
    }
  }
  return rtmClientInstance;
};
