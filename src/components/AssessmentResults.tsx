import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Brain, 
  Target, 
  DollarSign, 
  TrendingUp, 
  Star,
  CheckCircle,
  ArrowRight,
  Download,
  RefreshCcw,
  Mail
} from 'lucide-react';

interface AssessmentData {
  [key: string]: string;
}

interface ScoreBreakdown {
  score: number;
  tier: string;
  patterns: string[];
  recommendations: string[];
  affirmations: string[];
}

interface ResultsData {
  feelingScore: ScoreBreakdown;
  beliefsScore: ScoreBreakdown;
  actionScore: ScoreBreakdown;
  realityScore: ScoreBreakdown;
  overallProfile: string;
  topActionSteps: string[];
  personalizedAffirmation: string;
  wealthStage: string;
}

interface AssessmentResultsProps {
  data: AssessmentData;
  onRestart: () => void;
}

const calculateScores = (data: AssessmentData): ResultsData => {
  const calculateSectionScore = (sectionStart: number, sectionEnd: number, isFeelingsSection = false) => {
    let totalScore = 0;
    let questionCount = 0;
    
    for (let i = sectionStart; i <= sectionEnd; i++) {
      const answer = data[i.toString()];
      if (answer && answer.trim() !== '') {
        let score = 3; // Default neutral
        
        // For likert scale questions (stored as "1", "2", "3", "4", "5")
        if (!isNaN(Number(answer))) {
          score = Number(answer);
        }
        // For feelings section - score based on emotional positivity
        else if (isFeelingsSection) {
          const positiveResponses = [
            'Excited and motivated', 'Confident', 'Disappointed but motivated', 
            'Neutral, it happens', 'Comfortable and open', 'Proud to share',
            'Motivated to earn more', 'Patient, I\'ll wait', 'Pure joy and gratitude',
            'Relief', 'Neutral, it\'s just practical', 'Inspired and motivated',
            'Happy for them', 'Calm and in control', 'Never', 'Rarely',
            'Grateful and deserving', 'Excited and appreciative'
          ];
          const negativeResponses = [
            'Fearful or doubtful', 'Overwhelmed', 'Extremely discouraged',
            'Ashamed or guilty', 'Very uncomfortable', 'Defensive',
            'Guilty for wanting it', 'Tempted to buy anyway', 'Suspicion or worry',
            'Anxiety about spending it right', 'Humiliated and ashamed',
            'Resistant to asking', 'Jealous and resentful', 'Bitter or resentful',
            'Insecure about my situation', 'Very stressed', 'Resentful',
            'Often', 'Uncomfortable receiving', 'Worried about obligations'
          ];
          
          if (positiveResponses.includes(answer)) score = 5;
          else if (negativeResponses.includes(answer)) score = 2;
          else score = 3;
        }
        // For other multiple choice questions
        else {
          // Map answers to scores based on financial positivity
          const scoreMap: { [key: string]: number } = {
            // High positive responses
            'Strongly disagree': 5, 'Never': 5, 'Yes, significantly more': 5,
            'Completely debt-free': 5, 'Yes, 20% or more': 5, 'Yes, several active streams': 5,
            'Regular, diversified investing': 5, 'Yes, multiple assets': 5,
            'Detailed written plan': 5, 'Multiple active steps': 5, 'Constantly learning': 5,
            'Pure logic': 5, 'Regular learning': 5,
            
            // Positive responses  
            'Somewhat disagree': 4, 'Rarely': 4, 'Yes, about 2x': 4,
            'Actively paying off debt': 4, 'Yes, 10-19%': 4, 'Yes, 2-3 streams': 4,
            'Occasional investing': 4, 'Yes, one main asset': 4,
            'Basic written plan': 4, 'A few steps': 4, 'Mostly logic': 4,
            'Daily': 4, 'Monthly': 4, 'Regularly': 4, 'Yes, significant support': 4,
            
            // Neutral responses
            'Neutral': 3, 'Sometimes': 3, 'Close to 2x': 3,
            'Managing debt well': 3, 'Yes, 5-9%': 3, 'Yes, 1 additional stream': 3,
            'Just started investing': 3, 'Yes, small investments': 3,
            'Mental plan only': 3, 'One or two steps': 3, 'Balanced emotion/logic': 3,
            'Weekly': 3, 'Quarterly': 3, 'Occasionally': 3, 'Yes, moderate support': 3,
            
            // Negative responses
            'Somewhat agree': 2, 'Often': 2, 'No, but close': 2,
            'Struggling with debt': 2, 'Yes, under 5%': 2, 'Working on developing them': 2,
            'Planning to start soon': 2, 'Planning to acquire': 2,
            'Rough ideas': 2, 'Thinking about it': 2, 'Mostly emotion': 2,
            'Yearly': 2, 'Yes, occasional support': 2,
            
            // Very negative responses
            'Strongly agree': 1, 'Always': 1, 'No, far from it': 1,
            'Overwhelmed by debt': 1, 'No, inconsistent': 1, 'No, single income source': 1,
            'Not investing': 1, 'No assets': 1, 'No plan': 1,
            'No steps taken': 1, 'Pure emotion': 1,
            'I prefer learning alone': 1
          };
          
          score = scoreMap[answer] || 3;
        }
        
        totalScore += score;
        questionCount++;
      }
    }
    
    return questionCount > 0 ? Math.round((totalScore / questionCount) * 20) : 0;
  };

  const getTier = (score: number, categories: string[]) => {
    if (score >= 80) return categories[0];
    if (score >= 60) return categories[1];
    if (score >= 40) return categories[2];
    return categories[3];
  };

  const feelingScore = calculateSectionScore(1, 12, true);
  const beliefsScore = calculateSectionScore(13, 26);
  const actionScore = calculateSectionScore(27, 38);
  const realityScore = calculateSectionScore(39, 50);

  const totalScore = Math.round((feelingScore + beliefsScore + actionScore + realityScore) / 4);

  const feelingTier = getTier(feelingScore, ['Abundance Mindset', 'Growth Mindset', 'Scarcity Mindset', 'Fear-Based Mindset']);
  const beliefsTier = getTier(beliefsScore, ['Empowering Beliefs', 'Positive Beliefs', 'Mixed Beliefs', 'Limiting Beliefs']);
  const actionTier = getTier(actionScore, ['Consistent Action', 'Regular Action', 'Inconsistent Action', 'Avoidant Action']);
  const realityTier = getTier(realityScore, ['Financial Freedom', 'Financial Stability', 'Financial Struggle', 'Financial Crisis']);

  const overallProfile = `You have a ${feelingTier.toLowerCase()} with ${beliefsTier.toLowerCase()}. Your money actions are ${actionTier.toLowerCase()}, and your current financial reality shows ${realityTier.toLowerCase()}.`;

  const wealthStage = totalScore >= 80 ? 'Wealth Builder' : 
                     totalScore >= 60 ? 'Financial Growth' : 
                     totalScore >= 40 ? 'Financial Awareness' : 'Financial Foundation';

  return {
    feelingScore: {
      score: feelingScore,
      tier: feelingTier,
      patterns: [
        'Your emotional responses to money situations',
        'How you handle financial stress and uncertainty',
        'Your relationship with money as an emotional tool'
      ],
      recommendations: [
        'Practice mindfulness around money decisions',
        'Develop positive money affirmations',
        'Work on reducing financial anxiety through education'
      ],
      affirmations: [
        'I am worthy of financial abundance',
        'Money flows to me easily and frequently',
        'I handle financial challenges with grace and wisdom'
      ]
    },
    beliefsScore: {
      score: beliefsScore,
      tier: beliefsTier,
      patterns: [
        'Your core beliefs about money and wealth',
        'How you view rich people and success',
        'Your mindset around financial opportunities'
      ],
      recommendations: [
        'Identify and challenge limiting money beliefs',
        'Surround yourself with positive financial role models',
        'Read books on money mindset and wealth psychology'
      ],
      affirmations: [
        'I believe in my ability to create wealth',
        'Rich people are generous and contribute to society',
        'Financial success is available to everyone who works for it'
      ]
    },
    actionScore: {
      score: actionScore,
      tier: actionTier,
      patterns: [
        'Your consistency with financial planning',
        'How you approach financial tasks and decisions',
        'Your level of financial education and learning'
      ],
      recommendations: [
        'Create and stick to a daily financial routine',
        'Automate your savings and investment processes',
        'Set up regular financial review sessions'
      ],
      affirmations: [
        'I take consistent action toward my financial goals',
        'I am disciplined and committed to financial success',
        'Every financial decision I make moves me closer to abundance'
      ]
    },
    realityScore: {
      score: realityScore,
      tier: realityTier,
      patterns: [
        'Your current financial situation and stability',
        'How you manage debt and savings',
        'Your income streams and asset base'
      ],
      recommendations: [
        'Create a detailed financial plan with specific goals',
        'Focus on building multiple income streams',
        'Prioritize debt reduction and emergency fund building'
      ],
      affirmations: [
        'I am building a solid financial foundation',
        'My financial situation improves every day',
        'I attract opportunities that increase my wealth'
      ]
    },
    overallProfile,
    topActionSteps: [
      'Start tracking your money emotions daily',
      'Identify and replace one limiting money belief',
      'Create a simple financial routine you can stick to',
      'Set up automatic savings from your next paycheck',
      'Learn one new financial concept this week'
    ],
    personalizedAffirmation: `I am transforming my relationship with money. I choose abundance over scarcity, action over avoidance, and growth over fear. My ${wealthStage.toLowerCase()} mindset attracts wealth and opportunities. I am worthy of financial freedom and use money as a force for good in the world.`,
    wealthStage
  };
};

export const AssessmentResults: React.FC<AssessmentResultsProps> = ({ data, onRestart }) => {
  const results = calculateScores(data);

  const dimensionNames: { [key: string]: string } = {
    feelingScore: "Money Feelings",
    beliefsScore: "Money Beliefs", 
    actionScore: "Money Actions",
    realityScore: "Financial Reality"
  };

  const dimensionIcons = {
    feelingScore: <Heart className="h-5 w-5 text-black" />,
    beliefsScore: <Brain className="h-5 w-5 text-black" />,
    actionScore: <Target className="h-5 w-5 text-black" />,
    realityScore: <DollarSign className="h-5 w-5 text-black" />
  };

  const handleDownloadResults = () => {
    // Implementation for downloading results
    console.log('Download results');
  };

  const handleSendToEmail = () => {
    // Implementation for sending to email
    console.log('Send to email');
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center border border-gray-200">
                <span className="text-4xl font-bold text-black">{Math.round((results.feelingScore.score + results.beliefsScore.score + results.actionScore.score + results.realityScore.score) / 4)}</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-black">Your Money Relationship Results</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {results.overallProfile}
          </p>
        </div>

        {/* Overall Summary */}
        <Card className="bg-white border border-gray-200 mb-8">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center border border-gray-200">
                  <span className="text-4xl font-bold text-black">{Math.round((results.feelingScore.score + results.beliefsScore.score + results.actionScore.score + results.realityScore.score) / 4)}</span>
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl text-black">Money Relationship Score</CardTitle>
            <span className="bg-black text-white text-lg px-8 py-3 rounded-md font-medium cursor-default select-none pointer-events-none inline-block mt-2">
              {results.wealthStage}
            </span>
            <p className="text-gray-600 mt-2">{results.personalizedAffirmation}</p>
          </CardHeader>
        </Card>

        {/* Dimension Scores */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Object.entries({
            feelingScore: results.feelingScore,
            beliefsScore: results.beliefsScore,
            actionScore: results.actionScore,
            realityScore: results.realityScore
          }).map(([dimension, scoreData]) => (
            <Card key={dimension} className="bg-white border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-black">{dimensionNames[dimension]}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-black mb-2">{scoreData.score}/100</div>
                <Progress value={scoreData.score} />
                <p className="text-xs text-gray-500 mt-2">{scoreData.tier}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Strengths and Growth Areas */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Key Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.feelingScore.patterns.slice(0, 2).map((pattern, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-black"></div>
                    <span className="text-black">{pattern}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-black flex items-center gap-2">
                <ArrowRight className="w-5 h-5" />
                Growth Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.feelingScore.recommendations.slice(0, 2).map((rec, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <span className="text-black">{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Steps */}
        <Card className="bg-white border border-gray-200 mb-8">
          <CardHeader>
            <CardTitle className="text-black text-xl">Your 90-Day Money Transformation Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {results.topActionSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <span className="text-sm text-black">{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onRestart}
            variant="outline"
            className="px-4 py-2 text-base min-w-[120px] inline-flex items-center rounded"
            style={{ transition: 'background 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = '#d3d3d3'}
            onMouseOut={e => e.currentTarget.style.background = 'white'}
          >
            <RefreshCcw className="w-5 h-5 mr-2" />
            Retake Assessment
          </Button>
          <Button
            variant="outline"
            className="px-4 py-2 text-base min-w-[120px] inline-flex items-center rounded"
            style={{ transition: 'background 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = '#d3d3d3'}
            onMouseOut={e => e.currentTarget.style.background = 'white'}
            onClick={handleDownloadResults}
          >
            <Download className="w-5 h-5 mr-2" />
            Download Results
          </Button>
          <Button
            variant="outline"
            className="px-4 py-2 text-base min-w-[120px] inline-flex items-center rounded"
            style={{ transition: 'background 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = '#d3d3d3'}
            onMouseOut={e => e.currentTarget.style.background = 'white'}
            onClick={handleSendToEmail}
          >
            <Mail className="w-5 h-5 mr-2" />
            Send to Email
          </Button>
        </div>
      </div>
    </div>
  );
};