import React, { useRef, useState } from "react";

import "./App.css";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
firebase.initializeApp({
  apiKey: "AIzaSyALnbTsZ6ezTJjyeGrXn1Xl1pPSh9qRt5g",
  authDomain: "chatty-chat-4b5b2.firebaseapp.com",
  projectId: "chatty-chat-4b5b2",
  storageBucket: "chatty-chat-4b5b2.appspot.com",
  messagingSenderId: "224083774826",
  appId: "1:224083774826:web:eb6844879b0350de31e913",
  measurementId: "G-SCPC9NP9XV",
});

const auth = firebase.auth();
const firestore = firebase.firestore();
// const analytics = firebase.analytics();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1> Chatty CHaT💬💬 </h1> <SignOut />
      </header>
      <section> {user ? <ChatRoom /> : <SignIn />} </section>{" "}
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        {" "}
        Sign in with Google{" "}
      </button>{" "}
    </>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        {" "}
        Sign Out{" "}
      </button>
    )
  );
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        {" "}
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}> </span>{" "}
      </main>{" "}
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
        />
        <button type="submit" disabled={!formValue}>
          {" "}
          Send🕊️{" "}
        </button>{" "}
      </form>{" "}
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img
          src={
            photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
          }
          alt={"Profile"}
        />{" "}
        <p> {text} </p>{" "}
      </div>{" "}
    </>
  );
}
export default App;
