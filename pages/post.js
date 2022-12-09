import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { async } from "@firebase/util";

export default function post() {
  const [post, setPost] = useState({ description: "" }); //spread object out for future refrence
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const routeData = route.query;
  console.log(route);
  //submit post
  const submitPost = async (e) => {
    e.preventDefault();
    //checks if user can submit a post
    if (!post.description) {
      //check for submiting empty post
      toast.error("Description Empty", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
      return;
    }
    if (post.description.length > 300) {
      //check and modal for to many charcters
      toast.error("Description too long!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
      return;
    }
    if (post?.hasOwnProperty("id")) {
      //for updating / editing posts
      const docRef = doc(db, "posts", post.id); // Refrence the doc in database with id
      const updatedPost = { ...post, timestamp: serverTimestamp() }; // const to update a timestamp within the post. Updated posts will appear first after edit
      await updateDoc(docRef, updatedPost); // updatePost from firebase to pass the doc/post being refrenced. then setPost grabs the description from the text field
      return route.push("/");
    } else {
      const collectionRef = collection(db, "posts"); // creates new post
      await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        username: user.displayName,
      });
      setPost({ description: "" }); // grabs the text from textarea
      toast.success("Post Created!" , {position:"top-center", autoClose:1000} )
      return route.push("/");
    }
  };

  const checkUser = async () => {
    //check for auth users
    if (loading) return; //if user is auth,  will allow to see and use the posts page
    if (!user) route.push("/auth/login"); //pushes unauth user to login page to auth
    if (routeData.id) {
      //queries id for updating posts
      setPost({ description: routeData.description, id: routeData.id }); //grabs post description and id from the query
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);

  return (
    <div className="my-20 p-12 shadow-lg rounded=lg max-w-md mx-auto">
      <form onSubmit={submitPost}>
        <h1 className="text-2xl font-bold">
          {post.hasOwnProperty("id") ? "Edit your post" : "Make a post"}{" "}
        </h1>
        <div className="py-2">
          <h3 className="text-lg font-medium py-2">Description</h3>
          <textarea
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            className="bg-gray-300 h-48 w-full text-white rounded-lg p-2"
          ></textarea>
          <p
            className={
              'text-cyan-300 font-medium text-sm ${post.description.length > 300 ? "text-red-600 : ""}'
            }
          >
            {post.description.length}/300
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-cyan-600 text-white font-medium p-2 my-2 rounded-lg text-sm"
        >
          Post
        </button>
      </form>
    </div>
  );
}
