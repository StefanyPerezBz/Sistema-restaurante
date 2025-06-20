
import {  Navbar } from "flowbite-react";
import { useEffect, useState } from 'react';
import { Link, useLocation, } from 'react-router-dom';




function ChefFoodNavBar() {

  const location = useLocation();
  const [tab, setTab] = useState('');
  const [addFoodPopup, setAddFoodPopup] = useState(false);
  const [itemSuccessfullyAdded, setItemSuccessfullyAdded] = useState(false);
 
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);


  return (
    <div className="justify-between flex">
      
      <div >
        <Navbar fluid rounded>

          <Navbar.Collapse>
            <Link to='/chef/foodMenu?tab=allFood'>
              <Navbar.Link active={tab === 'allFood'}>All </Navbar.Link>
            </Link>
            <Link to='/chef/foodMenu?tab=mainDish'>
              <Navbar.Link active={tab === 'mainDish'} > Main Dish </Navbar.Link>
            </Link>
            <Link to='/chef/foodMenu?tab=desert'>
              <Navbar.Link active={tab === 'desert'} >Desert </Navbar.Link>
            </Link>
          </Navbar.Collapse>
        </Navbar>
      </div>
      
    </div>
  );
}
export default ChefFoodNavBar;
