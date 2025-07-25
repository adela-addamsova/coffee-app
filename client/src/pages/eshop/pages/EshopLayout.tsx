import React, { JSX } from "react";
import Header from "@components/Header";
import Footer from "@components/Footer";
import { Outlet } from "react-router-dom";

/**
 * EshopLayout component
 *
 * Provides the common layout structure for the e-shop section of the site.
 * It includes the site Header and Footer components and renders the current
 * child route content via React Router's <Outlet>
 *
 * Ensures consistent navigation and footer across all e-shop pages
 *
 * @returns {JSX.Element} The layout structure for e-shop pages
 */

export default function EshopLayout(): JSX.Element {
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
