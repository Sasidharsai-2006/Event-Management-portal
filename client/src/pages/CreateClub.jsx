import React, { useState } from 'react'
import { Users, Mail, Phone, Upload, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const CreateClub = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    type: 'student_led',
    maxMembers: 50,
    membershipFee: '',
    contactEmail: '',
    contactPhone: '',
    facultyAdvisorName: '',
    facultyAdvisorEmail: '',
    facultyAdvisorDepartment: '',
    meetingDay: '',
    meetingTime: '',
    meetingVenue: '',
    meetingFrequency: 'weekly'
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Club created:', formData)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/clubs" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Clubs
        </Link>

        <div className="card">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Club</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Club Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input"
                      placeholder="Enter club name"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="input"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="academic">Academic</option>
                      <option value="cultural">Cultural</option>
                      <option value="sports">Sports</option>
                      <option value="technical">Technical</option>
                      <option value="social">Social</option>
                      <option value="literary">Literary</option>
                      <option value="dance">Dance</option>
                      <option value="music">Music</option>
                      <option value="drama">Drama</option>
                      <option value="photography">Photography</option>
                      <option value="debate">Debate</option>
                      <option value="environmental">Environmental</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Club Type *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="input"
                      required
                    >
                      <option value="student_led">Student Led</option>
                      <option value="faculty_led">Faculty Led</option>
                      <option value="official">Official</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Max Members</label>
                    <input
                      type="number"
                      name="maxMembers"
                      value={formData.maxMembers}
                      onChange={handleChange}
                      className="input"
                      min="5"
                      max="200"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label className="label">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="input"
                    rows={4}
                    placeholder="Enter club description"
                    required
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Contact Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        className="input pl-10"
                        placeholder="club@campusconnect.edu"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Contact Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        className="input pl-10"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Faculty Advisor */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Faculty Advisor</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="label">Advisor Name</label>
                    <input
                      type="text"
                      name="facultyAdvisorName"
                      value={formData.facultyAdvisorName}
                      onChange={handleChange}
                      className="input"
                      placeholder="Dr. John Smith"
                    />
                  </div>
                  <div>
                    <label className="label">Advisor Email</label>
                    <input
                      type="email"
                      name="facultyAdvisorEmail"
                      value={formData.facultyAdvisorEmail}
                      onChange={handleChange}
                      className="input"
                      placeholder="advisor@campusconnect.edu"
                    />
                  </div>
                  <div>
                    <label className="label">Department</label>
                    <input
                      type="text"
                      name="facultyAdvisorDepartment"
                      value={formData.facultyAdvisorDepartment}
                      onChange={handleChange}
                      className="input"
                      placeholder="Computer Science"
                    />
                  </div>
                </div>
              </div>

              {/* Meeting Schedule */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Meeting Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="label">Meeting Day</label>
                    <select
                      name="meetingDay"
                      value={formData.meetingDay}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="">Select day</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Meeting Time</label>
                    <input
                      type="time"
                      name="meetingTime"
                      value={formData.meetingTime}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Meeting Venue</label>
                    <input
                      type="text"
                      name="meetingVenue"
                      value={formData.meetingVenue}
                      onChange={handleChange}
                      className="input"
                      placeholder="Room 101"
                    />
                  </div>
                  <div>
                    <label className="label">Frequency</label>
                    <select
                      name="meetingFrequency"
                      value={formData.meetingFrequency}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="bi-weekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Membership Fee */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Membership</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Membership Fee (Optional)</label>
                    <input
                      type="number"
                      name="membershipFee"
                      value={formData.membershipFee}
                      onChange={handleChange}
                      className="input"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              {/* Club Logo */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Club Logo</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Click to upload club logo or drag and drop</p>
                  <input type="file" className="hidden" accept="image/*" />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Link to="/clubs" className="btn-outline">
                  Cancel
                </Link>
                <button type="submit" className="btn-primary">
                  Create Club
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateClub
