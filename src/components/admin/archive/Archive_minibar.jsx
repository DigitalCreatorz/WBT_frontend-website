import React from 'react'
// import { NavLink } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import'./archive_minibar.css'

function Archive_minibar() {
  return (
    <>
     <div className="status col-md-6 ">
          
          {/* <Link to={`/admin/archive`} ><p className='status_info'>Orders</p></Link> */}
          <Link to={`/admin/archivetesti`}><p className='status_info'>Testimonials</p></Link>
        
      
      </div>
    </>
  )
}

export default Archive_minibar