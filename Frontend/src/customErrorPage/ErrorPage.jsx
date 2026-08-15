  import React from 'react'
  import { Link } from 'react-router'
  import { Home } from 'lucide-react'
  import './ErrorPage.css'

  const ErrorPage = () => {
    return (
      <main className='error-page'>
        <div className='error-card'>
          <span className='error-badge'>404 Not Found</span>

          <h1>404</h1>
          <p>Oops! The page you are looking for does not exist or has been moved.</p>

          <Link to='/' className='home-btn'>
            <Home size={18} />
            <span>Home</span>
          </Link>
        </div>
      </main>
    )
  }

  export default ErrorPage