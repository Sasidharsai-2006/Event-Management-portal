import React, { useState } from 'react'
import { Calendar, MapPin, Users, DollarSign, Upload, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: '',
    category: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    venue: '',
    maxParticipants: '',
    registrationFee: '',
    rules: '',
    requirements: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Event created:', formData)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/events" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Link>

        <div className="card">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Event</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Event Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="input"
                      placeholder="Enter event title"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Event Type *</label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      className="input"
                      required
                    >
                      <option value="">Select event type</option>
                      <option value="academic">Academic</option>
                      <option value="cultural">Cultural</option>
                      <option value="sports">Sports</option>
                      <option value="technical">Technical</option>
                      <option value="social">Social</option>
                      <option value="workshop">Workshop</option>
                      <option value="competition">Competition</option>
                      <option value="seminar">Seminar</option>
                    </select>
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
                      <option value="individual">Individual</option>
                      <option value="team">Team</option>
                      <option value="group">Group</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Max Participants *</label>
                    <input
                      type="number"
                      name="maxParticipants"
                      value={formData.maxParticipants}
                      onChange={handleChange}
                      className="input"
                      placeholder="Enter max participants"
                      required
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
                    placeholder="Enter event description"
                    required
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Date & Time</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="label">Start Date *</label>
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">End Date *</label>
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Registration Deadline *</label>
                    <input
                      type="datetime-local"
                      name="registrationDeadline"
                      value={formData.registrationDeadline}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Venue *</label>
                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleChange}
                      className="input"
                      placeholder="Enter venue name"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Registration Fee</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        name="registrationFee"
                        value={formData.registrationFee}
                        onChange={handleChange}
                        className="input pl-10"
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div className="space-y-6">
                  <div>
                    <label className="label">Rules & Guidelines</label>
                    <textarea
                      name="rules"
                      value={formData.rules}
                      onChange={handleChange}
                      className="input"
                      rows={3}
                      placeholder="Enter event rules and guidelines"
                    />
                  </div>
                  <div>
                    <label className="label">Requirements</label>
                    <textarea
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleChange}
                      className="input"
                      rows={3}
                      placeholder="Enter participant requirements"
                    />
                  </div>
                  <div>
                    <label className="label">Event Poster</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                      <input type="file" className="hidden" accept="image/*" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Link to="/events" className="btn-outline">
                  Cancel
                </Link>
                <button type="submit" className="btn-primary">
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateEvent
