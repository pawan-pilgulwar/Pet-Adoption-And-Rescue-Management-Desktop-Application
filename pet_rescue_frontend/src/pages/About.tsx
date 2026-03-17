import React from 'react';
import logo from '../assets/logo.png';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-blue-50 py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="PetRescue Logo" className="h-16 w-auto" />
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-6">About PetRescue</h1>
          <p className="text-xl text-gray-600 leading-relaxed font-medium">
            Bridging the gap between lost pets and their families, while providing a second chance to animals through adoption.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center mb-32">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                PetRescue was founded with a simple yet powerful goal: to ensure that no pet is left behind. We believe that every animal deserves a loving home and a safe environment.
              </p>
              <p className="text-gray-600 leading-relaxed">
                By leveraging technology and community engagement, we provide an efficient platform for reporting lost pets and facilitating easy adoptions.
              </p>
            </div>
            <div className="bg-blue-600 rounded-[3rem] p-12 text-white shadow-2xl shadow-blue-200">
              <h3 className="text-2xl font-bold mb-4">The Impact</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-4xl font-black mb-1">500+</p>
                  <p className="text-blue-100 font-medium">Pets Reunited</p>
                </div>
                <div>
                  <p className="text-4xl font-black mb-1">200+</p>
                  <p className="text-blue-100 font-medium">Successful Adoptions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-24">
            <div className="bg-gray-50 rounded-[3rem] p-12 lg:p-16 border border-gray-100">
              <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                  <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black mb-6">1</div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Pet Adoption</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our admin team carefully registers pets available for adoption. Users can browse these listings, learn about the pets, and contact us to start the adoption process.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                  <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black mb-6">2</div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Lost & Found</h3>
                  <p className="text-gray-600 leading-relaxed">
                    If you've lost or found a pet, you can create a detailed report. These reports are reviewed by our admins and, once verified, shared with the entire community.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center pb-20">
              <h2 className="text-3xl font-black text-gray-900 mb-6">Why Choose PetRescue?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="p-6">
                  <div className="text-blue-600 text-3xl mb-4">🛡️</div>
                  <h4 className="font-bold mb-2">Verified Listings</h4>
                  <p className="text-sm text-gray-500">Every report is reviewed by an admin.</p>
                </div>
                <div className="p-6">
                  <div className="text-blue-600 text-3xl mb-4">🤝</div>
                  <h4 className="font-bold mb-2">Community Support</h4>
                  <p className="text-sm text-gray-500">Helpful neighbors looking out for pets.</p>
                </div>
                <div className="p-6">
                  <div className="text-blue-600 text-3xl mb-4">⚡</div>
                  <h4 className="font-bold mb-2">Fast Response</h4>
                  <p className="text-sm text-gray-500">Alerts sent out immediately after approval.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
