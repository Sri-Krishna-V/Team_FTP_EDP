import React, { useState } from 'react';
import { ArrowLeft, BarChart2, TrendingUp, Users, Target, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const AnalyzerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('market');
  
  const renderTabContent = () => {
    switch(activeTab) {
      case 'market':
        return (
          <div>
            <h3 className="text-xl font-bold mb-4">Market Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-gray-700 mb-2">Market Size</h4>
                <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                  <BarChart2 className="h-16 w-16 text-blue-500 opacity-50" />
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-gray-700 mb-2">Growth Trends</h4>
                <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                  <TrendingUp className="h-16 w-16 text-green-500 opacity-50" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <h4 className="font-medium text-gray-700 mb-2">Competitor Analysis</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competitor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Share</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strengths</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { name: "Company A", share: "35%", growth: "+12%", strengths: "Brand recognition, distribution" },
                      { name: "Company B", share: "28%", growth: "+8%", strengths: "Product innovation, pricing" },
                      { name: "Company C", share: "15%", growth: "+15%", strengths: "Technology, customer service" },
                      { name: "Company D", share: "12%", growth: "+5%", strengths: "Market reach, partnerships" }
                    ].map((company, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{company.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.share}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.growth}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.strengths}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      
      case 'financial':
        return (
          <div>
            <h3 className="text-xl font-bold mb-4">Financial Projections</h3>
            
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <h4 className="font-medium text-gray-700 mb-2">Revenue Forecast</h4>
              <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                <TrendingUp className="h-16 w-16 text-green-500 opacity-50" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[
                { title: "Break-even Point", value: "Month 18", color: "text-blue-500" },
                { title: "Projected ROI", value: "215%", color: "text-green-500" },
                { title: "Funding Required", value: "$1.2M", color: "text-purple-500" }
              ].map((metric, i) => (
                <div key={i} className="bg-white p-4 rounded-lg shadow text-center">
                  <h4 className="font-medium text-gray-700 mb-2">{metric.title}</h4>
                  <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-medium text-gray-700 mb-2">Cash Flow Analysis</h4>
              <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                <BarChart2 className="h-16 w-16 text-blue-500 opacity-50" />
              </div>
            </div>
          </div>
        );
      
      case 'customer':
        return (
          <div>
            <h3 className="text-xl font-bold mb-4">Customer Segments</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-gray-700 mb-2">Demographic Breakdown</h4>
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                  <Users className="h-16 w-16 text-blue-500 opacity-50" />
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-gray-700 mb-2">Customer Acquisition Cost</h4>
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                  <Target className="h-16 w-16 text-red-500 opacity-50" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-medium text-gray-700 mb-2">Customer Journey Map</h4>
              <div className="overflow-x-auto">
                <div className="flex min-w-max py-4">
                  {[
                    { stage: "Awareness", desc: "Customer discovers the product", color: "bg-blue-100 border-blue-500" },
                    { stage: "Consideration", desc: "Evaluates against alternatives", color: "bg-purple-100 border-purple-500" },
                    { stage: "Decision", desc: "Makes purchase decision", color: "bg-orange-100 border-orange-500" },
                    { stage: "Onboarding", desc: "Initial product experience", color: "bg-green-100 border-green-500" },
                    { stage: "Retention", desc: "Ongoing usage and loyalty", color: "bg-red-100 border-red-500" }
                  ].map((stage, i) => (
                    <div key={i} className="flex-1 px-4">
                      <div className={`h-20 ${stage.color} border-t-4 rounded p-2 text-center`}>
                        <h5 className="font-medium">{stage.stage}</h5>
                        <p className="text-xs text-gray-600">{stage.desc}</p>
                      </div>
                      {i < 4 && (
                        <div className="flex justify-center">
                          <div className="w-8 h-8 border-b-2 border-r-2 border-gray-300 transform rotate-45 translate-x-4 -translate-y-4"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/edp" className="mr-4">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold">Business Analyzer</h1>
            </div>
            
            <button className="bg-white text-purple-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors flex items-center">
              <Download className="h-4 w-4 mr-2" /> Export Report
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Business Analysis Dashboard</h2>
              <p className="text-gray-600">Comprehensive analysis of your business model and market potential</p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <div className="inline-flex rounded-md shadow-sm">
                <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-l-md hover:bg-purple-700">
                  Refresh Data
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-r-md border-t border-b border-r border-gray-300 hover:bg-gray-200">
                  Save Analysis
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              { title: "Market Size", value: "$4.2B", change: "+12%", color: "text-green-500" },
              { title: "Growth Rate", value: "18.5%", change: "+2.3%", color: "text-green-500" },
              { title: "Competitors", value: "12", change: "+3", color: "text-red-500" },
              { title: "Market Share", value: "2.8%", change: "+0.5%", color: "text-green-500" }
            ].map((stat, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className={`text-sm ${stat.color}`}>{stat.change} vs. last year</p>
              </div>
            ))}
          </div>
          
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {[
                { id: 'market', label: 'Market Analysis' },
                { id: 'financial', label: 'Financial Projections' },
                { id: 'customer', label: 'Customer Segments' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div>
            {renderTabContent()}
          </div>
        </div>
        
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-indigo-800 mb-2">AI-Powered Recommendations</h3>
          <p className="text-indigo-700 mb-4">
            Based on your business model and market analysis, our AI suggests the following strategic actions:
          </p>
          <ul className="space-y-2">
            {[
              "Focus on the enterprise segment which shows 24% higher conversion rates",
              "Increase marketing spend in digital channels for 3.5x better ROI",
              "Consider strategic partnerships to accelerate market penetration",
              "Develop subscription-based pricing model for improved customer retention"
            ].map((rec, i) => (
              <li key={i} className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs mr-2 mt-0.5">
                  {i + 1}
                </span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default AnalyzerPage;