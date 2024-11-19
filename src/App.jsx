import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "./App.css";

import Login from "./Components/Login/Login.jsx";
import SignUp from "./Components/SignUp/SignUp.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Dashboard from "./Components/Dashboard/Dashboard.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/signup",
    element: (
      <div>
        <SignUp />
      </div>
    ),
  },
  {
    path: "/login",
    element: (
      <div>
        <Login />
      </div>
    ),
  },
  {
    path: "/Home",
    element: (
      <div>
        <ProtectedRoute>
          <Navbar />
          <Dashboard />
        </ProtectedRoute>
      </div>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;