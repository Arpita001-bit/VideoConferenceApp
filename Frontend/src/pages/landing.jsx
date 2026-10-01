import React from 'react'
import "../App.css"
import { Link } from 'react-router-dom';
export default function LandingPage() {
  return (
    <div className='landingPageContainer'>
      <nav>
        <div className='navHeader'>
          <h2>Convo</h2>

        </div>
        
        <div className='navlist'>
          <p>Join as Guest</p>

          <div role='button'>
            <p>Register</p></div>
          <div role='butoon'>
            <p>Login</p></div>

        </div>
      </nav>

      <div className='landingPageMainContainer'>
        <div>
          <h1>
           Effortless <span style={{color:"#FF9839"}}>Collaboration</span>  anywhere.
          </h1>
          <p>Cover the distance by Convo.</p>
           <div role='button'>
          <Link to={"/auth"}>Get Started</Link>
        </div>
        </div>
        
        <div><img src='mobile.png'></img></div>
       

        
      </div>
    </div>

  )
}

