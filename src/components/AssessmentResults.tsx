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
  Download
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
            'Weekly': 3, 'Quarterly': 3, 'Occasional learning': 3, 'Yes, moderate support': 3,
            
            // Negative responses
            'Somewhat agree': 2, 'Often': 2, 'No, but close': 2,
            'Struggling with debt': 2, 'Yes, under 5%': 2, 'Working on developing them': 2,
            'Planning to start soon': 2, 'Planning to acquire': 2,
            'Rough ideas': 2, 'Thinking about it': 2, 'Somewhat emotion': 2,
            'Yearly': 2, 'Yes, occasional support': 2,
            
            // Very negative responses
            'Strongly agree': 1, 'Always': 1, 'Very often': 1, 'No, far from it': 1,
            'Overwhelmed by debt': 1, 'No, inconsistent': 1, 'No, single income source': 1,
            'Not investing': 1, 'No assets': 1, 'No plan': 1, 'No steps taken': 1,
            'Pure emotion': 1, 'Mostly emotion': 1, 'No interest': 1
          };
          
          score = scoreMap[answer] || 3; // Default to neutral if not found
        }
        
        totalScore += score;
        questionCount++;
      }
    }
    
    return questionCount > 0 ? Math.round((totalScore / questionCount) * 20) : 0;
  };
  
  // Calculate scores for each section
  const feelingScore = calculateSectionScore(1, 12, true);
  const beliefsScore = calculateSectionScore(13, 24);
  const actionScore = calculateSectionScore(25, 36);
  const realityScore = calculateSectionScore(37, 48);

  // Determine tiers and recommendations based on scores
  const getTier = (score: number, categories: string[]) => {
    if (score >= 80) return categories[3] || categories[2];
    if (score >= 60) return categories[2];
    if (score >= 40) return categories[1];
    return categories[0];
  };

  const feelingTier = getTier(feelingScore, ["Fear-Based", "Neutral", "Empowered", "Abundant"]);
  const beliefsTier = getTier(beliefsScore, ["Scarcity Thinker", "Transitional Believer", "Wealth Coder"]);
  const actionTier = getTier(actionScore, ["Avoider", "Spender", "Aligned Action Taker"]);
  const realityTier = getTier(realityScore, ["Survival", "Stability", "Growth", "Freedom"]);

  const overallScore = Math.round((feelingScore + beliefsScore + actionScore + realityScore) / 4);
  const wealthStage = getTier(overallScore, ["Foundation Building", "Stability Creating", "Growth Focused", "Freedom Oriented"]);

  return {
    feelingScore: {
      score: feelingScore,
      tier: feelingTier,
      patterns: [
        feelingScore < 60 ? "Emotional resistance around money topics" : "Positive emotional relationship with money",
        feelingScore < 40 ? "High anxiety in financial situations" : "Calm approach to financial decisions",
        "Need for emotional reframing around wealth"
      ],
      recommendations: [
        "Practice daily gratitude for current abundance",
        "Use EFT tapping for money anxiety",
        "Visualize positive financial outcomes"
      ],
      affirmations: [
        "I am worthy of financial abundance",
        "Money flows to me easily and effortlessly", 
        "I feel calm and confident with money"
      ]
    },
    beliefsScore: {
      score: beliefsScore,
      tier: beliefsTier,
      patterns: [
        beliefsScore < 60 ? "Limiting beliefs about money and wealth" : "Empowering money beliefs",
        beliefsScore < 40 ? "Inherited negative money programming" : "Healthy money mindset",
        "Opportunity for belief transformation"
      ],
      recommendations: [
        "Daily subconscious reprogramming",
        "Challenge limiting money beliefs",
        "Study wealthy role models"
      ],
      affirmations: [
        "I deserve to be wealthy and abundant",
        "Money is a tool for good in my life",
        "I release all limiting beliefs about money"
      ]
    },
    actionScore: {
      score: actionScore,
      tier: actionTier,
      patterns: [
        actionScore < 60 ? "Inconsistent financial habits" : "Strong financial discipline",
        actionScore < 40 ? "Avoidance of money management" : "Proactive money management",
        "Gap between intentions and actions"
      ],
      recommendations: [
        "Create automated saving systems",
        "Set weekly financial check-ins",
        "Track expenses daily"
      ],
      affirmations: [
        "I take consistent action toward my financial goals",
        "I am disciplined with my money choices",
        "Every day I grow my wealth"
      ]
    },
    realityScore: {
      score: realityScore,
      tier: realityTier,
      patterns: [
        realityScore < 60 ? "Financial stress and instability" : "Growing financial security",
        realityScore < 40 ? "Living paycheck to paycheck" : "Building wealth systematically",
        "Current reality reflects inner state"
      ],
      recommendations: [
        "Build emergency fund first",
        "Increase income through skills",
        "Start investing consistently"
      ],
      affirmations: [
        "My financial reality improves every day",
        "I am building lasting wealth",
        "Money works for me while I sleep"
      ]
    },
    overallProfile: `You are in the ${wealthStage} stage of your money journey. Your overall money relationship score of ${overallScore}/100 shows ${overallScore >= 70 ? 'strong' : overallScore >= 50 ? 'developing' : 'emerging'} alignment across emotions, beliefs, actions, and reality.`,
    topActionSteps: [
      "Start each day with money affirmations",
      "Set up automatic savings of 20% of income", 
      "Read one money mindset book per month",
      "Track all expenses for 30 days",
      "Visualize financial goals daily for 10 minutes"
    ],
    personalizedAffirmation: `I am transforming my relationship with money. I choose abundance over scarcity, action over avoidance, and growth over fear. My ${wealthStage.toLowerCase()} mindset attracts wealth and opportunities. I am worthy of financial freedom and use money as a force for good in the world.`,
    wealthStage
  };
};

export const AssessmentResults: React.FC<AssessmentResultsProps> = ({ data, onRestart }) => {
  const results = calculateScores(data);

  const ScoreCard: React.FC<{
    title: string;
    icon: React.ReactNode;
    scoreData: ScoreBreakdown;
    color: string;
  }> = ({ title, icon, scoreData, color }) => (
    <Card className="gradient-card border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-${color}-100`}>
              {icon}
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
          <Badge variant="secondary" className="text-lg font-bold">
            {scoreData.score}/100
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Current Level</span>
            <span className={`font-semibold text-${color}-600`}>{scoreData.tier}</span>
          </div>
          <Progress value={scoreData.score} className="h-2" />
        </div>
        
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Key Patterns
          </h4>
          <ul className="space-y-1">
            {scoreData.patterns.map((pattern, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <CheckCircle className="h-3 w-3 mt-1 text-accent flex-shrink-0" />
                {pattern}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Star className="h-4 w-4" />
            Recommended Actions
          </h4>
          <ul className="space-y-1">
            {scoreData.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <ArrowRight className="h-3 w-3 mt-1 text-accent flex-shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Daily Affirmations</h4>
          <div className="space-y-2">
            {scoreData.affirmations.map((affirmation, index) => (
              <div key={index} className="p-3 bg-accent/10 rounded-lg text-sm italic">
                "{affirmation}"
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-gradient mb-4">
            Your Money Relationship Results
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {results.overallProfile}
          </p>
        </div>

        {/* Overall Summary */}
        <Card className="mb-8 gradient-card border-0 shadow-xl animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Wealth Stage: {results.wealthStage}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="p-6 bg-accent/10 rounded-lg">
                <h3 className="font-semibold mb-3">Personalized Affirmation</h3>
                <p className="text-lg italic leading-relaxed">
                  "{results.personalizedAffirmation}"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ScoreCard
            title="Money Feeling Frequency"
            icon={<Heart className="h-5 w-5 text-red-500" />}
            scoreData={results.feelingScore}
            color="red"
          />
          <ScoreCard
            title="Money Beliefs Frequency"
            icon={<Brain className="h-5 w-5 text-blue-500" />}
            scoreData={results.beliefsScore}
            color="blue"
          />
          <ScoreCard
            title="Money Action Frequency"
            icon={<Target className="h-5 w-5 text-green-500" />}
            scoreData={results.actionScore}
            color="green"
          />
          <ScoreCard
            title="Financial Reality Score"
            icon={<DollarSign className="h-5 w-5 text-yellow-500" />}
            scoreData={results.realityScore}
            color="yellow"
          />
        </div>

        {/* Action Steps */}
        <Card className="mb-8 gradient-card border-0 shadow-lg animate-slide-up">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              Top 5 Action Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.topActionSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-accent/5 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <span className="text-sm">{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
          <Button
            onClick={onRestart}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            Retake Assessment
          </Button>
          <Button
            className="btn-gradient flex items-center gap-2"
            size="lg"
            onClick={() => window.print()}
          >
            <Download className="h-4 w-4" />
            Save Results
          </Button>
        </div>
      </div>
    </div>
  );
};