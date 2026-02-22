import { redirect } from 'next/navigation';
import React from 'react'

const HomePage = () => {
  return redirect('/home/discover');
}

export default HomePage;