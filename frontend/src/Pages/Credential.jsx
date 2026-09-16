import "./Credential.css";
import logo from "../images/logo.png";
// import useAuth from "../hooks/hooks";
import RenderContent from "../Components/RenderContent";
import { useState } from "react";

const Credential = () => {
  const [selectedTab, setSelectedTab] = useState("login");
  // const auth = useAuth();
  return (
    <div className="register-page">
      <nav className="cr-navbar">
        <div className="logo-container1">
          <img
            src={logo}
            alt="logo"
            className="logo-image1"
          />
          <p>Saraswati College</p>
        </div>
      </nav>
      <div className="auth-card">
        <div className="auth-tabs">
          <button
            className={
              selectedTab === "login"
                ? "active"
                : ""
            }
            onClick={() =>
              setSelectedTab("login")
            }
          >
            Login
          </button>
          <button
            className={
              selectedTab === "register"
                ? "active"
                : ""
            }
            onClick={() =>
              setSelectedTab("register")
            }
          >
            Register
          </button>
        </div>
        <div className="auth-body">
          <RenderContent
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </div>
      </div>
    </div>
  );
};

export default Credential;