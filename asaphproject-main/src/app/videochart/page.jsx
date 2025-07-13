"use client";
import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import "./videochart.css";

const SOCKET_SERVER_URL = 'http://localhost:8200'; 

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

  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const connectionRef = useRef();
  const socket = useRef();

  useEffect(() => {
    // Initialize socket connection
    socket.current = io(SOCKET_SERVER_URL);

    // Get user media
    const getMedia = async () => {
      try {
        const currentStream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      } catch (err) {
        console.error('Failed to get media devices', err);
        alert('Could not access camera/microphone: ' + (err && err.message ? err.message : err.toString()));
      }
    };

    if (typeof window !== 'undefined' && navigator.mediaDevices) {
      getMedia();
    }

    // Socket event handlers
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
      if (socket.current) {
        socket.current.disconnect();
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const callUser = (id) => {
    if (!stream) return;

    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
      ]
    });
    connectionRef.current = peer;

    // Add local stream tracks
    stream.getTracks().forEach(track => {
      peer.addTrack(track, stream);
    });

    // ICE candidate handler
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current?.emit('iceCandidate', {
          candidate: event.candidate,
          to: id
        });
      }
    };

    // Remote stream handler
    peer.ontrack = (event) => {
      if (userVideo.current) {
        userVideo.current.srcObject = event.streams[0];
      }
    };

    // Create offer
    peer.createOffer()
      .then(offer => {
        return peer.setLocalDescription(offer);
      })
      .then(() => {
        socket.current.emit('callUser', {
          userToCall: id,
          signalData: peer.localDescription,
          from: me,
          name,
        });
      })
      .catch(err => console.error('Call error:', err));

    // Handle call acceptance
    socket.current.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.setRemoteDescription(new RTCSessionDescription(signal))
        .catch(err => console.error('Set remote description error:', err));
    });

    // Handle ICE candidates from remote
    socket.current.on('iceCandidate', (data) => {
      if (peer.remoteDescription) {
        peer.addIceCandidate(new RTCIceCandidate(data.candidate))
          .catch(err => console.error('Add ICE candidate error:', err));
      }
    });
  };

  const answerCall = () => {
    if (!stream) return;

    setCallAccepted(true);
    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
      ]
    });
    connectionRef.current = peer;

    // Add local stream tracks
    stream.getTracks().forEach(track => {
      peer.addTrack(track, stream);
    });

    // ICE candidate handler
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current?.emit('iceCandidate', {
          candidate: event.candidate,
          to: caller
        });
      }
    };

    // Remote stream handler
    peer.ontrack = (event) => {
      if (userVideo.current) {
        userVideo.current.srcObject = event.streams[0];
      }
    };

    // Set remote description and create answer
    peer.setRemoteDescription(new RTCSessionDescription(callerSignal))
      .then(() => peer.createAnswer())
      .then(answer => peer.setLocalDescription(answer))
      .then(() => {
        socket.current.emit('answerCall', { 
          signal: peer.localDescription, 
          to: caller 
        });
      })
      .catch(err => console.error('Answer call error:', err));

    // Handle ICE candidates from remote
    socket.current.on('iceCandidate', (data) => {
      if (peer.remoteDescription) {
        peer.addIceCandidate(new RTCIceCandidate(data.candidate))
          .catch(err => console.error('Add ICE candidate error:', err));
      }
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
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f8f9fa' }}>
      <h2 className="heading">Video Chart (WebRTC Demo)</h2>
      <div className="videos" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', gap: '2rem', flex: 1 }}>
        <div className="videoCard" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '48vw' }}>
          <h3 className="videoTitle">Your Video</h3>
          <video playsInline muted ref={myVideo} autoPlay className="video" style={{ width: '100%', height: '60vh', background: '#000', borderRadius: '1rem', objectFit: 'cover' }} />
        </div>
        <div className="videoCard" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '48vw' }}>
          <h3 className="videoTitle">Remote Video</h3>
          <video playsInline ref={userVideo} autoPlay className="video" style={{ width: '100%', height: '60vh', background: '#000', borderRadius: '1rem', objectFit: 'cover' }} />
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