import { Navbar } from "flowbite-react";
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UnauthorizedCashier from "./UnauthorizedChef";
import UnauthorizedChef from "./UnauthorizedChef";

function ChefFoodNavBar() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  // Verificación de rol al montar el componente
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'chef') {
      navigate('/unauthorized-chef');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  // No renderizar nada si no es chef
  if (!currentUser || currentUser.role !== 'chef') {
    return <UnauthorizedChef />;
  }

  return (
    <div className="justify-between flex">
      <div>
        <Navbar fluid rounded>
          <Navbar.Collapse>
            <Link to='/chef/foodMenu?tab=allFood'>
              <Navbar.Link active={tab === 'allFood'}>Todo</Navbar.Link>
            </Link>
            <Link to='/chef/foodMenu?tab=mainDish'>
              <Navbar.Link active={tab === 'mainDish'}>Plato Principal</Navbar.Link>
            </Link>
            <Link to='/chef/foodMenu?tab=desert'>
              <Navbar.Link active={tab === 'desert'}>Postre</Navbar.Link>
            </Link>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </div>
  );
}

export default ChefFoodNavBar;