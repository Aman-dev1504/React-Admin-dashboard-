import React from 'react'
import Cards from './HomeComponent/Cards'
import Announcement from './HomeComponent/Announcment'
import Notification from './HomeComponent/Notification'
import { Divider } from '@mui/material'
import './Home.css'
const Home = () => {
  return (
    <div>
     <Cards/>
      <Divider style={{marginTop:"20px"}}/>
     <div className='card-wrap'>
      <Announcement/>
      <Notification/>
     </div>
     <Divider/> 
    </div>
  )
}

export default Home
