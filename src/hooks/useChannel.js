
import { useState, useEffect } from 'react';

export function useChannel(socket, feed) {
  const [payload, setPayload] = useState({data:[], timestamp: ""});

  useEffect(() => {
    function handlePayloadChange(payload) {
      setPayload(payload);
    }

    let channel = socket.channel(`data_source:${feed}`, {});
    channel.join().receive("error", (resp) => {
      console.log("Unable to join: ", resp);
    });
    
    channel.on("data", (payload) => {
      handlePayloadChange(payload);
    });
  
    return () =>{
      return channel;
    }
  },[payload.timestamp]);

  return payload;
}