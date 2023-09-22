import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthContext } from "./components/shared/context/auth-context";
import { useAuth } from "./components/shared/hooks/auth-hook";

import Error from "./pages/Error";
import Root from "./pages/Root";
import HomePage from "./pages/HomePage";
import Doctors from "./pages/Doctors";
import DoctorAdd from "./pages/DoctorAdd";
import DoctorEdit from "./pages/DoctorEdit";
import Appointment from "./pages/Appointment";
import AppointmentInfo from "./pages/AppointmentInfo";
import AuthPage from "./pages/AuthPage";
import UserPage from "./pages/UserPage";
import UserInfo from "./pages/UserInfo";
import UserReview from "./pages/UserReview";
import Termeni from "./pages/Termeni";
import Confidential from "./pages/Confidential";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "medici",
        element: <Doctors />,
      },
      { path: "medici/adaugare", element: <DoctorAdd /> },
      { path: "medici/editare/:medicID", element: <DoctorEdit /> },

      { path: "programare", element: <Appointment /> },
      { path: "programare/:medicID", element: <Appointment /> },

      { path: "autentificare", element: <AuthPage /> },
      { path: "user", element: <UserPage /> },
      { path: "user/:userID", element: <UserInfo /> },
      { path: "user/review/:medicID", element: <UserReview /> },
      { path: "user/programare/:appID", element: <AppointmentInfo /> },

      { path: "info/termeni", element: <Termeni /> },
      { path: "info/confidentialitate", element: <Confidential /> },
    ],
  },
]);

function App() {
  const { token, login, logout, userID, isAdmin } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userID: userID,
        isAdmin: isAdmin,
        login: login,
        logout: logout,
      }}
    >
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

export default App;
