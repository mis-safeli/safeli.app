// components/StatsCard.jsx
import React from 'react';
import { TrendingUp } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, color, change, compact = false }) => {
  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded-lg bg-gradient-to-r ${color}`}>
              <Icon className="w-3 h-3 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">{title}</p>
              <p className="text-lg font-bold text-gray-900">{value}</p>
            </div>
          </div>
          <div className={`flex items-center space-x-1 text-xs ${
            change.startsWith('+') ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="w-3 h-3" />
            <span>{change}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <div className={`flex items-center space-x-1 mt-2 text-sm ${
            change.startsWith('+') ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="w-4 h-4" />
            <span>{change} from last week</span>
          </div>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;