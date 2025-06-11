import React from 'react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    title: 'Marketing Manager',
    image: '/images/testimonial-1.jpg',
    quote: 'AI Fitness Coach transformed my fitness routine completely. The personalized workouts and nutrition tracking helped me lose 25 pounds in 4 months!',
    rating: 5,
  },
  {
    name: 'Mike Chen',
    title: 'Software Engineer',
    image: '/images/testimonial-2.jpg',
    quote: 'As a busy developer, I love how the app adapts to my schedule. The AI recommendations are spot-on and the progress tracking keeps me motivated.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    title: 'Fitness Enthusiast',
    image: '/images/testimonial-3.jpg',
    quote: 'The variety of workouts and the intelligent progression system is amazing. I\'ve never been more consistent with my fitness routine.',
    rating: 5,
  },
  {
    name: 'David Thompson',
    title: 'Personal Trainer',
    image: '/images/testimonial-4.jpg',
    quote: 'Even as a trainer, I use this app for my own workouts. The AI insights and analytics provide valuable data I wouldn\'t get elsewhere.',
    rating: 5,
  },
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${
            i < rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export const Testimonials: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied users who have transformed their fitness journey with AI Fitness Coach
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {testimonial.title}
                  </p>
                </div>
              </div>
              
              <StarRating rating={testimonial.rating} />
              
              <blockquote className="mt-4 text-gray-700 italic">
                "{testimonial.quote}"
              </blockquote>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-4 bg-indigo-50 rounded-lg px-6 py-3">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-indigo-600 rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-semibold"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="text-sm">
              <span className="font-semibold text-gray-900">2,500+ happy users</span>
              <br />
              <span className="text-gray-600">and growing every day</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
