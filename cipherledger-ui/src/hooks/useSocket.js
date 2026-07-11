import {useEffect} from "react";

import SockJS from "sockjs-client";

import {Client} from "@stomp/stompjs";



export default function useSocket(callback){



  useEffect(()=>{


    const client =
        new Client({

          webSocketFactory:
              ()=> new SockJS(
                  "http://localhost:8080/ws"
              ),


          onConnect:()=>{


            client.subscribe(

                "/topic/blocks",

                (message)=>{


                  callback(
                      JSON.parse(message.body)
                  );


                }

            );


          }


        });


    client.activate();



    return ()=>client.deactivate();



  },[]);


}