import React, { useContext} from 'react'
import { About, Contact, Experience, Feedbacks, Hero, Navbar, Tech, Works, StarsCanvas } from '../../components'
import { PreviewContext } from '../../context/PreviewContext'
import { useLocation } from 'react-router-dom';

export default function Preview({isExpanded, handleBackPreview}) {
  const location = useLocation();

  return (
    <div>
        <div className='relative z-0 bg-primary'>

        <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
          <Navbar isExpanded={isExpanded} handleBackPreview={handleBackPreview} />
          <Hero />
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
    </div>
  )
}
