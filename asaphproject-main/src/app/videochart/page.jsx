"use client"
import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import "./videochart.css";

const SOCKET_SERVER_URL = 'http://192.168.159.251:8200'; 
export default function VideoChart() {
  const [me, setMe] = useState('');
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState('');
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState('');

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const socket = useRef();

  useEffect(() => {
    // Safe to use browser APIs here
    console.log(typeof navigator !== 'undefined');
    socket.current = io(SOCKET_SERVER_URL);

    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      }).catch((err) => {
        alert('Could not access camera/microphone: ' + err.message);
      });
    } else {
      alert('Media devices are not available. Please use a supported browser and ensure you are running this on the client side.');
    }

    socket.current.on('me', (id) => {
      setMe(id);
    });

    socket.current.on('callUser', (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });

    socket.current.on('callEnded', () => {
      handleLeaveCall();
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const callUser = (id) => {
    const peer = new window.RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
      ],
    });
    connectionRef.current = peer;

    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        // You can send ICE candidates here if you want to support trickle ICE
      }
    };

    peer.ontrack = (event) => {
      if (userVideo.current) {
        userVideo.current.srcObject = event.streams[0];
      }
    };

    peer.createOffer().then((offer) => {
      peer.setLocalDescription(offer);
      socket.current.emit('callUser', {
        userToCall: id,
        signalData: offer,
        from: me,
        name,
      });
    });

    socket.current.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.setRemoteDescription(new RTCSessionDescription(signal));
    });
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new window.RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
      ],
    });
    connectionRef.current = peer;

    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        // You can send ICE candidates here if you want to support trickle ICE
      }
    };

    peer.ontrack = (event) => {
      if (userVideo.current) {
        userVideo.current.srcObject = event.streams[0];
      }
    };

    peer.setRemoteDescription(new RTCSessionDescription(callerSignal)).then(() => {
      peer.createAnswer().then((answer) => {
        peer.setLocalDescription(answer);
        socket.current.emit('answerCall', { signal: answer, to: caller });
      });
    });
  };

  const handleLeaveCall = () => {
    setCallEnded(true);
    setCallAccepted(false);
    setReceivingCall(false);
    if (connectionRef.current) {
      connectionRef.current.close();
    }
    if (userVideo.current) {
      userVideo.current.srcObject = null;
    }
    socket.current.emit('callEnded');
  };

  return (
    <div className="container">
      <h2 className="heading">Video Chart (WebRTC Demo)</h2>
      <div className="videos">
        <div className="videoCard">
          <h3 className="videoTitle">Your Video</h3>
          <video playsInline muted ref={myVideo} autoPlay className="video" />
        </div>
        <div className="videoCard">
          <h3 className="videoTitle">Remote Video</h3>
          <video playsInline ref={userVideo} autoPlay className="video" />
        </div>
      </div>
      <div className="controls">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="ID to call"
          value={idToCall}
          onChange={(e) => setIdToCall(e.target.value)}
          className="input"
        />
        <button
          onClick={() => callUser(idToCall)}
          disabled={callAccepted}
          className="button"
        >
          Call
        </button>
        {callAccepted && !callEnded && (
          <button
            onClick={handleLeaveCall}
            className="button endButton"
          >
            End Call
          </button>
        )}
      </div>
      <div className="infoCard">
        <p className="infoLabel">
          Your ID: <span className="infoValue">{me}</span>
        </p>
        {receivingCall && !callAccepted && (
          <div style={{ marginTop: '1rem' }}>
            <p className="callerText">{name || 'Someone'} is calling you...</p>
            <button
              onClick={answerCall}
              className="button answerButton"
            >
              Answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

console.log(typeof navigator !== 'undefined');
console.log(navigator.mediaDevices);
console.log(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
