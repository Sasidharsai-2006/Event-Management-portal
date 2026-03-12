import React from 'react'
import { Calendar, MapPin, Users, Clock, User, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const EventDetails = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/events" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Link>

        <div className="card">
          <div className="aspect-w-16 aspect-h-9">
            <div className="w-full h-64 bg-gray-200 rounded-t-lg flex items-center justify-center">
              <Calendar className="w-16 h-16 text-gray-400" />
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-block bg-primary-100 text-primary-800 text-sm font-semibold px-3 py-1 rounded">
                Technical Event
              </span>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                10:00 AM - 4:00 PM
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Sample Event Details
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">February 15, 2024</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Venue</p>
                    <p className="font-medium">Main Auditorium</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Participants</p>
                    <p className="font-medium">150 / 200 registered</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Organizer</p>
                    <p className="font-medium">Computer Science Club</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                This is a detailed description of the event. It explains what the event is about, 
                what participants can expect, and any important information they need to know. 
                The description can be quite long and provide comprehensive details about the event.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Rules & Guidelines</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Participants must arrive 15 minutes before the event starts</li>
                <li>Bring your student ID for verification</li>
                <li>Laptops and notebooks are required</li>
                <li>No food or drinks allowed in the auditorium</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-primary flex-1">
                Register for Event
              </button>
              <button className="btn-outline flex-1">
                Share Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetails
