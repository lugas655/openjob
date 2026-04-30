import { Link } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { MapPin, Clock, DollarSign, Building } from 'lucide-react';

const JobCard = ({ job }) => {
  return (
    <Card className="h-full border border-slate-100/60 bg-white/40 backdrop-blur-md hover:bg-white transition-all duration-500 group relative rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/5 to-transparent rounded-bl-full -z-10 transition-opacity opacity-0 group-hover:opacity-100"></div>
      
      <div className="flex flex-col h-full relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div className="w-16 h-16 bg-white shadow-xl shadow-slate-200/50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-primary-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Building className="w-8 h-8" />
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest border border-primary-100/50">
              {job.type || 'Full Time'}
            </div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-slate-400 transition-colors">
               {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        <Link to={`/jobs/${job.id}`} className="block mb-3">
          <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary-600 transition-colors leading-tight tracking-tight line-clamp-2">
            {job.title}
          </h3>
        </Link>
        
        <p className="text-slate-400 font-bold text-sm mb-8 flex items-center">
          <span className="truncate group-hover:text-slate-600 transition-colors uppercase tracking-widest text-[11px]">{job.company_name || 'Innovate Corp'}</span>
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-center text-slate-500 text-sm font-semibold">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-primary-50 transition-colors">
              <MapPin className="w-4 h-4 text-primary-500" />
            </div>
            <span className="truncate">{job.location || 'Remote'}</span>
          </div>
          <div className="flex items-center text-slate-500 text-sm font-semibold">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-accent-50 transition-colors">
              <DollarSign className="w-4 h-4 text-accent-500" />
            </div>
            <span className="truncate">
              {job.salary ? (
                <span className="text-slate-900 font-black">${(job.salary/1000).toFixed(0)}k</span>
              ) : (
                <span className="italic text-slate-400">Competitive</span>
              )}
              <span className="text-slate-400 font-normal ml-1">/ year</span>
            </span>
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-slate-100/60">
          <Link to={`/jobs/${job.id}`} className="block">
            <Button 
              label="Explore Details" 
              className="w-full bg-slate-900 hover:bg-primary-600 text-white border-none rounded-2xl py-4 font-black transition-all group-hover:shadow-lg group-hover:shadow-primary-500/30" 
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
