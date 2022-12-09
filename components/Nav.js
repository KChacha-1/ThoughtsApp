import Link from "next/link";
//Anytime User related stuff is needed , import these 2
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Nav() {
  const [user, loading] = useAuthState(auth);

  return (
    <nav className="flex justify-between items-center pt-4 ">
      <Link href="/">
        <button className="text-lg font-medium px-2 rounded bg-white-200">Te</button>
      </Link>

      {!user && (
        <ul>
          <Link href={"/auth/login"}>
            <p className="py-2 px-4 text-sm bg-cyan-500 text-white rounded-lg">
              Join Now{" "}
            </p>
          </Link>
        </ul>
      )}

      { user && (
          <div className="flex items-center gap-6">
              <Link href="/post">
              <button className="py-2 px-4 text-sm bg-cyan-500 text-white rounded-mg">Post</button>
              </Link>
              <Link href="/dashboard">
                  <img className="w-12 rounded-full curser-pointer" src={user.photoURL}/>
              </Link>
              
          </div>
      )
      }
      
    </nav>
  );
}
