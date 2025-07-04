import React from 'react'
import ChefFoodNavBar from '../../../components/ChefFoodNavBar'
import ChefSideBar from '../../../components/ChefSideBar'
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AllFood from './AllFood';
import MainDish from './MainDish';

export default function FoodMenu() {
    const location = useLocation();
    const [tab, setTab] = useState('');
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);
  return (
    
    <div className='min-h-screen flex flex-col md:flex-row'>
            <div className='md:w-56'>
                {/* sidebar */}
                <ChefSideBar/>
            </div>
            <div className='flex-1 mt-4 ml-5'>
                <ChefFoodNavBar/>
                
                {/* main dish */}
                {tab === 'mainDish' && <MainDish/>}
                {/* desert */}
                {tab === 'desert' && <div>Postre</div>}

            </div>
                

        </div>
    
  )
}
