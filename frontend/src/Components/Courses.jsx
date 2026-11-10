import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Courses.css'; // Create this CSS file

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [filter, setFilter] = useState('all'); // all, undergraduate, postgraduate, diploma

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/course/getall');
      console.log('Courses fetched:', response.data);
      setCourses(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter courses based on level of study
  const getFilteredCourses = () => {
    if (filter === 'all') return courses;
    return courses.filter(course => 
      course.levelofstudy?.toLowerCase() === filter.toLowerCase()
    );
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get level badge color
  const getLevelBadgeClass = (level) => {
    switch(level?.toLowerCase()) {
      case 'undergraduate':
        return 'badge-ug';
      case 'postgraduate':
        return 'badge-pg';
      case 'diploma':
        return 'badge-diploma';
      default:
        return 'badge-other';
    }
  };

  if (loading) {
    return (
      <div className="courses-loading">
        <div className="spinner"></div>
        <p>Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="courses-error">
        <i className="fa-solid fa-exclamation-circle"></i>
        <p>{error}</p>
        <button onClick={fetchCourses} className="retry-btn">
          <i className="fa-solid fa-rotate-right"></i> Retry
        </button>
      </div>
    );
  }

  const filteredCourses = getFilteredCourses();

  return (
    <div className="courses-container">
      {/* Header */}
      <div className="courses-header">
        <h1>
          <i className="fa-solid fa-book-open"></i> 
          Available Courses
        </h1>
        <p>Explore our comprehensive range of academic programs</p>
      </div>

      {/* Filters */}
      <div className="courses-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Courses
        </button>
        <button 
          className={`filter-btn ${filter === 'undergraduate' ? 'active' : ''}`}
          onClick={() => setFilter('undergraduate')}
        >
          Undergraduate
        </button>
        <button 
          className={`filter-btn ${filter === 'postgraduate' ? 'active' : ''}`}
          onClick={() => setFilter('postgraduate')}
        >
          Postgraduate
        </button>
        <button 
          className={`filter-btn ${filter === 'diploma' ? 'active' : ''}`}
          onClick={() => setFilter('diploma')}
        >
          Diploma
        </button>
      </div>

      {/* Stats */}
      <div className="courses-stats">
        <div className="stat-card">
          <i className="fa-solid fa-graduation-cap"></i>
          <div>
            <h3>{courses.length}</h3>
            <p>Total Courses</p>
          </div>
        </div>
        <div className="stat-card">
          <i className="fa-solid fa-clock"></i>
          <div>
            <h3>{courses.reduce((acc, course) => acc + (course.duration || 0), 0)}</h3>
            <p>Total Years</p>
          </div>
        </div>
        <div className="stat-card">
          <i className="fa-solid fa-users"></i>
          <div>
            <h3>{courses.filter(c => c.levelofstudy === 'UNDERGRADUATE').length}</h3>
            <p>UG Programs</p>
          </div>
        </div>
        <div className="stat-card">
          <i className="fa-solid fa-user-graduate"></i>
          <div>
            <h3>{courses.filter(c => c.levelofstudy === 'POSTGRADUATE').length}</h3>
            <p>PG Programs</p>
          </div>
        </div>
        <div className="stat-card">
          <i className="fa-solid fa-user-graduate"></i>
          <div>
            <h3>{courses.filter(c => c.levelofstudy === 'DIPLOMA').length}</h3>
            <p>Diploma Programs</p>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="no-courses">
          <i className="fa-solid fa-search"></i>
          <h3>No courses found</h3>
          <p>Try changing your filter criteria</p>
        </div>
      ) : (
        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <div 
              key={course.courseid} 
              className={`course-card ${selectedCourse?.courseid === course.courseid ? 'selected' : ''}`}
              onClick={() => setSelectedCourse(course)}
            >
              <div className="course-header">
                <h3>{course.courseName}</h3>
                <span className={`level-badge ${getLevelBadgeClass(course.levelofstudy)}`}>
                  {course.levelofstudy || 'Not Specified'}
                </span>
              </div>
              
              <div className="course-body">
                <p className="course-description">
                  {course.description || 'Comprehensive program designed to provide in-depth knowledge and practical skills in the field.'}
                </p>
                
                <div className="course-details">
                  <div className="detail-item">
                    <i className="fa-regular fa-clock"></i>
                    <span>{course.duration} Years</span>
                  </div>
                  <div className="detail-item">
                    <i className="fa-solid fa-tag"></i>
                    <span>{formatCurrency(course.totalFees)}</span>
                  </div>
                  {/* {course.seats && (
                    <div className="detail-item">
                      <i className="fa-solid fa-chair"></i>
                      <span>{course.seats} Seats</span>
                    </div>
                  )} */}
                </div>
              </div>

              <div className="course-footer">
                <button className="view-details-btn">
                  View Details <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="modal-overlay" onClick={() => setSelectedCourse(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCourse(null)}>
              <i className="fa-solid fa-times"></i>
            </button>
            
            <h2>{selectedCourse.courseName}</h2>
            
            <div className="modal-badges">
              <span className={`level-badge ${getLevelBadgeClass(selectedCourse.levelofstudy)}`}>
                {selectedCourse.levelofstudy}
              </span>
              {selectedCourse.duration && (
                <span className="duration-badge">
                  <i className="fa-regular fa-clock"></i> {selectedCourse.duration} Years
                </span>
              )}
            </div>

            <div className="modal-section">
              <h3>Program Overview</h3>
              <p>{selectedCourse.description || 'No description available.'}</p>
            </div>

            <div className="modal-details-grid">
              <div className="modal-detail-item">
                <label>Total Fees</label>
                <p className="fees">{formatCurrency(selectedCourse.totalFees)}</p>
              </div>
              {selectedCourse.seats && (
                <div className="modal-detail-item">
                  <label>Available Seats</label>
                  <p>{selectedCourse.seats}</p>
                </div>
              )}
              {selectedCourse.eligibility && (
                <div className="modal-detail-item full-width">
                  <label>Eligibility</label>
                  <p>{selectedCourse.eligibility}</p>
                </div>
              )}
            </div>

            {selectedCourse.syllabus && (
              <div className="modal-section">
                <h3>Syllabus Highlights</h3>
                <p>{selectedCourse.syllabus}</p>
              </div>
            )}

            <button className="apply-btn1" onClick={() => {
              alert('Redirecting to admission form...');
              setSelectedCourse(null);
            }}>
              Apply for this Course
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;