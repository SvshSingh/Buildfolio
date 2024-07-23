import React, { createContext, useEffect, useState } from "react";
import {
    mobile,
    backend,
    creator,
    web,
  } from "../assets";
  import { getFirestore, collection, doc, getDocs } from "firebase/firestore"; // Import Firestore functions
  import { useAuthState } from 'react-firebase-hooks/auth';
  import {auth, db} from '../firebase/config';
  import {
    // mobile,
    // backend,
    // creator,
    // web,
    javascript,
    typescript,
    html,
    css,
    reactjs,
    redux,
    tailwind,
    nodejs,
    mongodb,
    git,
    figma,
    docker,
    meta,
    starbucks,
    tesla,
    shopify,
    carrent,
    jobit,
    tripguide,
    threejs,
  } from "../assets";


export const  PreviewContext = createContext();

export const PreviewProvider = ( props ) =>  {
    const [user, loading, error] = useAuthState(auth);
    const [ previewData, setPreviewData ] = useState({
        displayName: "",
        tagline: "",
        overview: "",
        services: [ ],
        experiences: [ ]
    });

    async function handleUserData() {
        try {
          const firestore = getFirestore();
          const userCollection = collection(firestore, "users");
      
          const snapshot = await getDocs(userCollection);
          const userDoc = snapshot.docs.find((doc) => doc.data().uid === user.uid);
          if (userDoc) {
              if(userDoc.data().previewData){
                setPreviewData(userDoc.data().previewData); // Update state with Firestore data
              }
          } else {
              console.error("Document with the given UID not found.");
              // Handle the case where the document is not found
          }
        } catch (error) {
              console.error("Error adding preview data:", error);
              // Handle errors appropriately
        }
      }

    useEffect(() => {
        if(!loading || user){
            handleUserData();
        }
      }, [user]);

    return (
        <PreviewContext.Provider value={[previewData, setPreviewData ]} >
            { props.children }
        </PreviewContext.Provider>
    )
}