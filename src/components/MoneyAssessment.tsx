import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  type: 'likert' | 'multiple' | 'yesno' | 'reflection';
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
  { id: 1, text: "How do you feel when you set high financial goals?", type: "likert" },
  { id: 2, text: "What's your emotional reaction when you don't meet financial targets?", type: "likert" },
  { id: 3, text: "When someone asks about your income or savings, how do you feel?", type: "multiple", options: ["Comfortable and open", "Slightly uncomfortable", "Very uncomfortable", "Proud to share", "Defensive"] },
  { id: 4, text: "How do you feel when you want to purchase something beyond your budget?", type: "likert" },
  { id: 5, text: "What emotions come up when you receive unexpected money?", type: "multiple", options: ["Pure joy and gratitude", "Excitement mixed with guilt", "Anxiety about spending it right", "Relief", "Suspicion or worry"] },
  { id: 6, text: "How do you feel when you must ask for financial help?", type: "likert" },
  { id: 7, text: "How do you emotionally respond to your peers earning more?", type: "multiple", options: ["Inspired and motivated", "Slightly envious but supportive", "Jealous and resentful", "Indifferent", "Curious about their methods"] },
  { id: 8, text: "What do you feel when you see others living a wealthier lifestyle?", type: "likert" },
  { id: 9, text: "What's your emotional state when paying bills or making large purchases?", type: "multiple", options: ["Calm and in control", "Slightly anxious", "Very stressed", "Excited about the purchase", "Resentful"] },
  { id: 10, text: "Do you experience guilt or shame while spending on yourself?", type: "yesno" },
  { id: 11, text: "How do you feel about receiving money as a gift or bonus?", type: "likert" },
  { id: 12, text: "What negative feelings come to mind around wealth (if any)?", type: "reflection" },

  // Section 2: Money Thoughts & Beliefs Frequency (12 questions)
  { id: 13, text: "Do you believe wealth is only for a few lucky or talented people?", type: "likert" },
  { id: 14, text: "How strongly do you believe money equals security?", type: "likert" },
  { id: 15, text: "Do you feel conflicted about wanting to be rich?", type: "yesno" },
  { id: 16, text: "Do you believe there's 'never enough' money?", type: "likert" },
  { id: 17, text: "Do you think wealth corrupts character or spirituality?", type: "multiple", options: ["Strongly agree", "Somewhat agree", "Neutral", "Somewhat disagree", "Strongly disagree"] },
  { id: 18, text: "Do you think setting big money goals is arrogant or selfish?", type: "yesno" },
  { id: 19, text: "Do you believe you have to work extremely hard to be wealthy?", type: "likert" },
  { id: 20, text: "Do you think you're bad with managing money?", type: "yesno" },
  { id: 21, text: "Have you internalized any beliefs like 'rich people are greedy'?", type: "yesno" },
  { id: 22, text: "Do you believe financial freedom is attainable for you?", type: "likert" },
  { id: 23, text: "What money beliefs from your parents do you still carry?", type: "reflection" },
  { id: 24, text: "Are there any recurring mental stories that limit your financial potential?", type: "reflection" },

  // Section 3: Money Action Frequency (12 questions)
  { id: 25, text: "Do you actively track your income and expenses?", type: "multiple", options: ["Daily", "Weekly", "Monthly", "Rarely", "Never"] },
  { id: 26, text: "Are you consistent with your budgeting?", type: "likert" },
  { id: 27, text: "Do you procrastinate when it comes to financial tasks?", type: "yesno" },
  { id: 28, text: "Do you avoid checking your bank account or credit score?", type: "yesno" },
  { id: 29, text: "Are you currently investing or saving with a plan?", type: "multiple", options: ["Yes, with a detailed plan", "Yes, but informally", "Thinking about it", "No, but want to", "No interest"] },
  { id: 30, text: "Do you seek financial advice or mentorship?", type: "yesno" },
  { id: 31, text: "How often do you set and review financial goals?", type: "multiple", options: ["Monthly", "Quarterly", "Yearly", "Rarely", "Never"] },
  { id: 32, text: "Are your money decisions driven more by emotion or logic?", type: "multiple", options: ["Mostly emotion", "Somewhat emotion", "Balanced", "Somewhat logic", "Mostly logic"] },
  { id: 33, text: "Do you often make impulse purchases?", type: "yesno" },
  { id: 34, text: "Have you taken steps to increase your income recently?", type: "yesno" },
  { id: 35, text: "Are you consistent with following through on money plans?", type: "likert" },
  { id: 36, text: "Are you more focused on spending than building assets?", type: "yesno" },

  // Section 4: Current Situation Frequency (12 questions)
  { id: 37, text: "Is your monthly income at least 2x your expenses?", type: "yesno" },
  { id: 38, text: "Are you debt-free or actively paying off debt?", type: "multiple", options: ["Completely debt-free", "Actively paying off debt", "Managing debt well", "Struggling with debt", "Overwhelmed by debt"] },
  { id: 39, text: "Are you saving a consistent percentage of your income?", type: "yesno" },
  { id: 40, text: "Do you have multiple streams of income?", type: "yesno" },
  { id: 41, text: "Are you investing (stock market, mutual funds, crypto, etc.)?", type: "multiple", options: ["Yes, regularly", "Yes, occasionally", "Just started", "Planning to start", "No"] },
  { id: 42, text: "Do you own any income-generating assets?", type: "yesno" },
  { id: 43, text: "Do you have a written financial plan or roadmap?", type: "yesno" },
  { id: 44, text: "Do you feel financially safe in emergencies?", type: "likert" },
  { id: 45, text: "Are you financially supporting others regularly?", type: "yesno" },
  { id: 46, text: "Are you regularly upgrading your money knowledge?", type: "yesno" },
  { id: 47, text: "Do you feel in control of your financial decisions?", type: "likert" },
  { id: 48, text: "Do you feel aligned with the lifestyle you're building?", type: "likert" }
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
    else if (questionIndex < 24) setCurrentSection(1);
    else if (questionIndex < 36) setCurrentSection(2);
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

      case 'reflection':
        return (
          <Textarea
            value={currentAnswer}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Share your thoughts... (optional)"
            className="min-h-[100px]"
          />
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