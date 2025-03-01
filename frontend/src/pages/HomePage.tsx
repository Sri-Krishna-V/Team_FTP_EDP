import React from 'react';
import Header from '../components/Header';
import Carousel from '../components/Carousel';
import SubjectCard from '../components/SubjectCard';

const HomePage: React.FC = () => {
  const carouselImages = [
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1581093458791-9d9a6c5a6e0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  ];

  const carouselCaptions = [
    "Exploring the frontiers of science and technology",
    "Innovative learning for tomorrow's leaders",
    "Building skills for the future"
  ];

  const subjects = [
    {
      title: 'PHYSICS',
      imageUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      bgColor: 'bg-orange-500',
      link: '/physics'
    },
    {
      title: 'CHEMISTRY',
      imageUrl: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      bgColor: 'bg-blue-500',
      link: '/chemistry'
    },
    {
      title: 'BIOLOGY',
      imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      bgColor: 'bg-green-600',
      link: '/biology'
    },
    {
      title: 'MATHS',
      imageUrl: 'https://images.unsplash.com/photo-1635372722656-389f87a941db?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      bgColor: 'bg-red-500',
      link: '/maths'
    },
    {
      title: 'LANGUAGE',
      imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      bgColor: 'bg-orange-500',
      link: '/language'
    },
    {
      title: 'SCIENCE',
      imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      bgColor: 'bg-blue-500',
      link: '/science'
    },
    {
      title: 'SOCIAL SCIENCE',
      imageUrl: 'https://images.unsplash.com/photo-1581089778245-3ce67677f718?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      bgColor: 'bg-green-600',
      link: '/social-science'
    },
    {
      title: 'EDP',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      bgColor: 'bg-red-500',
      link: '/edp'
    },
    {
      title: 'ISL',
      imageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      bgColor: 'bg-purple-500',
      link: '/isl'
    },
    {
      title: 'OHUB',
      imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      bgColor: 'bg-orange-500',
      link: '/ohub'
    },
    {
      title: 'INNOVATION',
      imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      bgColor: 'bg-blue-500',
      link: '/innovation'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Carousel images={carouselImages} captions={carouselCaptions} />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {subjects.map((subject, index) => (
            <SubjectCard
              key={index}
              title={subject.title}
              imageUrl={subject.imageUrl}
              bgColor={subject.bgColor}
              link={subject.link}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;