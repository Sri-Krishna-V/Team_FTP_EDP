import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { Lightbulb, FileText, Upload, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const InnovationPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setShowForm(false);
      setFormSubmitted(false);
    }, 3000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="ohub" />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex justify-end mb-6">
          <Link to="/track-submissions" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <Clock className="h-4 w-4 mr-2" />
            Track Submissions
          </Link>
        </div>
        
        {!showForm ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-xl max-w-4xl mx-auto">
            <Lightbulb className="h-20 w-20 text-yellow-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Have a Brilliant Idea?</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Share your innovative concept with us. We provide resources, mentorship, and potential funding to help turn your idea into reality.
            </p>
            <button 
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xl font-bold rounded-lg shadow-lg hover:shadow-xl transform transition hover:-translate-y-1"
            >
              <Lightbulb className="h-6 w-6 mr-2" />
              Pitch Your Idea
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Submit Your Idea</h3>
                <p className="text-gray-600">Fill out our comprehensive form with all the details about your innovative concept.</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Expert Review</h3>
                <p className="text-gray-600">Our panel of industry experts and mentors will review your submission.</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Get Support</h3>
                <p className="text-gray-600">Selected ideas receive mentorship, resources, and potential funding opportunities.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-xl max-w-4xl mx-auto p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Submit Your Idea</h2>
            
            {formSubmitted ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="block sm:inline">Your idea has been submitted successfully! We'll review it and get back to you soon.</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="ideaName" className="block text-sm font-medium text-gray-700 mb-1">
                    Idea Name *
                  </label>
                  <input
                    type="text"
                    id="ideaName"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Give your idea a catchy, descriptive name"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    rows={5}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your idea in detail. What problem does it solve? How does it work? What makes it innovative?"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="technology" className="block text-sm font-medium text-gray-700 mb-1">
                      Technology/Materials Used *
                    </label>
                    <input
                      type="text"
                      id="technology"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="List technologies, tools, or materials required"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="mentor" className="block text-sm font-medium text-gray-700 mb-1">
                      Mentor Name (if any)
                    </label>
                    <input
                      type="text"
                      id="mentor"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Name of your teacher, guide, or mentor"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Image/Diagram *
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="patentInfo" className="block text-sm font-medium text-gray-700 mb-1">
                    Patent Information
                  </label>
                  <textarea
                    id="patentInfo"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any existing patents or prior art you're aware of? Any plans for patenting your idea?"
                  ></textarea>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      required
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-medium text-gray-700">
                      I agree to the terms and conditions
                    </label>
                    <p className="text-gray-500">
                      By submitting this form, you agree that your idea may be reviewed by our team and partners.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Submit Idea
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default InnovationPage;