// components/AudienceInsight.tsx
import { FC } from 'react';
import { ThumbsUp, ThumbsDown, MinusCircle, TrendingUp, Heart, AlertCircle, CheckCircle, Brain } from 'lucide-react';

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

const AudienceInsight: FC<AudienceInsightProps> = ({ insight }) => {
  const getSentimentColor = () => {
    switch (insight.overallSentiment) {
      case 'positive':
        return 'text-green-400';
      case 'neutral':
        return 'text-yellow-400';
      case 'negative':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getSentimentIcon = () => {
    switch (insight.overallSentiment) {
      case 'positive':
        return <ThumbsUp className="w-6 h-6" />;
      case 'neutral':
        return <MinusCircle className="w-6 h-6" />;
      case 'negative':
        return <ThumbsDown className="w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-6 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Brain className="w-6 h-6 text-purple-400" />
        Audience Insights
      </h3>

      {/* Sentiment Overview */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Overall Sentiment</span>
            <div className={`flex items-center gap-2 ${getSentimentColor()}`}>
              {getSentimentIcon()}
              <span className="font-semibold capitalize">{insight.overallSentiment}</span>
            </div>
          </div>
          
          {/* Sentiment Score Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Sentiment Score</span>
              <span className="text-white font-semibold">{(insight.score * 100).toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-green-500"
                style={{ width: `${insight.score * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400">Audience Rating</span>
            <div className="flex items-center gap-2 text-yellow-400">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">{insight.averageUserRating}/10</span>
            </div>
          </div>

          {/* Sentiment Distribution */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-400">Positive</span>
                <span className="text-white">{insight.positivePercentage}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-400" style={{ width: `${insight.positivePercentage}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-yellow-400">Neutral</span>
                <span className="text-white">{insight.neutralPercentage}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400" style={{ width: `${insight.neutralPercentage}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-red-400">Negative</span>
                <span className="text-white">{insight.negativePercentage}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-red-400" style={{ width: `${insight.negativePercentage}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-8 p-4 bg-purple-900/20 rounded-xl border border-purple-500/20">
        <p className="text-gray-300 italic leading-relaxed">&ldquo;{insight.summary}&rdquo;</p>
      </div>

      {/* Emotional Tone */}
      <div className="mb-8 flex items-start gap-3 p-4 bg-gray-900/30 rounded-xl">
        <Heart className="w-5 h-5 text-pink-400 flex-shrink-0 mt-1" />
        <p className="text-gray-300">
          <span className="font-semibold text-white">Emotional Tone: </span>
          {insight.emotionalTone}
        </p>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="font-semibold text-green-400 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Strengths
          </h4>
          <ul className="space-y-2">
            {insight.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-300">
                <span className="text-green-400 text-lg leading-5">•</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-red-400 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Weaknesses
          </h4>
          <ul className="space-y-2">
            {insight.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-300">
                <span className="text-red-400 text-lg leading-5">•</span>
                {weakness}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AudienceInsight;