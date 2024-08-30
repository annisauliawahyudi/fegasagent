import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <div>
        <Sidebar />
        <div className='ml-16 md:ml-56'>
          <Outlet /> {/* Correctly imported Outlet component */}
        </div>
      </div>
    </div>
  );
}

export default Layout;
