// import React, { useState } from "react";
// import { CONFIGS } from "../../../../config";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useAuth } from "../../../store/Auth";

// function Login() {
//   const { userAuthentication, storeTokenInLS } = useAuth(); // Make sure these are correctly provided from the context.
//   const URL = `${CONFIGS.API_BASE_URL}/login`;
//   const navigate = useNavigate();

//   const [user, setUser] = useState({
//     email: "",
//     password: "",
//   });

//   // Handle input change for form fields.
//   const handleInput = (e) => {
//     const { name, value } = e.target;
//     setUser((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   // Handle form submission for login.
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch(URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(user),
//       });

//       const res_data = await response.json();

//       if (response.ok) {
//         // Store token in local storage.
//         storeTokenInLS(res_data.token);

//         // Clear the form fields.
//         setUser({
//           email: "",
//           password: "",
//         });

//         // Show success toast.
//         toast.success("Login successful!", {
//           position: "top-center",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });

//         // Navigate to the admin home page.
//         navigate("/admin/home"); 
//       } else {
//         // Show error toast with the response message.
//         toast.error(res_data.extraDetails || res_data.message, {
//           position: "top-center",
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });
//         console.error("Login failed");
//       }
//     } catch (error) {
//       console.error("Error occurred during login:", error);
//       toast.error("An unexpected error occurred. Please try again later.", {
//         position: "top-center",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
//         <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>

//         <div className="right_form">
//           <form onSubmit={handleSubmit}>
//             {/* Email Input */}
//             <div className="mb-4">
//               <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
//                 Email:
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 id="email"
//                 placeholder="Enter Your email"
//                 onChange={handleInput}
//                 value={user.email}
//                 autoComplete="true"
//                 required
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               />
//             </div>

//             {/* Password Input */}
//             <div className="mb-4">
//               <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
//                 Password:
//               </label>
//               <input
//                 type="password"
//                 name="password"
//                 id="password"
//                 placeholder="Enter Your password"
//                 onChange={handleInput}
//                 value={user.password}
//                 autoComplete="true"
//                 required
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               />
//             </div>

//             {/* Submit Button */}
//             <div className="text-center mb-4">
//               <button
//                 type="submit"
//                 className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline w-full"
//               >
//                 Login
//               </button>
//             </div>

//             {/* Forgot Password Link */}
//             <div className="text-center">
//               <Link to="/forgot-password" className="text-blue-500 hover:text-blue-700 text-sm">
//                 Forgot Password?
//               </Link>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;

import React, { useState } from "react";
import { CONFIGS } from "../../../../config/index";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../../../store/Auth";

function Login() {
  const { user,fetchUserRole, userAuthentication, storeTokenInLS } = useAuth();
  const navigate = useNavigate();

  
  const URL = `${CONFIGS.API_BASE_URL}/login`;
  const [users, setUser] = useState({
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...users, [name]: value });
  };

  // Inside your Login component
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(users),
    });

    const res_data = await response.json();

    if (response.ok) {
      storeTokenInLS(res_data.token);
      await fetchUserRole(res_data.userId); 

      // Navigate based on the user's role
      if (user.role === 'admin') {
        navigate('/admin/home');
      } else {
        navigate('/');
      }

      // Reset user state and show success toast...
    } else {
      // Handle error response...
    }
  } catch (error) {
  console.log(error);
  
  }
};


  return (
    <div className="reg_container">
      <div className="right_container col-md-6">
        <h1 data-aos="fade-up" className="text-center left_h1">Login</h1>
        <div data-aos="zoom-in" className="right_form">
          <form onSubmit={handleSubmit}>
            <div className="form_div">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter Your email"
                onChange={handleInput}
                value={users.email}
                autoComplete="true"
                required
              />
            </div>
            <div className="form_div">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter Your password"
                onChange={handleInput}
                value={users.password}
                autoComplete="true"
                required
              />
            </div>
            <div className="form_div text-center">
              <button type="submit">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
