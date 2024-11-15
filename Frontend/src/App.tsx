import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chat from "./pages/chat";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/signup";
import PrivateRoute from "./components/privateRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/chat"
          element={
            <PrivateRoute element={<Chat></Chat>} path={"/chat"}></PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
