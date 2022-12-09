import Message from "../components/Message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { toast } from "react-toastify";
import { async } from "@firebase/util";
import {
  arrayUnion,
  disableNetwork,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
  onSnapshot
} from "firebase/firestore";

export default function Details() {
  const router = useRouter();
  const routeData = router.query;
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  //create a Message
  const submitMessage = async () => {
    if (!auth.currentUser) return router.push("/auth/login");
    //check if field is empty
    if (!message) {
      toast.error("Dont Leave Field Empty", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    }

    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        userName: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });

    setMessage("");
  };


  //Get all commments associated with the post. getDoc for no live updates, onSnapshot for all commments and live updates 
  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);
    const unsubscribe = onSnapshot(docRef, (snapshot)=>{
      setAllMessages(snapshot.data().comments);
    })
    return unsubscribe
  };

  useEffect(() => {
    if (!router.isReady) return;
    getComments();
  }, [router.isReady]);
  return (
    <div>
      <Message {...routeData}></Message>
      <div className="my-4">
        <div className="flex">
          <input
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            type="text"
            value={message}
            placeholder="Send a message"
            className="bg-gray-800 text-white w-full p-2 "
          ></input>
          <button
            className="py-2 px-4 bg-cyan-500 text-white text-sm"
            onClick={submitMessage}
          >
            Submit
          </button>
        </div>
        <div>
          <h2 className="py-2 ">Comments</h2>
          {allMessages?.map((message) => (
            <div className=" border-2 p-4 my-2" key={message.time}>
              <div className=" flex p-2">
                <img
                  className="w-10 rounded-full curser-pointer"
                  src={message.avatar}
                  alt=""
                ></img>
                <h2 className="p-2">{message.userName}</h2>
              </div>
              <h2 className="items-center p-4">{message.message}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
