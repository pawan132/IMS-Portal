import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../shared/Footer';
import Navbar2 from '../shared/Navbar2';
import PageTop from '../common/PageTop';

const OpenLayout = () => {
    return (
        <>
            <Navbar2 />
            <Outlet />
            <Footer />
            <PageTop />
        </>
    )
}

export default OpenLayout