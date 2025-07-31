import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  type: 'likert' | 'multiple' | 'yesno';
  options?: string[];
}

interface AssessmentData {
  [key: string]: string;
}

interface MoneyAssessmentProps {
  onComplete: (data: AssessmentData) => void;
}

const questions: Question[] = [
  // Section 1: Money Feeling Frequency (12 questions)
  { id: 1, text: "How do you feel when you set high financial goals?", type: "multiple", options: ["Excited and motivated", "Anxious but hopeful", "Overwhelmed", "Confident", "Fearful or doubtful"] },
  { id: 2, text: "What's your emotional reaction when you don't meet financial targets?", type: "multiple", options: ["Disappointed but motivated", "Frustrated and angry", "Ashamed or guilty", "Neutral, it happens", "Extremely discouraged"] },
  { id: 3, text: "When someone asks about your income or savings, how do you feel?", type: "multiple", options: ["Comfortable and open", "Slightly uncomfortable", "Very uncomfortable", "Proud to share", "Defensive"] },
  { id: 4, text: "How do you feel when you want to purchase something beyond your budget?", type: "multiple", options: ["Frustrated and restricted", "Motivated to earn more", "Guilty for wanting it", "Patient, I'll wait", "Tempted to buy anyway"] },
  { id: 5, text: "What emotions come up when you receive unexpected money?", type: "multiple", options: ["Pure joy and gratitude", "Excitement mixed with guilt", "Anxiety about spending it right", "Relief", "Suspicion or worry"] },
  { id: 6, text: "How do you feel when you must ask for financial help?", type: "multiple", options: ["Humiliated and ashamed", "Uncomfortable but grateful", "Neutral, it's just practical", "Anxious but hopeful", "Resistant to asking"] },
  { id: 7, text: "How do you emotionally respond to your peers earning more?", type: "multiple", options: ["Inspired and motivated", "Slightly envious but supportive", "Jealous and resentful", "Indifferent", "Curious about their methods"] },
  { id: 8, text: "What do you feel when you see others living a wealthier lifestyle?", type: "multiple", options: ["Inspired to achieve more", "Envious but motivated", "Bitter or resentful", "Happy for them", "Insecure about my situation"] },
  { id: 9, text: "What's your emotional state when paying bills or making large purchases?", type: "multiple", options: ["Calm and in control", "Slightly anxious", "Very stressed", "Excited about the purchase", "Resentful"] },
  { id: 10, text: "Do you experience guilt or shame while spending on yourself?", type: "multiple", options: ["Often", "Sometimes", "Rarely", "Never", "Only for expensive items"] },
  { id: 11, text: "How do you feel about receiving money as a gift or bonus?", type: "multiple", options: ["Grateful and deserving", "Grateful but guilty", "Uncomfortable receiving", "Excited and appreciative", "Worried about obligations"] },
  { id: 12, text: "How do you feel about wealthy people in general?", type: "multiple", options: ["Admiration and respect", "Slightly envious but positive", "Neutral feelings", "Suspicious or resentful", "Strong negative feelings"] },

  // Section 2: Money Thoughts & Beliefs Frequency (14 questions)
  { id: 13, text: "Wealth is only for a few lucky or talented people", type: "likert" },
  { id: 14, text: "Money equals security and peace of mind", type: "likert" },
  { id: 15, text: "I feel conflicted about wanting to be rich", type: "multiple", options: ["Strongly agree", "Somewhat agree", "Neutral", "Somewhat disagree", "Strongly disagree"] },
  { id: 16, text: "There's never enough money, no matter how much I have", type: "likert" },
  { id: 17, text: "Wealth corrupts character or spirituality", type: "likert" },
  { id: 18, text: "Setting big money goals is arrogant or selfish", type: "multiple", options: ["Strongly agree", "Somewhat agree", "Neutral", "Somewhat disagree", "Strongly disagree"] },
  { id: 19, text: "You have to work extremely hard to be wealthy", type: "likert" },
  { id: 20, text: "I'm naturally bad with managing money", type: "multiple", options: ["Strongly agree", "Somewhat agree", "Neutral", "Somewhat disagree", "Strongly disagree"] },
  { id: 21, text: "I believe that rich people are generally greedy", type: "multiple", options: ["Strongly agree", "Somewhat agree", "Neutral", "Somewhat disagree", "Strongly disagree"] },
  { id: 22, text: "Financial freedom is attainable for someone like me", type: "likert" },
  { id: 23, text: "I believe I deserve to be wealthy", type: "likert" },
  { id: 24, text: "Money causes more problems than it solves", type: "multiple", options: ["Strongly agree", "Somewhat agree", "Neutral", "Somewhat disagree", "Strongly disagree"] },
  { id: 25, text: "I worry that having too much money will change me negatively", type: "multiple", options: ["Very worried", "Somewhat worried", "Neutral", "Not worried", "Excited about the change"] },
  { id: 26, text: "Only people with special connections can build real wealth", type: "likert" },

  // Section 3: Money Action Frequency (12 questions)
  { id: 27, text: "How often do you actively track your income and expenses?", type: "multiple", options: ["Daily", "Weekly", "Monthly", "Rarely", "Never"] },
  { id: 28, text: "I am consistent with my budgeting habits", type: "likert" },
  { id: 29, text: "I procrastinate when it comes to financial tasks", type: "multiple", options: ["Always", "Often", "Sometimes", "Rarely", "Never"] },
  { id: 30, text: "I avoid checking my bank account or credit score", type: "multiple", options: ["Always", "Often", "Sometimes", "Rarely", "Never"] },
  { id: 31, text: "Are you currently investing or saving with a plan?", type: "multiple", options: ["Yes, with a detailed plan", "Yes, but informally", "Thinking about it", "No, but want to", "No interest"] },
  { id: 32, text: "I actively seek financial advice or mentorship", type: "multiple", options: ["Regularly", "Occasionally", "Rarely", "Never", "I prefer learning alone"] },
  { id: 33, text: "How often do you set and review financial goals?", type: "multiple", options: ["Monthly", "Quarterly", "Yearly", "Rarely", "Never"] },
  { id: 34, text: "My money decisions are driven more by:", type: "multiple", options: ["Pure emotion", "Mostly emotion", "Balanced emotion/logic", "Mostly logic", "Pure logic"] },
  { id: 35, text: "I make impulse purchases frequently", type: "multiple", options: ["Very often", "Often", "Sometimes", "Rarely", "Never"] },
  { id: 36, text: "I have taken concrete steps to increase my income recently", type: "multiple", options: ["Multiple active steps", "A few steps", "One or two steps", "Thinking about it", "No steps taken"] },
  { id: 37, text: "I consistently follow through on my money plans", type: "likert" },
  { id: 38, text: "I focus more on spending than building assets", type: "multiple", options: ["Strongly agree", "Somewhat agree", "Neutral", "Somewhat disagree", "Strongly disagree"] },

  // Section 4: Current Situation Frequency (12 questions)
  { id: 39, text: "My monthly income is at least 2x my expenses", type: "multiple", options: ["Yes, significantly more", "Yes, about 2x", "Close to 2x", "No, but close", "No, far from it"] },
  { id: 40, text: "My current debt situation:", type: "multiple", options: ["Completely debt-free", "Actively paying off debt", "Managing debt well", "Struggling with debt", "Overwhelmed by debt"] },
  { id: 41, text: "I save a consistent percentage of my income", type: "multiple", options: ["Yes, 20% or more", "Yes, 10-19%", "Yes, 5-9%", "Yes, under 5%", "No, inconsistent"] },
  { id: 42, text: "I have multiple streams of income", type: "multiple", options: ["Yes, several active streams", "Yes, 2-3 streams", "Yes, 1 additional stream", "Working on developing them", "No, single income source"] },
  { id: 43, text: "My current investing activity:", type: "multiple", options: ["Regular, diversified investing", "Occasional investing", "Just started investing", "Planning to start soon", "Not investing"] },
  { id: 44, text: "I own income-generating assets", type: "multiple", options: ["Yes, multiple assets", "Yes, one main asset", "Yes, small investments", "Planning to acquire", "No assets"] },
  { id: 45, text: "I have a written financial plan or roadmap", type: "multiple", options: ["Detailed written plan", "Basic written plan", "Mental plan only", "Rough ideas", "No plan"] },
  { id: 46, text: "I feel financially prepared for emergencies", type: "likert" },
  { id: 47, text: "I regularly provide financial support to others", type: "multiple", options: ["Yes, significant support", "Yes, moderate support", "Yes, occasional support", "Rarely", "Never"] },
  { id: 48, text: "I actively work on improving my money knowledge", type: "multiple", options: ["Constantly learning", "Regular learning", "Occasional learning", "Rarely", "Never"] },
  { id: 49, text: "I feel in complete control of my financial decisions", type: "likert" },
  { id: 50, text: "My current lifestyle aligns with my values and goals", type: "likert" }
];

const sectionTitles = [
  "Money Feeling Frequency",
  "Money Thoughts & Beliefs",
  "Money Action Frequency", 
  "Current Financial Reality"
];

const likertOptions = [
  "Strongly Disagree",
  "Disagree", 
  "Neutral",
  "Agree",
  "Strongly Agree"
];

const yesNoOptions = ["Yes", "Maybe", "No"];

export const MoneyAssessment: React.FC<MoneyAssessmentProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<AssessmentData>({});
  const [currentSection, setCurrentSection] = useState(0);

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  const updateCurrentSection = (questionIndex: number) => {
    if (questionIndex < 12) setCurrentSection(0);
    else if (questionIndex < 26) setCurrentSection(1);
    else if (questionIndex < 38) setCurrentSection(2);
    else setCurrentSection(3);
  };

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [question.id]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      const nextIndex = currentQuestion + 1;
      setCurrentQuestion(nextIndex);
      updateCurrentSection(nextIndex);
    } else {
      onComplete(answers);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      const prevIndex = currentQuestion - 1;
      setCurrentQuestion(prevIndex);
      updateCurrentSection(prevIndex);
    }
  };

  const renderQuestionInput = () => {
    const currentAnswer = answers[question.id] || '';

    switch (question.type) {
      case 'likert':
        return (
          <RadioGroup value={currentAnswer} onValueChange={handleAnswer} className="space-y-3">
            {likertOptions.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={String(index + 1)} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'multiple':
        return (
          <RadioGroup value={currentAnswer} onValueChange={handleAnswer} className="space-y-3">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'yesno':
        return (
          <RadioGroup value={currentAnswer} onValueChange={handleAnswer} className="space-y-3">
            {yesNoOptions.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gradient mb-4">
            Money Relationship Assessment
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover and transform your relationship with money across four key dimensions
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8 animate-slide-up">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Section Indicator */}
        <div className="mb-6 animate-slide-up">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/20 text-accent-foreground">
            <span className="text-sm font-medium">
              Section {currentSection + 1}: {sectionTitles[currentSection]}
            </span>
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-8 animate-slide-up gradient-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-foreground leading-relaxed">
              {question.text}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderQuestionInput()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center animate-slide-up">
          <Button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <Button
            onClick={nextQuestion}
            disabled={!answers[question.id]}
            className="btn-gradient flex items-center gap-2"
          >
            {currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};