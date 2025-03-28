import { useState } from "react"; 

const Error = ({children}) => { 
    return (
        <div className="bg-red-600 text-white p-4 text-lg font-bold text-center uppercase rounded-md">
            {children}

        </div>

    );
    
} 

export default Error