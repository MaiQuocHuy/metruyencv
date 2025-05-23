import React from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

export default async function LayoutNonDashboard({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
