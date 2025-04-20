import { createContext, useContext } from "react";

// Create a temporary context with dummy values
const AuthContext = createContext({
  isAuthenticated: () => false,
  user: null,
  loading: false,
  login: () => Promise.resolve({ success: false }),
  register: () => Promise.resolve({ success: false }),
  logout: () => {},
});

// Export the context hook
export const useAuthContext = () => {
  return useContext(AuthContext);
};

// Export a simple provider that doesn't do anything
export const AuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: () => false,
        user: null,
        loading: false,
        login: () => Promise.resolve({ success: false }),
        register: () => Promise.resolve({ success: false }),
        logout: () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};