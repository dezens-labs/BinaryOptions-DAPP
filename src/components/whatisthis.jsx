import React from 'react'


const About = () => {
  return (
    <div className="aboutsection" id={'whatisthis'}>
       <h5>About</h5>
       <p>Binary options are derivatives with result either in loss or win , if user wins gets the rewards as 80%, 95% of stakes based on the volatility and option expiration.Rewards can never go above 100%, so to even breakeven should have win rate above 55% .</p>
       <div className='warnings'>
        <p>📍 Rewards drop 1% per hour of current reward multiplier.</p>
        <p className='rewardwarn'>📍 If price moves less than 1% within your expiration reward stay at 100%, if volatile is above 1% and  below 4% reward drops to 90%, and above 4% volatility reards plunges to 80% .</p> 
        <p>📍 Option doesnt close itself like no expiration is set, so close when you can reap max rewards in.</p>
       </div>
    </div>
  )
}

export default About 