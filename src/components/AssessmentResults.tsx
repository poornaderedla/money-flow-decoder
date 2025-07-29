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
  // This is a simplified scoring algorithm - in a real app, you'd have more sophisticated analysis
  
  // Calculate feeling score (questions 1-12)
  let feelingTotal = 0;
  let feelingCount = 0;
  for (let i = 1; i <= 12; i++) {
    const answer = data[i];
    if (answer && !isNaN(Number(answer))) {
      feelingTotal += Number(answer);
      feelingCount++;
    }
  }
  const feelingScore = feelingCount > 0 ? Math.round((feelingTotal / feelingCount) * 20) : 0;

  // Calculate beliefs score (questions 13-24) 
  let beliefsTotal = 0;
  let beliefsCount = 0;
  for (let i = 13; i <= 24; i++) {
    const answer = data[i];
    if (answer && !isNaN(Number(answer))) {
      beliefsTotal += Number(answer);
      beliefsCount++;
    }
  }
  const beliefsScore = beliefsCount > 0 ? Math.round((beliefsTotal / beliefsCount) * 20) : 0;

  // Calculate action score (questions 25-36)
  let actionTotal = 0;
  let actionCount = 0;
  for (let i = 25; i <= 36; i++) {
    const answer = data[i];
    if (answer === "Yes" || answer === "Daily" || answer === "Yes, regularly") actionTotal += 5;
    else if (answer === "Maybe" || answer === "Weekly" || answer === "Yes, occasionally") actionTotal += 3;
    else if (answer === "No" || answer === "Never" || answer === "No") actionTotal += 1;
    actionCount++;
  }
  const actionScore = actionCount > 0 ? Math.round((actionTotal / actionCount) * 20) : 0;

  // Calculate reality score (questions 37-48)
  let realityTotal = 0;
  let realityCount = 0;
  for (let i = 37; i <= 48; i++) {
    const answer = data[i];
    if (answer === "Yes" || answer === "Completely debt-free" || answer === "Yes, regularly") realityTotal += 5;
    else if (answer === "Maybe" || answer === "Actively paying off debt") realityTotal += 3;
    else if (answer === "No" || answer === "Overwhelmed by debt") realityTotal += 1;
    realityCount++;
  }
  const realityScore = realityCount > 0 ? Math.round((realityTotal / realityCount) * 20) : 0;

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