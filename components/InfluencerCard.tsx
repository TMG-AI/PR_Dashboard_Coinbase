import React from 'react';
import { Influencer } from '../types';

interface InfluencerCardProps {
  influencer: Influencer;
  loading?: boolean;
}

function formatFollowers(num: number) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toString();
}

export const InfluencerCard: React.FC<InfluencerCardProps> = ({ influencer, loading }) => {
  if (loading) {
    return <div className="w-full h-20 bg-[#10182b] rounded-xl animate-pulse" style={{ fontFamily: 'Inter, sans-serif' }} />;
  }
  return (
    <div className="flex items-center p-4 bg-[#10182b] rounded-xl shadow-lg hover:shadow-2xl transition-shadow mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
      <img src={influencer.avatar} alt={influencer.name} className="w-12 h-12 rounded-full mr-4 border-2 border-[#0052FF] object-cover" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-white">{influencer.name}</span>
          <span className="text-xs text-gray-400 ml-2">{formatFollowers(influencer.followers)} followers</span>
        </div>
        <div className="text-sm text-gray-300 mt-1 truncate">{influencer.latestMention}</div>
      </div>
    </div>
  );
};
