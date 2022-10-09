import React from 'react'
import {  FaGithub, FaGithubSquare, FaHammer, FaTwitter, FaTwitterSquare } from 'react-icons/fa';

const Footer = () => {
 
  return (
    <div className= 'footermove' >
       <h2 > 
       <FaHammer className='hammer'/>&nbsp;  by &nbsp;
          <a href="https://twitter.com/nuthan_2x" target="_blank" rel="noopener noreferrer"className='footermoveh2'>nuthan_2x  </a> &nbsp;
          <a href="https://twitter.com/nuthan_2x" className='icon' target="_blank" rel="noopener noreferrer"><FaTwitter className='twitter'/> </a>&nbsp;
          <a href="https://github.com/nuthan2x/BinaryOptions-DAPP" className='icon' target="_blank" rel="noopener noreferrer"><FaGithub /></a>
          
       </h2>
    </div>
  )
}

export default Footer   