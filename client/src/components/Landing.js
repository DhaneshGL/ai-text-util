import React from "react";
import Fitness2 from "./img3.svg";
import Fitness1 from "./img4.svg";
import { Link } from "react-router-dom";
const Landing = () => {
  return (
    <>
      <h1 className="w m1">Text Utilities</h1>
      <h4 className="w m1"> Streamline text manipulation and analysis.</h4>
      <div className="jc">  <Link className="btn btn-dark"  style={{ backgroundColor: '#1E1E1E',}} to="/form">
          Tools
        </Link></div>
      

      <div className="one jca">
        <img
          className="image img-fluid jca im s"
          src={Fitness1}
          alt="Fitness"
        />
        <img
          className="image img-fluid jca im s"
          src={Fitness2}
          alt="Fitness"
        />
      </div>
    </>
  );
};

export default Landing;
