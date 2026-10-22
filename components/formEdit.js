'use client';

import { useFormStatus } from "react-dom";

export default function FormEdit(){
    const status = useFormStatus();

    if(status.pending){
      return <>
       <p>Updating Note...</p>
      </>
    }

    return(
        <>
        <button>Update Note</button>
        </>
    )
}