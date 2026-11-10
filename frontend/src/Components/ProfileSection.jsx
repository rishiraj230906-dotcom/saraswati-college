import axios from "axios";
import logo from "../images/download.png";

const ProfileSection = ({ admission, student, setStudent, currentuser, setCurrentUser, setActive, userData }) => {
  const studentData = JSON.parse(sessionStorage.getItem("student"));

  const handleChangestudent = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value
    });
  };

  const handleChangeuser = (e) => {
    setCurrentUser({
      ...currentuser,
      [e.target.name]: e.target.value
    });
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:8080/user/updatestudentdetails/${userData.userid}`,
        null, // or remove this parameter if not needed
        {
          params: {
            firstname: currentuser.firstname,
            lastname: currentuser.lastname,
            phone: currentuser.phone
          }
        }
      );
      // Update local storage
      const updatedUser = { ...userData, ...currentuser };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      alert("User Details Updated Successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to update user details");
    }
  };

  const submitStudent = async (e) => {
    e.preventDefault();
    
    if (!studentData) {
      // CREATE new student
      try {
        const response = await axios.post(
          "http://localhost:8080/student/register",
          student,
          {
            params: {
              userid: userData.userid
            }
          }
        );
        
        // Save the returned student data with ID
        setStudent(response.data);
        sessionStorage.setItem("student", JSON.stringify(response.data));
        alert("Student details registered successfully");
        setActive("Home");
      } catch (error) {
        console.error("Registration error:", error);
        alert("Failed to register student details: " + (error.response?.data?.message || error.message));
      }
    } else {
      // UPDATE existing student
      try {
        await axios.patch(
          `http://localhost:8080/student/update/${student.studentid}`,
          student, // Send the whole student object as body
          {
            params: {
              gender: student.gender,
              dob: student.dob,
              address: student.address,
              guardianName: student.guardianName,
              emergencyNumber: student.emergencyNumber
            }
          }
        );
        
        // Update local storage
        sessionStorage.setItem("student", JSON.stringify(student));
        alert("Profile Updated Successfully");
        window.location.reload(); 
      } catch (error) {
        console.error("Update error:", error);
        alert("Failed to update profile: " + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!student?.studentid) {
      alert("Please save student details first before uploading image");
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      await axios.post(
        `http://localhost:8080/student/upload-profile/${student.studentid}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      alert("Profile picture updated successfully");
      
      // Force image refresh by adding timestamp
      const img = document.querySelector('.sd-profile-image');
      if (img) {
        img.src = `http://localhost:8080/student/profile-image/${student.studentid}?t=${new Date().getTime()}`;
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed: " + (err.response?.data?.message || err.message));
    }
  };

  // Combined save function
  const handleSave = async (e) => {
    e.preventDefault();
    await updateUser(e);
    await submitStudent(e);
  };

  return (
    <div className="sd-section">
      <div className="profile-container">
        <h2>Personal Details</h2>
        <div className="sd-profile-header">
          {/* LEFT SIDE - IMAGE */}
          <div className="sd-profile-image-wrapper">
            <img
              src={
                student?.studentid
                  ? `http://localhost:8080/student/profile-image/${student.studentid}`
                  : logo
              }
              alt="Profile"
              className="sd-profile-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = logo;
              }}
            />
            <label className="sd-camera-btn">
              <i className="fa-regular fa-camera"></i>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileUpload}
                hidden
              />
            </label>
          </div>
          {/* RIGHT SIDE - DETAILS */}
          <div className="sd-profile-details">
            <h2>
              {userData.firstname} {userData.lastname}
            </h2>
            <p><i className="fa-solid fa-graduation-cap"></i> {admission?.course?.courseName || "Apply for a course"}</p>
            <p>{userData.phone} <span className="sd-check">✔</span></p>
            <p>✉ {userData.email} <span className="sd-check">✔</span></p>
          </div>
        </div>
        
        <form onSubmit={handleSave}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input 
                type="text" 
                value={currentuser.firstname || ''} 
                onChange={handleChangeuser} 
                name="firstname" 
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input 
                type="text" 
                value={currentuser.lastname || ''} 
                onChange={handleChangeuser} 
                name="lastname" 
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Date of Birth</label>
              <input 
                type="date" 
                value={student.dob || ''} 
                onChange={handleChangestudent} 
                name="dob" 
                required
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select 
                value={student.gender || ''} 
                onChange={handleChangestudent} 
                name="gender" 
                required
              >
                <option value="">Select Gender</option>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
          </div>
          
          <div className="form-group full-width">
            <label>Address</label>
            <textarea 
              value={student.address || ''} 
              onChange={handleChangestudent} 
              name="address" 
              required
            ></textarea>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Guardian/Father's Name</label>
              <input 
                type="text" 
                value={student.guardianName || ''} 
                onChange={handleChangestudent} 
                name="guardianName" 
                required
              />
            </div>
            <div className="form-group">
              <label>Emergency Number</label>
              <input 
                type="text" 
                value={student.emergencyNumber || ''} 
                onChange={handleChangestudent} 
                name="emergencyNumber" 
                required
                maxLength={10}
                minLength={10}
              />
            </div>
          </div>
          
          <div className="save-btn-container">
            <button type="submit" className="save-btn">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSection; // Note the capital 'P'