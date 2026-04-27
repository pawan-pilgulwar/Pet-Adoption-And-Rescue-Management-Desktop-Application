import { Report } from '../../../types';
import { useNavigate } from 'react-router-dom';

interface ReportCardProps {
  report: Report;
}

// Card showing a single rescue report
function ReportCard({ report }: ReportCardProps) {
  const navigate = useNavigate();
  const pet = report.pet_detail;

  const statusColors: Record<string, string> = {
    Pending:  'badge-yellow',
    Accepted: 'badge-green',
    Rejected: 'badge-red',
    Closed:   'badge-blue',
  };

  return (
    <div 
      className="card fade-in hover:shadow-xl transition-shadow cursor-pointer"
      onClick={() => navigate(`/rescue/${report.id}`)}
    >
      <div className="flex gap-4">
        {/* Pet Image */}
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-orange-50 flex-shrink-0">
          {pet?.image_url ? (
            <img src={pet.image_url} alt={pet.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">🐾</div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`badge ${report.report_type === 'Lost' ? 'badge-red' : 'badge-green'}`}>
              {report.report_type === 'Lost' ? '🔴 Lost' : '🟢 Found'}
            </span>
            <span className={`badge ${statusColors[report.status] || 'badge-yellow'}`}>
              {report.status}
            </span>
            <span className="text-xs text-stone-400 font-mono">{report.rescue_id}</span>
          </div>

          <h3 className="font-bold text-stone-900 text-base truncate">
            {pet?.name || 'Unknown Pet'}
          </h3>
          <p className="text-stone-500 text-sm">
            {pet?.species}{pet?.breed ? ` · ${pet.breed}` : ''}{pet?.color ? ` · ${pet.color}` : ''}
          </p>

          {/* Location */}
          <p className="text-stone-500 text-xs mt-1 flex items-center gap-1">
            📍 {report.location}
          </p>

          {/* Description */}
          {report.description && (
            <p className="text-stone-400 text-xs mt-1 line-clamp-2">{report.description}</p>
          )}

          {/* Contact */}
          {report.user_contact && (
            <div className="flex gap-4 mt-2 text-xs text-stone-400">
              <span>✉️ {report.user_contact.email}</span>
              {report.user_contact.phone !== '—' && (
                <span>📞 {report.user_contact.phone}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportCard;
