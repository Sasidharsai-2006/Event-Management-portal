import React from 'react'
import { User, Mail, Phone, GraduationCap, Calendar, Trophy, Settings } from 'lucide-react'

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <button className="btn-outline">
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Info */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">John Doe</h2>
                  <p className="text-gray-500">Student</p>
                  <div className="mt-4">
                    <span className="inline-block bg-primary-100 text-primary-800 text-sm font-semibold px-3 py-1 rounded">
                      Computer Science
                    </span>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">john.doe@campusconnect.edu</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Student ID</p>
                      <p className="font-medium">CS2024001</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Year</p>
                      <p className="font-medium">3rd Year</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats and Activities */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-primary-600 mb-2">12</div>
                    <div className="text-gray-500">Events Participated</div>
                  </div>
                  <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-green-600 mb-2">3</div>
                    <div className="text-gray-500">Clubs Joined</div>
                  </div>
                  <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-yellow-600 mb-2">450</div>
                    <div className="text-gray-500">Points Earned</div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Events</h3>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                          <div>
                            <p className="font-medium">Sample Event {i}</p>
                            <p className="text-sm text-gray-500">February {10 + i}, 2024</p>
                          </div>
                          <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                            Attended
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                          <Trophy className="w-8 h-8 text-yellow-500 mr-4" />
                          <div>
                            <p className="font-medium">Sample Achievement {i}</p>
                            <p className="text-sm text-gray-500">Earned on February {5 + i}, 2024</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
