import React from 'react'
import {  FaGithubSquare, FaHammer, FaTwitterSquare } from 'react-icons/fa';

const Footer = () => {
 
  return (
    <div className= 'footermove' >
       <h2 > 
       <FaHammer />&nbsp;  by &nbsp;
          <a href="https://twitter.com/nuthan_2x" target="_blank" rel="noopener noreferrer"className='footermoveh2'>nuthan_2x  </a> 
          <a href="https://twitter.com/nuthan_2x" className='icon' target="_blank" rel="noopener noreferrer"><FaTwitterSquare /> </a>
          <a href="https://github.com/nuthan2x/BinaryOptions-DAPP" className='icon' target="_blank" rel="noopener noreferrer"><FaGithubSquare /></a>
          
       </h2>
    </div>
  )
}

export default Footer   