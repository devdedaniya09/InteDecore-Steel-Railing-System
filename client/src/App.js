import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import HomePage from './components/HomePage';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import PublicProductList from './components/PublicProductList'; // Or adjust the path as needed


import ProtectedRoute from './components/ProtectedRoute'; // Protecting routes
import Navbar from './components/Navbar';
import Sidebar from './components/Admin/AdminSidebar';
import AdminLogin from './components/Admin/AdminLogin';
import AdminRegister from './components/Admin/AdminRegister';
import AdminDashboard from './components/Admin/AdminDashboard';
import AddProductPage from './components/Product/AddProductPage';
import ProductList from './components/Product/ProductList';
import ProductEditPage from "./components/Product/ProductEditPage";  // Import ProductEditPage
import AdminEmpManage from "./components/Admin/AdminEmpManage";
import AdminEmployeeDetails from "./components/Admin/AdminEmpDetail";
import AdminSalesChart from "./components/Admin/AdminSalesChart";
import AdminMarketing from "./components/Admin/AdminMarketing";


import UserLogin from './components/User/UserLogin';
import UserRegister from './components/User/UserRegister';
import UserDashboard from './components/User/UserDashboard'; // Import UserDashboard page
import UserSidebar from './components/User/UserSidebar';
import UserProductList from './components/User/ProductList';
import UserWishList from './components/User/UserWishlist';
import UserCart from './components/User/UserCart';
import UserCheckout from './components/User/Checkout';
import UserOders from './components/User/UserOrders';
import UserTrackOrder from './components/User/UserTrackOrder';
import UserUpdateProfile from './components/User/UserUpdateProfile';


import EmpLogin from './components/Employee/EmpLogin';
import EmpSignUp from './components/Employee/EmpSignUp';
import EmpDashboard from './components/Employee/EmpDashboard';
import EmpSidebar from './components/Employee/EmployeeSidebar';
import EmployeeOrderList from './components/Employee/EmployeeOrderList';
import EmployeeOrderDetails from './components/Employee/EmployeeOrderDetails';
import EmpProfileUpdate from './components/Employee/EmpProfileUpdate';


import AdminBasicOrderDetails from "./components/Admin/AdminBasicOrderDetails";
import AdminOrderDetails from "./components/Admin/AdminOrderDetails";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);  // Check if the user is logged in by token
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const SidebarLayout = () => (
    <div className="app-container d-flex">
      <Sidebar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <div className="main-content" style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );

  const UserSidebarLayout = () => (
    <div className="app-container d-flex">
      <UserSidebar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <div className="main-content" style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
  const EmpSidebarLayout = () => (
    <div className="app-container d-flex mt-5">
      <EmpSidebar isLoggedIn={isLoggedIn} onLogout={handleLogout} /> {/* Use EmpSidebar */}
      <div className="main-content" style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/PublicProductList" element={<PublicProductList />} />
        
        
        <Route path="/Adminlogin" element={<AdminLogin />} />
        <Route path="/Adminregister" element={<AdminRegister />} />
        <Route path="/Userlogin" element={<UserLogin />} />
        <Route path="/Userregister" element={<UserRegister />} />

        <Route path="/Emplogin" element={<EmpLogin />} />
        <Route path="/Empsignup" element={<EmpSignUp />} />

        {/* Protected Routes */}
        <Route element={<SidebarLayout />}>
          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}/>
          <Route path="/admin/products" element={<ProtectedRoute role="admin"><AddProductPage /></ProtectedRoute>} />
          <Route path="/admin/productlist" element={<ProtectedRoute role="admin"><ProductList /></ProtectedRoute>} />
          <Route path="/admin/editproduct/:productId" element={<ProtectedRoute role="admin"><ProductEditPage /></ProtectedRoute>} />
          <Route path="/admin/AdminEmpManage" element={<ProtectedRoute role="admin"><AdminEmpManage /></ProtectedRoute>} />
          <Route path="/admin/AdminBasicOrderDetails" element={<ProtectedRoute role="admin"><AdminBasicOrderDetails /></ProtectedRoute>} />
          <Route path="/admin/AdminOrderDetails/:orderId" element={<ProtectedRoute role="admin"><AdminOrderDetails /></ProtectedRoute>} />
          <Route path="/admin/employees/:employeeId" element={<ProtectedRoute role="admin"><AdminEmployeeDetails /></ProtectedRoute>} />
          <Route path="/admin/AdminSalesChart" element={<ProtectedRoute role="admin"><AdminSalesChart /></ProtectedRoute>} />
          <Route path="/admin/AdminMarketing" element={<ProtectedRoute role="admin"><AdminMarketing /></ProtectedRoute>} />

         
        </Route>
        <Route element={<UserSidebarLayout />}>
          <Route path="/user/dashboard" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
          <Route path="/user/productlist" element={<ProtectedRoute role="user"><UserProductList /></ProtectedRoute>} />
          <Route path="/user/UserWishList" element={<ProtectedRoute role="user"><UserWishList /></ProtectedRoute>} />
          <Route path="/user/UserCart" element={<ProtectedRoute role="user"><UserCart /></ProtectedRoute>} />
          <Route path="/user/UserCheckout" element={<ProtectedRoute role="user"><UserCheckout /></ProtectedRoute>} />
          <Route path="/user/UserOders" element={<ProtectedRoute role="user"><UserOders /></ProtectedRoute>} />
          <Route path="/user/UserUpdateProfile" element={<ProtectedRoute role="user"><UserUpdateProfile /></ProtectedRoute>} />
          <Route path="/user/UserTrackOrder/:orderId" element={<ProtectedRoute role="user"><UserTrackOrder /></ProtectedRoute>} />
        </Route>

        <Route element={<EmpSidebarLayout />}> {/* Use EmpSidebarLayout for Employee routes */}
          <Route path="/employee/dashboard" element={<ProtectedRoute role="employee"><EmpDashboard /></ProtectedRoute>} />
          <Route path="/employee/orders" element={<ProtectedRoute role="employee"><EmployeeOrderList /></ProtectedRoute>} />
          <Route path="/employee/orders/:orderId" element={<ProtectedRoute role="employee"><EmployeeOrderDetails /></ProtectedRoute>} />
          <Route path="/employee/EmpProfileUpdate" element={<ProtectedRoute role="employee"><EmpProfileUpdate /></ProtectedRoute>} />

        </Route>
        
      </Routes>

    </Router>
  );
}

export default App;


