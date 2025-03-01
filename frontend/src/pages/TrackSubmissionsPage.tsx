import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { Clock, CheckCircle, AlertCircle, XCircle, ArrowLeft } from 'lucide-react';

interface Submission {
  id: string;
  title: string;
  submittedDate: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  feedback?: string;
}

const TrackSubmissionsPage: React.FC = () => {
  const submissions: Submission[] = [
    {
      id: "SUB-2025-001",
      title: "Smart Water Conservation System",
      submittedDate: "2025-01-15",
      status: "approved",
      feedback: "Excellent idea with strong potential for social impact. We'd like to connect you with our water technology partners."
    },
    {
      id: "SUB-2025-002",
      title: "AI-Powered Crop Disease Detection",
      submittedDate: "2025-01-28",
      status: "reviewing"
    },
    {
      id: "SUB-2025-003",
      title: "Biodegradable Food Packaging",
      submittedDate: "2025-02-05",
      status: "pending"
    },
    {
      id: "SUB-2025-004",
      title: "Solar-Powered Backpack",
      submittedDate: "2025-01-10",
      status: "rejected",
      feedback: "While innovative, similar products already exist in the market. Consider differentiating your idea further."
    }
  ];
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'reviewing':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending':
        return 'Pending Review';
      case 'reviewing':
        return 'Under Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Not Selected';
      default:
        return '';
    }
  };
  
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="ohub" />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link to="/innovation" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Innovation
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Track Your Submissions</h1>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submission ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Idea Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {submission.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {submission.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(submission.submittedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(submission.status)}`}>
                        {getStatusIcon(submission.status)}
                        <span className="ml-1.5">{getStatusText(submission.status)}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Feedback and Updates</h2>
          
          <div className="space-y-6">
            {submissions.filter(sub => sub.feedback).map((submission) => (
              <div key={`feedback-${submission.id}`} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-center mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(submission.status)} mr-2`}>
                    {getStatusIcon(submission.status)}
                    <span className="ml-1.5">{getStatusText(submission.status)}</span>
                  </span>
                  <h3 className="text-lg font-medium text-gray-900">{submission.title}</h3>
                </div>
                <p className="text-gray-700">{submission.feedback}</p>
                <p className="text-sm text-gray-500 mt-2">Feedback provided on {new Date(submission.submittedDate).toLocaleDateString()}</p>
              </div>
            ))}
            
            {submissions.filter(sub => sub.feedback).length === 0 && (
              <p className="text-gray-500 italic">No feedback available yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrackSubmissionsPage;