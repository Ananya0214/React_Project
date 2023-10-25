import React from "react";
import CurrentLocation from "./currentLocation";
import "./App.css";

function App() {
  return (
    <React.Fragment>
      <div className="container">
        <CurrentLocation />
      </div>
      <div className="footer-info">
        Developed by{" "}
        <a href="">
          Ananya Bharat
        </a>{" "}
        &copy; 2023
      </div>
    </React.Fragment>
  );
}

export default App;

