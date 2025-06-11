import React, { useState } from 'react';

const pricingPlans = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started with your fitness journey',
    features: [
      'Basic workout tracking',
      'Nutrition logging',
      'Progress charts',
      'Community access',
      'Mobile app access',
    ],
    limitations: [
      'Limited AI recommendations',
      'Basic analytics only',
      'Standard support',
    ],
    popular: false,
    buttonText: 'Get Started Free',
    buttonStyle: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50',
  },
  {
    name: 'Pro',
    price: 9.99,
    period: 'month',
    description: 'Advanced features for serious fitness enthusiasts',
    features: [
      'Everything in Free',
      'AI-powered workout plans',
      'Personalized nutrition recommendations',
      'Advanced progress analytics',
      'Priority support',
      'Unlimited goal tracking',
      'Custom meal plans',
      'Workout video library',
    ],
    limitations: [],
    popular: true,
    buttonText: 'Start Pro Trial',
    buttonStyle: 'bg-indigo-600 text-white hover:bg-indigo-700',
  },
  {
    name: 'Premium',
    price: 19.99,
    period: 'month',
    description: 'Complete fitness solution with personal coaching',
    features: [
      'Everything in Pro',
      'Personal AI coach',
      'Live workout sessions',
      'One-on-one consultations',
      'Custom supplement recommendations',
      'Advanced body composition analysis',
      'Injury prevention insights',
      'VIP community access',
      '24/7 priority support',
    ],
    limitations: [],
    popular: false,
    buttonText: 'Go Premium',
    buttonStyle: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50',
  },
];

export const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const getPrice = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return { price: 0, period: 'forever' };
    
    if (isAnnual) {
      const annualPrice = monthlyPrice * 12 * 0.8; // 20% discount
      return { price: annualPrice, period: 'year' };
    }
    
    return { price: monthlyPrice, period: 'month' };
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Start free and upgrade as you grow. All plans include access to our mobile and web apps.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                !isAnnual
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isAnnual
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <span className="ml-1 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                Save 20%
              </span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => {
            const pricing = getPrice(plan.price);
            
            return (
              <div
                key={index}
                className={`relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${
                  plan.popular ? 'ring-2 ring-indigo-600' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {plan.description}
                  </p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      ${pricing.price === 0 ? '0' : pricing.price.toFixed(0)}
                    </span>
                    {pricing.price > 0 && (
                      <span className="text-gray-600 ml-1">
                        /{pricing.period}
                      </span>
                    )}
                  </div>
                  
                  <button className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${plan.buttonStyle}`}>
                    {plan.buttonText}
                  </button>
                </div>
                
                <div className="px-6 pb-6">
                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      What's included:
                    </h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm">
                          <svg
                            className="w-4 h-4 text-green-500 mr-2 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {plan.limitations.length > 0 && (
                      <div className="mt-4">
                        <h5 className="font-medium text-gray-600 mb-2 text-sm">
                          Limitations:
                        </h5>
                        <ul className="space-y-1">
                          {plan.limitations.map((limitation, limitIndex) => (
                            <li key={limitIndex} className="flex items-center text-sm">
                              <svg
                                className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="text-gray-500">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            All plans come with a 14-day free trial. No credit card required.
          </p>
          <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure payments
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Cancel anytime
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              24/7 support
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
