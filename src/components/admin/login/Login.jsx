import React, { useState } from "react";
// import React from 'react';
import { CONFIGS } from "../../../../config";

import { Link } from "react-router-dom";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../../../store/Auth";
function Login() {

  const { userAuthentication, storeTokenInLS } = useAuth();

  const URL = `${CONFIGS.API_BASE_URL}/login`;
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setUser({
      ...user,
      [name]: value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user);

    try {
      const response = await fetch(URL, {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const res_data = await response.json();
      console.log("res from sever", res_data);

      // console.log(res_data);
      if (response.ok) {
        storeTokenInLS(res_data.token);
        setUser({
          email: "",
          password: "",
        });
        // await userAuthentication();
        navigate('/admin');
        

        // Show success toast
        toast.success('Login successful!', {
          position: 'top-center',
          autoClose: 7000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });



      }

      else {

        toast.error(res_data.extraDetails || res_data.message, {
          position: 'top-center',
          autoClose: 7000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.log('Login failed');
      }

    }
    catch (error) {
      console.log("Error from catch", error);
    }

  }
  return (
    <>
      <div className="inquiry_contaciner">
        
        <div className="right_container">
          <h1 className="text-center left_h1">Login</h1>


          <div data-aos="zoom-in" className="right_form">
            <form onSubmit={handleSubmit}>



              <div className="form_div">
                <label htmlFor="email">
                  email:
                </label>

                <input type="email" name="email" id="email" placeholder="Enter Your email" onChange={handleInput} value={user.email} autoComplete="true" required />
              </div>




              <div className="form_div">
                <label htmlFor="password">
                  password:
                </label>

                <input type="password" name="password" id="password" placeholder="Enter Your password" onChange={handleInput} value={user.password} autoComplete="true" required />
              </div>

              <div className="form_div text-center">
                <button type="submit">Login</button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </>
  )
}

export default Login