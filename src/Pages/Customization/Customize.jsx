import React, {useState, useEffect, useContext} from 'react'
import {auth, db} from '../../firebase/config';
import { logout } from '../../firebase/config';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useLocation  } from 'react-router-dom';

import {experiences} from '../../constants/index'
import { getFirestore, collection, getDocs, updateDoc  } from "firebase/firestore";
import ReactLoading from 'react-loading';
import {motion, useAnimation} from 'framer-motion'
import copy from 'copy-text-to-clipboard';

import './CustomizeStyle.css';

import { Preview } from '../index';
import Experience from './Experience Field/Experience';

import { PreviewContext } from '../../context/PreviewContext';

import {web} from '../../assets'


export default function Customize() {

    const [ previewData, setPreviewData ] = useContext(PreviewContext);

    const [isExpanded, setIsExpand] = useState(false);
    const [previewStyle, setPreviewStyle ] = useState({
        previewWidth: "60%",
        previewScale: "89%",
        previewPosition: "absolute"
    })

    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if(loading) return;
        if(!user) navigate("/");
    }, [loading, user]);



    const handlePreview = () => {
        setIsExpand(true);
        setPreviewStyle({
            previewWidth: "100%",
            previewScale: "100%",
            previewPosition: "absolute"
        })
    }

    const handleBackPreview = () => {
        setIsExpand(false)
        setPreviewStyle({
            previewWidth: "60%",
            previewScale: "89%",
            previewPosition: "absolute"
        })
    }

    const handleChange = (e) => {
        setPreviewData({...previewData, [e.target.name]: e.target.value});
    }

    const copyURL = () => {
        copy(previewData.publicURL);
        alert("Public url copied to clipboard");
    }

    const input = (label, Name, HelperText="") => {
        return (
            <div className="mb-4">
                <label htmlFor={Name} className="text-sm font-medium text-gray-200">{label}</label>
                <input
                    type="text" 
                    id={Name} 
                    name={Name}
                    className="mt-0.5 rounded-md shadow-sm pl-2 py-3 focus:outline-none hover:ring-1 hover:ring-purple-300  focus:ring-2 focus:ring-purple-400 focus:ring-opacity-1 text-gray-300 w-full" 
                    onChange = {handleChange}
                    value={previewData[Name]}
                />
                <p className='mt-1 text-xs text-gray-400'>{HelperText}</p>
            </div>
        )
    }

    const handleOverviewDelete = (title) => {
        setPreviewData((prevPreviewData) => ({
            ...prevPreviewData,
            services: prevPreviewData.services.filter(
              (service) => service.title !== title
            ),
          }));
    }

    const handleOverviewServiceAdd = (title) => {
        const newService = {
            title: title,
            icon: web,
          };
          
          setPreviewData((prevData) => ({
            ...prevData,
            services: [...prevData.services, newService],
          }));
    }

    

    async function handleSubmitButton() {
      try {
        const firestore = getFirestore();
        const userCollection = collection(firestore, "users");
    
        const snapshot = await getDocs(userCollection);
        const userDoc = snapshot.docs.find((doc) => doc.data().uid === user.uid);
        if (userDoc) {
            const userRef = userDoc.ref;
            await updateDoc(userRef, { previewData });
            console.log("Preview data added to the document!");
        } else {
            console.error("Document with the given UID not found.");
            // Handle the case where the document is not found
        }
      } catch (error) {
            console.error("Error adding preview data:", error);
            // Handle errors appropriately
      }
    }
    

    const list = (value, label) => {
        return(
            <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                <div className="flex items-center ps-3">
                    <input 
                        onChange={(e) => {
                            if(e.target.checked) handleOverviewServiceAdd(value)
                            else handleOverviewDelete(value)
                            }} 
                            id={label} type="checkbox" value={value} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" 
                            checked={previewData.services.some((service) => service.title === value)}/>
                    <label htmlFor={label} className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{label}</label>
                </div>
            </li>
        )
    }

  return (
    <>
    {loading || !user ? <div className='login'> <ReactLoading type="bubbles" height={'80px'} width={'80px'} /> </div>: 
    <div style={{width: "100%", height: "100vh", display: "flex"}}>
        <div className='w-full lg:w-2/5 scroll' style={{height: "100vh", overflowY: 'scroll'}}>
        {/* <div className='w-full lg:hidden scroll' style={{height: "100vh", overflowY: 'scroll'}}> */}

            <div style={{margin: "40px"}}>

                <div className='mb-6 flex w-full'>
                    <div>
                        <h1 className='text-2xl font-semibold'>Customize your <span className='text-violet-400'>portfoilio</span> in just few steps</h1>
                        <p className='text-base mt-2 text-gray-400'>Effortless elegance. Your skills, our canvas.</p>
                    </div>
                    {/* <button className='px-2 py-1 bg-slate-300 rounded-md ml-4'>LO</button> */}
                    <button onClick={copyURL} className='px-4 bg-purple-500 rounded-md ml-4'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    </button>
                </div>

                <h3 className='text-xl font-semibold mb-4'>Introduction</h3>


                {input("Display Name", "displayName", "Enter the name you want to display")}
                {input("Tag Line", "tagline", "Enter a catchy tag line")}
                
                <h3 className='text-xl font-semibold mt-6 mb-4'>Overview Section</h3>

                <div>
                    <label className='text-sm font-medium text-gray-200' htmlFor="about">About you</label>
                    <textarea 
                        id='about' 
                        className='mt-0.5 rounded-md shadow-sm pl-2 py-3 focus:outline-none hover:ring-1 hover:ring-purple-300  focus:ring-2 focus:ring-purple-400 focus:ring-opacity-1 text-gray-300 w-full' 
                        rows={5} 
                        type="text" 
                        placeholder='Write few lines about you'
                        value={previewData.overview}
                        onChange = {(e) => {setPreviewData({...previewData, overview: e.target.value})}}
                    />
                </div>


                
                <h3 className="mt-4 mb-0.5 text-sm font-medium text-gray-200">Select your forte</h3>

                <ul className="items-center w-full text-sm font-medium text-gray-90 p-1 border border-gray-200 rounded-lg sm:flex dark:border-gray-600">
                    {list("React Developer", "React")}
                    {list("Web Developer", "Web")}
                    {list("Mern Developer", "Mern")}
                    {list("Angular Developer", "Angular")}
                    {list("Larvel Developer", "Larvel")}
                </ul>
                
                <p className='mt-1 text-xs text-gray-400'>you can select maximum four of your forte</p>


                <Experience input={input} />

                

            <div className='mt-4'>
                <hr />
                <button 
                    onClick={handlePreview}
                    className='mt-6 px-4 py-2 mr-4'  
                    style={{ backgroundColor: "#915eff", borderRadius: "6px"}}
                >
                    preview
                </button>
                <button onClick={handleSubmitButton} className='hover:bg-slate-800 px-4 py-2 rounded-md'>Submit</button>
                <button onClick={logout} className='ml-4 py-2 px-4 rounded-md text-red-400 border border-red-400 hover:text-white hover:bg-red-500 transition-colors'>Logout</button>
            </div>

            </div>
        </div>


        {/* <div className='hidden lg:block scroll' style={{width: "60%", height: "100vh", overflowY: "scroll", scrollbarWidth: "none", scale: "89%", borderRadius: "13px"}}> */}
        <motion.div 
            className='hidden lg:block scroll' 
            style={{right: 0, position: previewStyle.previewPosition, width: previewStyle.previewWidth, height: "100vh", overflowY: "scroll", scrollbarWidth: "none", scale: previewStyle.previewScale, borderRadius: "13px", transition: "all 1s"}}>
            <div style={{zoom: "66%", scrollbarWidth: "none"}}>
                <Preview isExpanded={isExpanded} handleBackPreview={handleBackPreview}/>
            </div>
        </motion.div>


    </div>}
    </>
  )
}
