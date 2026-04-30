import { Link } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { MapPin, Clock, DollarSign, Building } from 'lucide-react';

const JobCard = ({ job }) => {
  return (
    <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden border-slate-100 bg-white/50 backdrop-blur-sm">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 bg-white shadow-sm border border-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-primary-500 transition-colors">
            <Building className="w-7 h-7" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge value={job.type || 'Full Time'} className="bg-primary-50 text-primary-600 border-none px-3 py-1 text-[10px] font-bold uppercase tracking-wider" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        <Link to={`/jobs/${job.id}`} className="block mb-2">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {job.title}
          </h3>
        </Link>
        
        <p className="text-slate-500 font-semibold mb-6 flex items-center">
          <span className="truncate">{job.company_name || 'Top Company'}</span>
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex items-center text-slate-500 text-sm bg-slate-50/50 p-2 rounded-lg">
            <MapPin className="w-4 h-4 mr-2 text-primary-400" />
            <span className="truncate">{job.location || 'Remote'}</span>
          </div>
          <div className="flex items-center text-slate-500 text-sm bg-slate-50/50 p-2 rounded-lg">
            <DollarSign className="w-4 h-4 mr-2 text-emerald-400" />
            <span className="truncate font-bold text-slate-700">{job.salary ? `$${(job.salary/1000).toFixed(0)}k` : 'Neg.'}</span>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-100/50 flex justify-between items-center">
          <Link to={`/jobs/${job.id}`} className="w-full">
            <Button 
              label="View Details" 
              className="w-full p-button-text p-button-sm font-bold text-primary-600 hover:bg-primary-50 rounded-xl" 
              icon="pi pi-arrow-right"
              iconPos="right"
            />
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default JobCard;
