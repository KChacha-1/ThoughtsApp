import { getDisplayName } from "next/dist/shared/lib/utils";
import { useAuthState } from "react-firebase-hooks/auth";


export default function Message({children,avatar,username, description}) {

    return ( 
        <div className=" p-8">
            <div className="flex items-center gap-2">
                <img src={avatar}/>
                <h2>{username}</h2>
            </div>
            <div className="py-4">
                <p>{description}</p>
            </div>
            {children}
        </div>
    
    );
}

