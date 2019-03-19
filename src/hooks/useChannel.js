import React, { useState, useEffect } from 'react';

function useChannel(channel) {
  const [getPayload, setPayload] = useState(null);

  useEffect(() => {
    function handleStatusChange(payload) {
      setPayload(payload);
    }

    
  let channel = props.socket.channel(`data_source:${channel}`, {});
  channel.join().receive("error", (resp) => {
    console.log("Unable to join: ", resp);
  });
  channel.on("data", (payload) => {
    console.log(payload)
    handleStatusChange(payload);
  });
  
    return () => {
      {}
    };
  });

  return isOnline;
}