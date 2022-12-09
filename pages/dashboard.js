import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useState } from "react";
import Message from "../components/Message";
import {BsTrash2Fill} from 'react-icons/bs';
import {AiFillEdit} from 'react-icons/ai';
import { async } from "@firebase/util";
import Link from "next/link";

export default function dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  //logic for  User Data
  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  //delete post 
  const deletePost = async (id) => {
    const docRef=doc(db, "posts" , id); // more added here depending on database structure
    await deleteDoc(docRef);
  };
  //   gets user data
  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div>
      <h1>Your Posts</h1>
      <div>
        {posts.map((post) => {
          return(<Message {...post} key={post.id}>
           <div className="flex gap-4"> 
             <button onClick={()=>deletePost(post.id)} className="text-pink-600 flex items-center justify-center gap-2 py-2 text-sm">
               <BsTrash2Fill className="text-2xl" />Delete</button>
               <Link href={{pathname:"/post" , query:post}}>
             <button className="text-white-600 flex items-center justify-center gap-2 py-2 text-sm">
               <AiFillEdit className="text-3xl"/>Edit</button>
               </Link>
           </div>
          </Message>)
        })}
      </div>
      <button className="font-medium text-white bg-gray-600 py-2 px-4" onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  );
}
