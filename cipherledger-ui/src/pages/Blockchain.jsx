import {useEffect,useState} from "react";

import axiosClient from "../api/axiosClient";


function Blockchain(){


    const [blocks,setBlocks] =
        useState([]);



    useEffect(()=>{


        axiosClient
            .get("/blockchain")
            .then(

                res=>setBlocks(res.data)

            );


    },[]);




    return(

        <div>

            <h1>
                Blockchain
            </h1>


            {
                blocks.map(

                    (block,index)=>(

                        <div key={index}>


                            <h3>
                                Block {index}
                            </h3>


                            <p>
                                Hash : {block.hash}
                            </p>


                            <p>
                                Previous : {block.previousHash}
                            </p>


                        </div>

                    )

                )

            }


        </div>

    )

}


export default Blockchain;