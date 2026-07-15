import "./App.css";
import { Link } from "react-router";
import useAuth from "./config/useAuth";

function App() {
  const { userId } = useAuth();
  return userId ? (
    <div>
      <Link to="/logout">Logout</Link>
    </div>
  ) : (
    <>
      <div>
        <Link to="/register"> Sign- up</Link>
      </div>
      <div>
        <Link to="/login">Login </Link>
      </div>
    </>
  );
}

export default App;
