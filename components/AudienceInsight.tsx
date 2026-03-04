// components/AudienceInsight.tsx
import { 
  TrendingUp, 
  ThumbsUp, 
  ThumbsDown, 
  Minus, 
  Star, 
  Zap,
  BarChart3,
  PieChart
} from 'lucide-react';

interface AudienceInsightProps {
  insight: {
    overallSentiment: string;
    score: number;
    positivePercentage: number;
    neutralPercentage: number;
    negativePercentage: number;
    averageUserRating: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    emotionalTone: string;
  };
}

export default function AudienceInsight({ insight }: AudienceInsightProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'negative':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <TrendingUp className="text-purple-400" />
        Audience Insights
      </h2>

      {/* Sentiment Overview */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Overall Sentiment</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSentimentColor(insight.overallSentiment)}`}>
              {insight.overallSentiment}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Emotional Tone</span>
            <span className="text-white font-medium">{insight.emotionalTone}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Audience Score</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: `${insight.score}%` }}
                ></div>
              </div>
              <span className="text-white font-medium">{insight.score}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Average Rating</span>
            <div className="flex items-center gap-1">
              <Star className="text-yellow-400 fill-yellow-400" size={18} />
              <span className="text-white font-medium">{insight.averageUserRating.toFixed(1)}/10</span>
            </div>
          </div>
        </div>

        {/* Sentiment Distribution */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
            <PieChart size={16} />
            Sentiment Distribution
          </h3>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ThumbsUp size={16} className="text-green-400" />
              <span className="text-sm text-gray-300">Positive</span>
              <span className="ml-auto text-white font-medium">{insight.positivePercentage}%</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: `${insight.positivePercentage}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Minus size={16} className="text-yellow-400" />
              <span className="text-sm text-gray-300">Neutral</span>
              <span className="ml-auto text-white font-medium">{insight.neutralPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500" style={{ width: `${insight.neutralPercentage}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <ThumbsDown size={16} className="text-red-400" />
              <span className="text-sm text-gray-300">Negative</span>
              <span className="ml-auto text-white font-medium">{insight.negativePercentage}%</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-red-500" style={{ width: `${insight.negativePercentage}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-8 p-4 bg-gray-900/50 rounded-lg">
        <p className="text-gray-300 leading-relaxed">{insight.summary}</p>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <ThumbsUp size={18} className="text-green-400" />
            Strengths
          </h3>
          <ul className="space-y-2">
            {insight.strengths.map((strength, index) => (
              <li key={`strength-${index}`} className="flex items-start gap-2 text-gray-300">
                <span className="text-green-400 mt-1">•</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <ThumbsDown size={18} className="text-red-400" />
            Weaknesses
          </h3>
          <ul className="space-y-2">
            {insight.weaknesses.map((weakness, index) => (
              <li key={`weakness-${index}`} className="flex items-start gap-2 text-gray-300">
                <span className="text-red-400 mt-1">•</span>
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}