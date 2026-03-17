import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white pt-24 pb-32">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 blur-3xl opacity-20">
          <div className="h-96 w-96 rounded-full bg-blue-600"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <img src={logo} alt="PetRescue Logo" className="h-24 w-auto animate-float" />
            </div>
            <h1 className="text-6xl font-black text-gray-900 mb-8 tracking-tight leading-tight">
              Giving Every Pet a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Second Chance
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
              Join our community dedicated to reuniting lost pets with their families and finding loving homes for every animal in need.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link 
                to="/adoption" 
                className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 transition-all transform hover:-translate-y-1 active:scale-95"
              >
                Find a Pet to Adopt
              </Link>
              <Link 
                to="/report" 
                className="px-10 py-5 bg-white hover:bg-gray-50 text-blue-600 font-bold border-2 border-blue-600 rounded-2xl transition-all transform hover:-translate-y-1 active:scale-95"
              >
                Report a Lost Pet
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-4">How We Can Help</h2>
            <div className="h-1.5 w-20 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Adoption Card */}
            <div className="group bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all hover:shadow-2xl hover:shadow-blue-100 hover:-translate-y-2">
              <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Pet Adoption</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Browse through our list of lovable pets waiting for their forever homes. Every adoption saves a life and brings joy to a family.
              </p>
              <Link to="/adoption" className="inline-flex items-center text-blue-600 font-bold hover:translate-x-2 transition-transform">
                Browse Pets 
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>

            {/* Rescue Card */}
            <div className="group bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-2">
              <div className="h-16 w-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Rescue Reports</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Found a lost pet? Or looking for your own? Create a report and let our community help in the search and rescue efforts.
              </p>
              <Link to="/rescue" className="inline-flex items-center text-indigo-600 font-bold hover:translate-x-2 transition-transform">
                View Reports
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 rounded-[4rem] mx-4 mb-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-black text-white mb-8">Ready to Make a Difference?</h2>
          <p className="text-gray-400 text-lg mb-12 leading-relaxed">
            Whether you're adopting, reporting, or just spreading the word, every action helps build a safer world for our furry friends.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all">
              Join Our Community
            </Link>
            <Link to="/about" className="bg-white/10 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all backdrop-blur-sm">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
