import React from 'react'
import {  FaGithubSquare, FaTwitterSquare } from 'react-icons/fa';

const Footer = () => {
 
  return (
    <div className= 'footermove' >
       <h2> 
          made by &nbsp;
          <a href="https://twitter.com/nuthan_2x" target="_blank" rel="noopener noreferrer">nuthan_2x  </a> 
          <a href="https://twitter.com/nuthan_2x" className='icon' target="_blank" rel="noopener noreferrer"><FaTwitterSquare /> </a>
          <a href="https://github.com/nuthan2x/Binary-Options-dapp" className='icon' target="_blank" rel="noopener noreferrer"><FaGithubSquare /></a>
          
       </h2>
    </div>
  )
}

export default Footer   