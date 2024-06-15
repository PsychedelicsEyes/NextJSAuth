'use client';
import React, { useState, useEffect } from 'react';
import { ThemeToggle } from './themeToggle';

const Navbar = () => {
  return (
    <nav className="fixed top-0 p-4 z-50 w-full flex justify-end">
      <ThemeToggle />
    </nav>
  );
};

export default Navbar;
