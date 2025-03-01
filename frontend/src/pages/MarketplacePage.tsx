import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { Search, Filter, ArrowRight, Star, Award, ExternalLink } from 'lucide-react';

interface ProjectType {
  id: number;
  title: string;
  student: string;
  school: string;
  grade: string;
  description: string;
  imageUrl: string;
  investors: string[];
  patentStatus: string;
  category: string;
  tags: string[];
}

const MarketplacePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const projects: ProjectType[] = [
    {
      id: 1,
      title: "EcoFilter: Sustainable Water Purification System",
      student: "Aanya Sharma",
      school: "Delhi Public School, New Delhi",
      grade: "11th Grade",
      description: "A low-cost water purification system using locally sourced materials and solar power, designed for rural communities without access to clean water.",
      imageUrl: "https://images.unsplash.com/photo-1581093458791-9d9a6c5a6e0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      investors: ["GreenTech Ventures", "Water Innovation Fund"],
      patentStatus: "Patent Pending",
      category: "Environmental",
      tags: ["Water Purification", "Sustainable", "Rural Development"]
    },
    {
      id: 2,
      title: "SmartFarm: IoT-Based Agricultural Monitoring",
      student: "Rahul Patel",
      school: "Kendriya Vidyalaya, Ahmedabad",
      grade: "12th Grade",
      description: "An integrated system using IoT sensors to monitor soil moisture, temperature, and nutrient levels, providing real-time data to farmers via a mobile app.",
      imageUrl: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      investors: ["AgriTech Innovations", "Rural Development Fund"],
      patentStatus: "Patented",
      category: "Agriculture",
      tags: ["IoT", "Smart Farming", "Mobile App"]
    },
    {
      id: 3,
      title: "MediTrack: Healthcare Supply Chain Solution",
      student: "Priya Mehta",
      school: "St. Xavier's High School, Mumbai",
      grade: "10th Grade",
      description: "A blockchain-based system to track medical supplies from manufacturer to patient, ensuring authenticity and preventing counterfeit medications.",
      imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      investors: ["HealthTech Capital", "Blockchain Ventures"],
      patentStatus: "Patent Pending",
      category: "Healthcare",
      tags: ["Blockchain", "Supply Chain", "Healthcare"]
    },
    {
      id: 4,
      title: "EduBot: AI-Powered Learning Assistant",
      student: "Arjun Nair",
      school: "National Public School, Bangalore",
      grade: "12th Grade",
      description: "An AI-powered chatbot that provides personalized learning assistance to students, adapting to individual learning styles and pace.",
      imageUrl: "https://stock.adobe.com/search?k=old+computer",
      investors: ["AI Learning Fund", "EdTech Angels"],
      patentStatus: "In Progress",
      category: "Education",
      tags: ["AI", "Chatbot", "Personalized Learning"]
    }
  ];

  return (
    <div>
      <Header />
      <h1>Marketplace</h1>
      {/* Add the rest of your UI here */}
    </div>
  );
};

export default MarketplacePage;
