import "./Studentdashboard.css";
import axios from "axios";
import { useState, useEffect } from "react";
import logo from "../images/logo.png";
import logo1 from "../images/download.png";
import AdmissionSection from "../Components/AdmissionSection";
import ProfileSection from "../Components/ProfileSection";
import Courses from "../Components/Courses";

const Studentdashboard = () => {
  const userData = JSON.parse(sessionStorage.getItem("user"));
  const studentData = JSON.parse(sessionStorage.getItem("student"));
  const admissionData = JSON.parse(sessionStorage.getItem("admission"));
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleMenuItemClick = (tab) => {
    setActive(tab);
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };
  const [active, setActive] = useState("Home");
  const [admission, setAdmission] = useState({
    admissionid: admissionData?.admissionid || "",
    student: admissionData?.student || "",
    course: admissionData?.course || "",
    status: admissionData?.status || "",
    feestatus: admissionData?.feestatus || "",
    applicationDate: admissionData?.applicationDate || ""
  });
  const [currentuser, setCurrentUser] = useState({
    firstname: userData.firstname,
    lastname: userData.lastname,
    phone: userData.phone
  });
  const [student, setStudent] = useState({
    gender: studentData?.gender || "",
    dob: studentData?.dob || "",
    address: studentData?.address || "",
    guardianName: studentData?.guardianName || "",
    emergencyNumber: studentData?.emergencyNumber || ""
  });

  useEffect(() => {
    fetchStudentandAdmission();
  }, []);

  const fetchStudentandAdmission = async () => {
  setLoading(true);
  try {
    console.log("Userid:", userData.userid);
    const studentResponse = await axios.get(
      `http://localhost:8080/student/user/${userData.userid}`,
    );
    
    // Set student data
    setStudent(studentResponse.data);
    sessionStorage.setItem("student", JSON.stringify(studentResponse.data));
    
    // Now fetch admission using the student ID from the response
    try {
      const admissionResponse = await axios.get(
        `http://localhost:8080/admission/get/${studentResponse.data.studentid}`
      );
      setAdmission(admissionResponse.data);
      sessionStorage.setItem("admission", JSON.stringify(admissionResponse.data));
      console.log("Admission data:", admissionResponse.data);
    } catch (err) {
      console.error("Admission fetch error:", err);
      // If admission not found (404), set to null
      if (err.response?.status === 404) {
        setAdmission(null);
        sessionStorage.removeItem("admission");
      } else {
        setAdmission(null);
      }
    }
    
  } catch (error) {
    console.error("Student fetch error:", error);
    setStudent({});
  } finally {
    setLoading(false);
  }
};

  const renderContent = () => {
    if (loading) {
      return (
        <div className="sd-loading">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      );
    }
    switch (active) {
      case "Admission":
        return <AdmissionSection
          userData={userData}
          admission={admission}
          setAdmission={setAdmission}
        />;
      case "Profile":
        return <ProfileSection
          student={student}
          setStudent={setStudent}
          currentuser={currentuser}
          setCurrentUser={setCurrentUser}
          userData={userData}
          admission={admission}
          setActive={setActive}
        />;
      case "Courses":
        return <Courses />;
      default:
        if (admission?.status == "APPROVED") {
          return (
            <div className="sd-home">
              {/* Welcome Banner */}
              <div className="sd-banner">
                <div className="sd-banner-text">
                  <p className="sd-date">{new Date().toDateString()}</p>
                  <h1>Welcome back, {userData.firstname} 👋</h1>
                  <p>Stay updated with your academic progress</p>
                </div>
              </div>

              {/* Attendance Section */}
              <div className="sd-section-title">
                <h2>Attendance Overview</h2>
              </div>

              <div className="sd-stats">
                <div className="sd-card">
                  <h3>100%</h3>
                  <p>Attendance</p>
                </div>

                <div className="sd-card">
                  <h3>0</h3>
                  <p>Late</p>
                </div>

                <div className="sd-card">
                  <h3>0</h3>
                  <p>Absent</p>
                </div>
              </div>

              {/* Courses */}
              <div className="sd-section-title">
                <h2>Enrolled Course</h2>
              </div>
              <div className="sd-courses">
                <div className="sd-course-card">
                  {admission.course && (
                    <div className="sd-course">
                      <h3>{admission.course.courseName}</h3>
                      <p>
                        {admission.course.duration} Years | ₹{admission.course.totalFees}
                      </p>
                      <p>Level: {admission.course.levelofstudy}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }
        return (
          <div className="sd-admission-warning">
            <div className="warning-box">
              <div className="warning-icon">⚠️</div>
              <h2>Please complete your profile & apply for admission first</h2>
              <p>Your dashboard will be available after completion of your profile and approval of your admission.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="sd-container">
      {/* NAVBAR */}
      <div className="sd-navbar">
        <button className="sd-menu-toggle" onClick={toggleSidebar}>
          <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
        <div className="logo-container sd-logo">
          <img src={logo} alt="logo" className="logo-image" />
          <p>Saraswati College</p>
        </div>
        <div className="sd-user">
          <img src={`http://localhost:8080/student/profile-image/${student.studentid}`} alt="profile" onError={(e) => { e.target.onerror = null; e.target.src = logo1; }} />
          <span>Welcome, {userData.firstname}</span>
        </div>
      </div>
      {/* SIDEBAR */}
      <div className={`sd-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sd-sidebar-header">
          <button className="sd-sidebar-close" onClick={toggleSidebar}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <ul>
          <li onClick={() => handleMenuItemClick("Home")} className={active === "Home" ? "active" : ""}>
            <i className="fas fa-home"></i> <span>Home</span>
          </li>
          <li onClick={() => handleMenuItemClick("Admission")} className={active === "Admission" ? "active" : ""}>
            <i className="fas fa-file-signature"></i> <span>Admission</span>
          </li>
          <li onClick={() => handleMenuItemClick("Profile")} className={active === "Profile" ? "active" : ""}>
            <i className="fas fa-user"></i> <span>Profile</span>
          </li>
          <li onClick={() => handleMenuItemClick("Courses")} className={active === "Courses" ? "active" : ""}>
            <i className="fas fa-book"></i> <span>Courses</span>
          </li>
          <li onClick={() => { sessionStorage.clear(); window.location.href = "/register"; }}>
            <i className="fas fa-sign-out-alt"></i> <span>Logout</span>
          </li>
        </ul>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && <div className="sd-overlay" onClick={toggleSidebar}></div>}
      {/* MAIN */}
      <div className="sd-main">
        {renderContent()}
      </div>
    </div>
  );
};

export default Studentdashboard;