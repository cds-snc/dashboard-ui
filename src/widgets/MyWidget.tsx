
import React from "react";
import { Socket } from "phoenix";
import {useChannel} from "../hooks/useChannel";


export const MyWidget = ({socket, feed} : {socket:Socket, feed:string}) => {
  const payload = useChannel(socket, feed);
  console.log(payload);

  return (
    <div>
      <p>{payload.data}</p>
    </div>
  );
}