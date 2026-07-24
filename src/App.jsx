import "./App.css";
import Navbar from "./Navbar";
import { Link } from "react-router";

function App() {
  return (
    <>
      <Navbar />
      <Link to="/sales-dashboard" target="_blank">
        <h3>Sales Summary - Customer Wise</h3>
      </Link>
      <Link to="/sales-itemwise-dashboard" target="_blank">
        <h3>Sales Summary - Item Wise</h3>
      </Link>
      <Link to="/purchase-dashboard" target="_blank">
        <h3>Purchase Summary - Supplier Wise</h3>
      </Link>
      <Link to="/purchase-itemwise-dashboard" target="_blank">
        <h3>Purchase Summary - Item Wise</h3>
      </Link>
    </>
  );
}

export default App;
