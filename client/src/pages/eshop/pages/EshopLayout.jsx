import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { Outlet } from 'react-router-dom';

export default function EshopLayout() {
  return (
    <>
      <Header />
      <main className="eshop-main-wrapper">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
