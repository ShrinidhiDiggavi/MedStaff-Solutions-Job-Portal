import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, Award, Users, Briefcase, X, Phone, Mail, Linkedin, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

// Note: Image imports would need to be adjusted based on your project structure
import homepageimg from './homepageimg.jpg';
import doctor from './doctor.jpg';
import nurse from './nurse.jpg';

const AdminLogin = ({ onLogin, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      onLogin();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Admin Login</h2>
          <button onClick={onClose}><X className="w-6 h-6" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/${editUser.id}`, editUser);
      setIsEditing(false);
      setEditUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleBackToPortal = () => {
    window.location.href = '/';  // Changed to use proper navigation
  };
  const handleDownloadResume = async (userId, fileName) => {
    try {
      // Step 1: Make the request
      const response = await axios({
        url: `http://localhost:5000/api/users/${userId}/resume`,
        method: 'GET',
        responseType: 'blob',
      });
  
      // Step 2: Create blob and URL - Add console logs to debug
      console.log('Response received:', response);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
  
      // Create blob with explicit type
      const blob = new Blob([response.data], { 
        type: 'application/pdf' // or use response.headers['content-type']
      });
      console.log('Blob created:', blob);
  
      // Create object URL
      const url = window.URL.createObjectURL(blob);
      console.log('URL created:', url);
  
      // Step 3: Create and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'resume.pdf');
      document.body.appendChild(link);
      link.click();
  
      // Step 4: Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);
  
    } catch (error) {
      console.error('Download error details:', error);
      
      // Improved error messaging
      let errorMessage = 'Failed to download resume: ';
      
      if (error.response) {
        errorMessage += `Server error (${error.response.status})`;
      } else if (error.request) {
        errorMessage += 'No response from server';
      } else {
        errorMessage += error.message;
      }
  
      console.error(errorMessage);
      alert(errorMessage);
    }
  };
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = filterSpecialization === '' || user.specialization === filterSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <button
              onClick={handleBackToPortal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Home
            </button>
          </div>
          {/* Rest of AdminPanel component remains the same */}{/* Rest of AdminPanel component */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select
              className="border rounded-lg px-4 py-2"
              value={filterSpecialization}
              onChange={(e) => setFilterSpecialization(e.target.value)}
            >
              <option value="">All Specializations</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Contact</th>
                  <th className="px-4 py-3 text-left">Specialization</th>
                  <th className="px-4 py-3 text-left">Experience</th>
                   <th className="px-4 py-3 text-left">Resume</th> 
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.contactNumber}</td>
                    <td className="px-4 py-3">{user.specialization}</td>
                    <td className="px-4 py-3">{user.experience} years</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDownloadResume(user.id, `${user.name}_resume.pdf`)}
                        className="p-2 hover:bg-blue-100 rounded-lg flex items-center text-blue-600"
                        title="Download Resume"
                      >
                        <svg 
                          className="w-5 h-5" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                          />
                        </svg>
                        <span className="ml-2">Download</span>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-1 hover:bg-blue-100 rounded"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-1 hover:bg-red-100 rounded"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit User</h2>
              <button onClick={() => setIsEditing(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={editUser.name}
                    onChange={(e) => setEditUser({...editUser, name: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={editUser.email}
                    onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Number</label>
                  <input
                    type="text"
                    value={editUser.contactNumber}
                    pattern="[0-9]{10}"
                    onChange={(e) => setEditUser({...editUser, contactNumber: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    value={editUser.experience}
                    onChange={(e) => setEditUser({...editUser, experience: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Specialization</label>
                  <select
                    value={editUser.specialization}
                    onChange={(e) => setEditUser({...editUser, specialization: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
const MedicalPortal = () => {
  const [showModal, setShowModal] = useState(false);
  const [profession, setProfession] = useState('');
  const [name, setName] = useState('');
  const [experience, setExperience] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [otherSpecialization, setOtherSpecialization] = useState('');
  const [resume, setResume] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const scrollToOpportunities = () => {
    const element = document.getElementById('opportunities');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToJobs = () => {
    const element = document.getElementById('opportunities');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openRegistrationModal = (type) => {
    setProfession(type);
    setShowModal(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('experience', experience);
    formData.append('email', email);
    formData.append('contactNumber', contactNumber);
    formData.append('specialization', specialization);
    formData.append('otherSpecialization', otherSpecialization);
    formData.append('resume', resume);

    try {
      const response = await axios.post('http://localhost:5000/api/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response.data);
      alert('Application submitted successfully!');
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error submitting the form:', error);
      alert('Failed to submit the application.');
    }
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    setShowAdminLogin(false);
  };

  const resetForm = () => {
    setName('');
    setExperience('');
    setEmail('');
    setContactNumber('');
    setSpecialization('');
    setOtherSpecialization('');
    setResume(null);
  };

  if (isAdmin) {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-md fixed w-full z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 text-transparent bg-clip-text">
                MedStaff Solutions
              </span>
            </div>
            <div className="flex items-center space-x-8">
              <button onClick={scrollToHome} className="text-gray-700 hover:text-blue-600">Home</button>
              <button onClick={scrollToJobs} className="text-gray-700 hover:text-blue-600">Jobs</button>
              <button 
                onClick={() => setShowAdminLogin(true)} 
                className="text-gray-700 hover:text-blue-600"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      
      <div className="relative pt-24">
  {/* Background Image */}
  <div 
    className="absolute inset-0 bg-cover bg-center opacity-30 z-0"
    style={{ backgroundImage: "url('./homepageimg.jpg')" }} // Set the image here
  />
  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 z-10" />

  <div className="max-w-7xl mx-auto px-4 pt-20 pb-32 relative z-20">
    <div className="flex items-center justify-between">
      <div className="w-1/2">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
          Your Gateway to Healthcare Excellence
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Join thousands of healthcare professionals who found their perfect role with us.
        </p>
        <div className="flex items-center space-x-4">
          <button 
            onClick={scrollToOpportunities} 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition"
          >
            Explore Opportunities
          </button>
          <button 
            onClick={scrollToOpportunities}
            className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition"
          >
            Learn More
          </button>
        </div>
      </div>
      <div className="w-1/2 flex justify-center">
        <img 
          src={homepageimg} 
          alt="Healthcare professionals" 
          className="rounded-2xl shadow-2xl" 
        />
      </div>
    </div>
  </div>
</div>


      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8">
            {[{ icon: Briefcase, title: 'Premium Positions', text: 'Access exclusive healthcare positions from top medical institutions.' },
             { icon: Award, title: 'Verified Employers', text: 'Work with certified and trusted healthcare organizations.' },
             { icon: Users, title: 'Career Growth', text: 'Advance your medical career with personalized opportunities.' }].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition group">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl w-14 h-14 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <feature.icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Explore Opportunities Section */}
      <div id="opportunities" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Explore Opportunities</h2>
          <p className="text-gray-600 text-center mb-12 text-xl">Find your perfect role in healthcare</p>
          <div className="grid grid-cols-2 gap-8">
            {/* Rest of the opportunities section remains the same */}
            {[{ title: 'Doctor Positions', description: 'Join leading hospitals and clinics. Advance your medical career with prestigious institutions.', image: doctor, type: 'doctor' },
              { title: 'Nursing Excellence', description: 'Find rewarding nursing positions at top healthcare facilities. Growth opportunities await.', image: nurse, type: 'nurse' }].map((category, index) => (
                <div key={index} onClick={() => openRegistrationModal(category.type)} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer">
                  <div className="relative">
                    <img src={category.image} alt={category.title} className="w-full h-64 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-semibold mb-2 text-gray-800">{category.title}</h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <span className="text-blue-600 font-semibold">Apply <ArrowRight className="inline" /></span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

{/* Contact Section */}
<div className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-white text-left mb-8">Contact Us</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600/20 p-3 rounded-full">
                  <Phone className="text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400">Name</p>
                  <p className="text-lg text-white">Ravi Bagali</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600/20 p-3 rounded-full">
                  <Mail className="text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="text-lg text-white">raviib@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600/20 p-3 rounded-full">
                  <Users className="text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400">Phone</p>
                  <p className="text-lg text-white">+91 89807 11974</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600/20 p-3 rounded-full">
                  <Linkedin className="text-blue-400" />
                </div>
                <div>
                <p className="text-gray-400">LinkedIn</p>
          <a href="https://www.linkedin.com/in/ravi-bagali-54b65518?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app." target="_blank" rel="noopener noreferrer" className="text-lg text-white underline">
            www.linkedin.com/in/ravibagali
          </a>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Add the AdminLogin modal */}
      {showAdminLogin && (
        <AdminLogin
          onLogin={handleAdminLogin}
          onClose={() => setShowAdminLogin(false)}
        />
      )}
  {/* Registration Modal */}
{showModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
    <div className="bg-white rounded-lg shadow-lg p-8 w-96">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{profession === 'doctor' ? 'Doctor Registration' : 'Nurse Registration'}</h3>
        <button onClick={() => setShowModal(false)}>
          <X className="text-gray-400 hover:text-gray-600" />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name: *</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            className="border rounded w-full p-2" 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Experience (Years): *</label>
          <input 
            type="number" 
            value={experience} 
            onChange={(e) => setExperience(e.target.value)} 
            required 
            min="0"
            className="border rounded w-full p-2" 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email: *</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="border rounded w-full p-2" 
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Contact Number: *</label>
          <input 
            type="text" 
            value={contactNumber} 
            onChange={(e) => setContactNumber(e.target.value)} 
            required 
            pattern="[0-9]{10}"
            title="Please enter a valid 10-digit phone number"
            className="border rounded w-full p-2" 
          />
        </div>
        {/* Remove the specialization field */}
        {/* <div className="mb-4">
          <label className="block text-gray-700">Specialization: *</label>
          <select 
            value={specialization} 
            onChange={(e) => setSpecialization(e.target.value)} 
            required
            className="border rounded w-full p-2"
          >
            <option value="">Select your specialization</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Other">Other</option>
          </select>
          {specialization === 'Other' && (
            <input 
              type="text" 
              value={otherSpecialization} 
              onChange={(e) => setOtherSpecialization(e.target.value)} 
              required
              placeholder="Please specify" 
              className="border rounded w-full p-2 mt-2" 
            />
          )}
        </div> */}
        <div className="mb-4">
          <label className="block text-gray-700">Resume: *</label>
          <input 
            type="file" 
            onChange={(e) => setResume(e.target.files[0])} 
            required
            accept=".pdf,.doc,.docx"
            className="border rounded w-full p-2" 
          />
        </div>
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
        )}
        </div>
      );
    };
    
    export default MedicalPortal;
  
  
