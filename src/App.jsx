import "./App.css";
import { Link } from "react-router";

function App() {
  return (
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
