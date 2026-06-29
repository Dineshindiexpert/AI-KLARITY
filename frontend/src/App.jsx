import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { routes } from './routes/AppRoutes'; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppRoutes = () => {
  return  (
    <>
      <RouterProvider router={routes} />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        pauseOnHover={true}
      />
    </>
  );
};


export default AppRoutes;
