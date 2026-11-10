import { useEffect, useState } from "react";
import "./AdmissionSection.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdmissionSection = ({ userData, admission, setAdmission }) => {
  const studentData = JSON.parse(sessionStorage.getItem("student"));
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [isOpen, setIsOpen] = useState(false);
  const [activeInnerTab, setActiveInnerTab] = useState("form");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [tenthMarksheet, setTenthMarksheet] = useState(null);
  const [twelfthMarksheet, setTwelfthMarksheet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (admission && admission?.admissionid) {
      setActiveInnerTab("payment");
    } else {
      setActiveInnerTab("form");
    }
  }, [admission]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:8080/course/getall");
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const submitAdmission = async (e) => {
    e.preventDefault();
    
    if (!studentData?.studentid) {
      alert("Please complete your profile first");
      navigate("/dashboard?tab=profile");
      return;
    }
    
    if (!selectedCourse) {
      alert("Please select a course");
      return;
    }
    
    if (!tenthMarksheet || !twelfthMarksheet) {
      alert("Please upload both marksheets");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("studentId", studentData.studentid);
    formData.append("courseId", selectedCourse);
    formData.append("tenthMarksheet", tenthMarksheet);
    formData.append("twelfthMarksheet", twelfthMarksheet);

    try {
      const response = await axios.post(
        "http://localhost:8080/admission/apply", 
        formData, 
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      
      alert("Admission form submitted successfully!");
      
      // Fetch the newly created admission
      const admissionRes = await axios.get(
        `http://localhost:8080/admission/get/${studentData.studentid}`
      );
      
      setAdmission(admissionRes.data);
      sessionStorage.setItem("admission", JSON.stringify(admissionRes.data));
      
      // Automatically switch to payment tab
      setActiveInnerTab("payment");
      
    } catch (err) {
      console.error("Admission submission error:", err);
      alert(err.response?.data?.message || "Failed to submit admission form");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!admission?.admissionid) {
      alert("Admission not loaded yet");
      return;
    }

    if (!admission.course?.totalFees) {
      alert("Course fee information not available");
      return;
    }

    setPaymentLoading(true);
    try {
      // Get transaction details
      const response = await axios.get(
        `http://localhost:8080/payment/getTransaction/${admission?.course?.totalFees}`
      );
      
      const order = response.data;
      const admissionId = admission?.admissionid;
      
      const options = {
        key: order.key,
        amount: order.amount,
        currency: "INR",
        name: "Saraswati College",
        description: `Admission Fee for ${admission.course.courseName}`,
        order_id: order.orderId,
        
        handler: async function (response) {
          try {
            // Confirm payment
            await axios.post(
              `http://localhost:8080/admission/confirmpayment/${admissionId}`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              }
            );
            
            // Update local admission data
            const updatedAdmission = {
              ...admission,
              feeStatus: "PAID"
            };
            setAdmission(updatedAdmission);
            sessionStorage.setItem("admission", JSON.stringify(updatedAdmission));
            
            alert("Payment Successful! Your admission is confirmed.");
            
          } catch (error) {
            console.error("Payment confirmation error:", error);
            alert("Payment was successful but confirmation failed. Please contact support.");
            window.location.reload();
          }
        },
        prefill: {
          name: `${user?.firstname || ''} ${user?.lastname || ''}`,
          email: user?.email || '',
          contact: user?.phone || ''
        },
        theme: {
          color: "#dc3545"
        }
      };
      
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Payment initialization failed:", error);
      alert("Failed to initialize payment. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  // Get fee status badge class
  const getFeeStatusClass = (status) => {
    switch(status?.toUpperCase()) {
      case "PAID":
        return "fee-paid";
      case "PENDING":
        return "fee-pending";
      case "UNPAID":
        return "fee-unpaid";
      default:
        return "fee-unpaid";
    }
  };

  // Get admission status badge class
  const getStatusClass = (status) => {
    switch(status) {
      case "APPROVED":
        return "status-approved";
      case "REJECTED":
        return "status-rejected";
      case "PENDING":
        return "status-pending";
      default:
        return "status-pending";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="admission-section">
      {/* Header */}
      <div className="admission-header">
        <h2>
          <i className="fa-solid fa-file-signature"></i> 
          {admission?.admissionid ? "Admission Details & Payment" : "Apply for Admission"}
        </h2>
        {admission?.admissionid ? (
          <div className="admission-status-badges">
            <span className={`status-badge ${getStatusClass(admission.status)}`}>
              <i className="fa-solid fa-circle"></i> {admission.status}
            </span>
            <span className={`fee-badge ${getFeeStatusClass(admission.feestatus)}`}>
              <i className="fa-solid fa-indian-rupee-sign"></i> Fee: {admission.feestatus || "UNPAID"}
            </span>
          </div>
        ) : (
          <div></div>
        )}
      </div>

      {admission?.admissionid && (
        <div className="admission-stepper">
          <div className={`stepper-step ${activeInnerTab === "form" ? "active" : "completed"}`}>
            <div className="step-icon">
              <i className="fa-solid fa-file"></i>
            </div>
            <div className="step-content">
              <span className="step-label">Step 1</span>
              <span className="step-title">Application Form</span>
            </div>
          </div>
          <div className="stepper-line"></div>
          <div 
            className={`stepper-step ${activeInnerTab === "payment" ? "active" : ""} ${admission.feestaus === "PAID" ? "completed" : ""}`}>
            <div className="step-icon">
              <i className="fa-solid fa-credit-card"></i>
            </div>
            <div className="step-content">
              <span className="step-label">Step 2</span>
              <span className="step-title">Payment</span>
            </div>
          </div>
        </div>
      )}

      {!admission?.admissionid ? (
        /* NO ADMISSION - SHOW FORM */
        <div className="admission-form-container">
          <div className="form-info-card">
            <i className="fa-solid fa-circle-info"></i>
            <div>
              <h3>Ready to begin your journey?</h3>
              <p>Fill out the admission form below to apply for your desired course.</p>
            </div>
          </div>

          <form className="admission-form" onSubmit={submitAdmission}>
            <div className="form-grid">
              {/* Personal Information - Read Only */}
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={`${user?.firstname || ''} ${user?.lastname || ''}`}
                      disabled
                      className="readonly-field"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={user?.email || ''} disabled className="readonly-field" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="text" value={user?.phone || ''} disabled className="readonly-field" />
                  </div>
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input type="text" value={studentData?.dob || ''} disabled className="readonly-field" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Gender</label>
                    <input type="text" value={studentData?.gender || ''} disabled className="readonly-field" />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input type="text" value={studentData?.address || ''} disabled className="readonly-field" />
                  </div>
                </div>
              </div>

              {/* Course Selection */}
              <div className="form-section">
                <h3>Course Selection</h3>
                <div className="form-group">
                  <label>Select Course <span className="required">*</span></label>
                  <div className="custom-select">
                    <div
                      className={`select-header ${isOpen ? 'open' : ''}`}
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      {selectedCourse
                        ? courses.find((c) => c.courseid === parseInt(selectedCourse))?.courseName
                        : "-- Select Course --"}
                      <span className={`arrow ${isOpen ? "rotate" : ""}`}>
                        <i className="fa-solid fa-chevron-down"></i>
                      </span>
                    </div>

                    {isOpen && (
                      <div className="select-dropdown">
                        {courses.map((course) => (
                          <div
                            key={course.courseid}
                            className="select-option"
                            onClick={() => {
                              setSelectedCourse(course.courseid.toString());
                              setIsOpen(false);
                            }}
                          >
                            <div className="option-content">
                              <span className="course-name">{course.courseName}</span>
                              <span className="course-duration">{course.duration} Years</span>
                              <span className="course-fees">₹{course.totalFees}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Documents Upload */}
              <div className="form-section">
                <h3>Required Documents</h3>
                <div className="upload-grid">
                  <div className="upload-box">
                    <label>10th Marksheet <span className="required">*</span></label>
                    <div className="file-upload">
                      <input
                        type="file"
                        id="tenthMarksheet"
                        accept=".pdf,image/*"
                        onChange={(e) => setTenthMarksheet(e.target.files[0])}
                        required
                      />
                      <label htmlFor="tenthMarksheet" className="file-label">
                        <i className="fa-solid fa-cloud-upload-alt"></i>
                        <span>{tenthMarksheet ? tenthMarksheet.name : "Choose file"}</span>
                      </label>
                    </div>
                    {tenthMarksheet && (
                      <span className="file-success">
                        <i className="fa-solid fa-check-circle"></i> File selected
                      </span>
                    )}
                  </div>

                  <div className="upload-box">
                    <label>12th Marksheet <span className="required">*</span></label>
                    <div className="file-upload">
                      <input
                        type="file"
                        id="twelfthMarksheet"
                        accept=".pdf,image/*"
                        onChange={(e) => setTwelfthMarksheet(e.target.files[0])}
                        required
                      />
                      <label htmlFor="twelfthMarksheet" className="file-label">
                        <i className="fa-solid fa-cloud-upload-alt"></i>
                        <span>{twelfthMarksheet ? twelfthMarksheet.name : "Choose file"}</span>
                      </label>
                    </div>
                    {twelfthMarksheet && (
                      <span className="file-success">
                        <i className="fa-solid fa-check-circle"></i> File selected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn1" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i> Submitting...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane"></i> Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="payment-container">
          {activeInnerTab === "payment" && (
            <div className="payment-content">
              <div className="application-summary">
                <h3>
                  <i className="fa-solid fa-receipt"></i> Application Summary
                </h3>
                <div className="summary-details">
                  <div className="summary-row">
                    <span className="summary-label">Application ID:</span>
                    <span className="summary-value">#{admission.admissionid}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Student Name:</span>
                    <span className="summary-value">
                      {userData?.firstname} {userData?.lastname}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Course:</span>
                    <span className="summary-value">{admission.course?.courseName}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Duration:</span>
                    <span className="summary-value">{admission.course?.duration} Years</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Admission Status:</span>
                    <span className={`summary-value status-badge ${getStatusClass(admission.status)}`}>
                      {admission.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Card */}
              <div className="payment-card">
                <div className="payment-header">
                  <i className="fa-solid fa-credit-card"></i>
                  <h3>Fee Payment</h3>
                </div>

                <div className="fee-details">
                  <div className="fee-row">
                    <span>Tuition Fee:</span>
                    <span>₹{admission.course?.totalFees}</span>
                  </div>
                  <div className="fee-row total">
                    <span>Total Amount:</span>
                    <span>₹{admission.course?.totalFees}</span>
                  </div>
                </div>

                {admission.feestatus === "PAID" ? (
                  <div className="payment-success">
                    <i className="fa-solid fa-check-circle"></i>
                    <h4>Payment Completed!</h4>
                    <p>Your admission is confirmed. Welcome to Saraswati College!</p>
                    {/* <button className="download-receipt-btn">
                      <i className="fa-solid fa-download"></i> Download Receipt
                    </button> */}
                  </div>
                ) : (
                  <div className="payment-actions">
                    {admission.status === "REJECTED" ? (
                      <div className="payment-error">
                        <i className="fa-solid fa-exclamation-circle"></i>
                        <p>Your admission has been rejected. Please contact administration.</p>
                        <button 
                          className="apply-again-btn"
                          onClick={() => setActiveInnerTab("form")}
                        >
                          Apply Again
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="payment-info">
                          <i className="fa-solid fa-info-circle"></i>
                          <p>Complete the payment to confirm your admission.</p>
                        </div>
                        <button 
                          className="pay-now-btn" 
                          onClick={handlePayment}
                          disabled={paymentLoading || admission.status === "REJECTED"}
                        >
                          {paymentLoading ? (
                            <>
                              <i className="fa-solid fa-spinner fa-spin"></i> Processing...
                            </>
                          ) : (
                            <>
                              <i className="fa-solid fa-lock"></i> Pay Now
                            </>
                          )}
                        </button>
                        <p className="payment-note">
                          <i className="fa-solid fa-shield-alt"></i>
                          Secure payment powered by Razorpay
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Documents Card */}
              {admission.tenthMarksheet && admission.twelfthMarksheet && (
                <div className="documents-card">
                  <h4>
                    <i className="fa-solid fa-file"></i> Uploaded Documents
                  </h4>
                  <div className="document-links">
                    <a href={admission.tenthMarksheet} target="_blank" rel="noopener noreferrer">
                      <i className="fa-solid fa-file-pdf"></i> 10th Marksheet
                    </a>
                    <a href={admission.twelfthMarksheet} target="_blank" rel="noopener noreferrer">
                      <i className="fa-solid fa-file-pdf"></i> 12th Marksheet
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdmissionSection;