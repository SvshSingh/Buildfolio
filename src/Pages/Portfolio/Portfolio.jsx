import React, { useEffect, useState,useContext } from 'react'
import { About, Contact, Experience, Feedbacks, Hero, Navbar, Tech, Works, StarsCanvas } from '../../components'
import { logout, auth, db } from '../../firebase/config'

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import ReactLoading from 'react-loading';
import { PreviewContext } from '../../context/PreviewContext';
import { getFirestore, collection, getDocs } from "firebase/firestore";


export default function Portfolio() {

  const [ previewData, setPreviewData ] = useContext(PreviewContext);
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();
    const { userId } = useParams(); 

    async function getUserDetails() {
      try {
        const firestore = getFirestore();
        const userCollection = collection(firestore, "users");
    
        const snapshot = await getDocs(userCollection);
        const userDoc = snapshot.docs.find((doc) => doc.data().userName === userId);
        if (userDoc) {
            const doc = userDoc.data();
            setPreviewData(doc.previewData);
            setLoading(false);
        } else {
            console.error("No user found");
            // Handle the case where the document is not found
        }
      } catch (error) {
            console.error("Error finding user", error);
            // Handle errors appropriately
      }
    }

    useEffect(() => {
      getUserDetails();
    }, [userId]);


  return (
    <div>
      {loading ? <>
        <div className="login">
          <ReactLoading type="bubbles" height={'80px'} width={'80px'} /> 
        </div>
      </> : <>
      <div style={{zoom:"80%"}} className='relative z-0 bg-primary'>
        <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
          <Navbar />
          <Hero/>
        </div>
        <About />
        <Experience />
        <Tech />
        <Works />
        <Feedbacks />
        <div className='relative z-0'>
          <Contact />
          <StarsCanvas />
        </div>
      </div>
        </>
      }
    </div>
  )
}
