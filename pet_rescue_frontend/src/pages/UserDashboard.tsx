import React, { useState, useEffect } from 'react';
import { reportService, authService, BASE_URL } from '../services/api';
import DashboardTable from '../components/DashboardTable';

const UserDashboard: React.FC = () => {
    const [pets, setPets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const user = authService.getCurrentUser();

    useEffect(() => {
        fetchUserReports();
    }, []);

    const fetchUserReports = async () => {
        try {
            const response = await reportService.getUserReports();
            
            // Map the reports to format suitable for DashboardTable
            const formattedReports = response.data?.Reports?.map((report: any) => ({
                id: report.id,
                image: report.pet_detail?.image,
                name: report.pet_detail?.name || 'Unknown',
                pet_type: report.pet_detail?.pet_type || 'Unknown',
                breed: report.pet_detail?.breed || 'Unknown',
                status: report.status, // Show report status instead of pet status
                location: report.location
            })) || [];

            setPets(formattedReports);
        } catch (error) {
            console.error('Error fetching user reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this pet report?')) {
            try {
                await reportService.delete(id);
                fetchUserReports();
            } catch (error) {
                alert('Failed to delete report');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">User Dashboard</h1>
                        <p className="text-gray-600 mt-2">Manage your reported pets and their status.</p>
                    </div>
                    <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100">
                        Welcome, {user?.username}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <DashboardTable
                        headers={['ID', 'Image', 'Name', 'Type', 'Breed', 'Status', 'Location', 'Actions']}
                        data={pets}
                        renderRow={(pet) => (
                            <tr key={pet.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{pet.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {pet.image && (
                                        <img 
                                            src={pet.image.startsWith('http') ? pet.image : `${BASE_URL}${pet.image}`} 
                                            alt="" 
                                            className="h-10 w-10 object-cover rounded-lg border border-gray-100" 
                                        />
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{pet.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pet.pet_type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pet.breed}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${pet.status === 'Lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {pet.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pet.location}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleDelete(pet.id)}
                                        className="text-red-600 hover:text-red-900 font-bold"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )}
                    />
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
