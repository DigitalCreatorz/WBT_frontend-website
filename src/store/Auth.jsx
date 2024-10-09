// import React, { createContext, useContext, useState, useEffect } from "react";
// import { CONFIGS } from "../../config";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [user, setUser] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [role, setRole] = useState('');

//   const AuthorizationToken = `Bearer ${token}`;

//   const storeTokenInLS = (serverToken) => {
//     setToken(serverToken);
//     return localStorage.setItem("token", serverToken);
//   };

//   let isLoggedIn = !!token;

//   const LogoutUser = () => {
//     setToken("");
//     setUser("");
//     setRole("");
//     return localStorage.removeItem("token");
//   }

//   const userAuthentication = async () => {
//     try {
//       setIsLoading(true);
//       const response = await fetch(`${CONFIGS.API_BASE_URL}/user`, {
//         method: "GET",
//         headers: {
//           Authorization: AuthorizationToken,
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setUser(data.userData);
//         await fetchUserRole(data.userData._id);
//         setIsLoading(false);
//       } else {
//         console.log('error fetching userdata')
//         setIsLoading(false);
//       }
//     } catch (error) {
//       console.error("Error Fetching user data", error)
//       setIsLoading(false);
//     }
//   }
  

//   const fetchUserRole = async (userId) => {
//     try {
//       const response = await fetch(`${CONFIGS.API_BASE_URL}/fetchrole`, {
//         method: "POST",
//         headers: {
//           'Content-Type': 'application/json',
//           // Authorization: AuthorizationToken,
//         },
//         body: JSON.stringify({ _id: userId }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('This------------',data);
//         setRole(data.role);
//       } else {
//         console.log('Error fetching role');
//       }
//     } catch (error) {
//       console.log('Error fetching role', error);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//         userAuthentication();
//     } else {
//       setIsLoading(false);
//     }
//   }, [token]);


//   return (
//     <AuthContext.Provider value={{ isLoggedIn, storeTokenInLS, LogoutUser, user, role, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => {
//   const AuthContextValue = useContext(AuthContext);
//   if (!AuthContextValue) {
//     throw new Error("useAuth used outside of the provider");
//   }
//   return AuthContextValue;
// }


import React, { createContext, useContext, useState, useEffect } from "react";
import { CONFIGS } from "../../config";

// Create an AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token")); // Store token in state
  const [user, setUser] = useState(''); // Store user data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [role, setRole] = useState(''); // Store user role

  // Authorization header
  const AuthorizationToken = `Bearer ${token}`;

  // Store the token in localStorage
  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    return localStorage.setItem("token", serverToken);
  };

  // Boolean value for login status
  let isLoggedIn = !!token;

  // Logout user and clear data
  const LogoutUser = () => {
    setToken("");
    setUser("");
    setRole("");
    return localStorage.removeItem("token");
  };

  const userAuthentication = async () => {
    try {
      setIsLoading(true); // Start loading
      const response = await fetch(`${CONFIGS.API_BASE_URL}/user`, {
        method: "GET",
        headers: {
          Authorization: AuthorizationToken,
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data,"::::::::::->>>>>>>>>>>>");
        console.log(data.userData.role,"Role:->>>>>>>>>>>>");
        setUser(data.userData);
        await fetchUserRole(data.userData._id); 
        setIsLoading(false);
      } else {
        console.log('Error fetching user data');
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error Fetching user data", error);
      setIsLoading(false);
    }
  };

  const fetchUserRole = async (userId) => {
    try {
        console.log('Fetching role for user ID:', userId); // Log the user ID
        const response = await fetch(`${CONFIGS.API_BASE_URL}/fetchrole`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                // Authorization: AuthorizationToken,
            },
            body: JSON.stringify({ _id: userId }),
        });
        

        if (response.ok) {
            const data = await response.json();
            setRole(data.role);
        } else {
            const errorData = await response.json();
            console.log('Error fetching role:', errorData);
        }
    } catch (error) {
        console.log('Error fetching role', error);
    }
};



  // Trigger user authentication when the token changes
  useEffect(() => {
    if (token) {
      userAuthentication(); // Fetch user data and role when token changes
    } else {
      setIsLoading(false);
    }
  }, [token]); // Dependency: token

  // Trigger fetchUserRole when user data changes and user._id exists
  useEffect(() => {
    if (user && user._id) {
      fetchUserRole(user._id); 
    }
  }, [user]); // Dependency: user

  return (
    <AuthContext.Provider value={{ isLoggedIn, storeTokenInLS, LogoutUser, user, role, isLoading,fetchUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth context
export const useAuth = () => {
  const AuthContextValue = useContext(AuthContext);
  if (!AuthContextValue) {
    throw new Error("useAuth used outside of the provider");
  }
  return AuthContextValue;
};
