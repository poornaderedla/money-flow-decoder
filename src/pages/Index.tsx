import React, { useState } from 'react';
import { MoneyAssessment } from '@/components/MoneyAssessment';
import { AssessmentResults } from '@/components/AssessmentResults';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Heart, Brain, Target, DollarSign, Check, ArrowRight } from 'lucide-react';

interface AssessmentData {
  [key: string]: string;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'assessment' | 'results'>('landing');
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({});

  const handleStartAssessment = () => {
    setCurrentView('assessment');
  };

  const handleAssessmentComplete = (data: AssessmentData) => {
    setAssessmentData(data);
    setCurrentView('results');
  };

  const handleRestart = () => {
    setAssessmentData({});
    setCurrentView('landing');
  };

  if (currentView === 'assessment') {
    return <MoneyAssessment onComplete={handleAssessmentComplete} />;
  }

  if (currentView === 'results') {
    return <AssessmentResults data={assessmentData} onRestart={handleRestart} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        <Card className="border-none shadow-lg bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl sm:text-4xl font-bold text-black">Money Relationship Assessment</CardTitle>
            <p className="text-lg mt-2 text-black">Discover and transform your relationship with money across four key dimensions</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-black mb-3">What is Money Relationship Assessment?</h2>
              <p className="text-black mb-4">Your money relationship encompasses your emotional responses, beliefs, actions, and current financial reality—key factors for financial success and abundance.</p>
              <p className="text-black">This assessment measures your <span className="font-medium">money mindset potential</span>, not just your current financial situation. Use it to understand your strengths and find opportunities for improvement.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm flex items-start space-x-3 border border-gray-200">
                <div className="bg-gray-100 p-2 rounded-full">
                  <Heart className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="font-medium text-black">Money Feelings</h3>
                  <p className="text-sm text-gray-600">Understand your emotional responses to money situations and learn to elevate your frequency</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm flex items-start space-x-3 border border-gray-200">
                <div className="bg-gray-100 p-2 rounded-full">
                  <Brain className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="font-medium text-black">Money Beliefs</h3>
                  <p className="text-sm text-gray-600">Identify limiting beliefs and reprogram your subconscious for wealth and abundance</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm flex items-start space-x-3 border border-gray-200">
                <div className="bg-gray-100 p-2 rounded-full">
                  <Target className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="font-medium text-black">Money Actions</h3>
                  <p className="text-sm text-gray-600">Analyze your financial habits and get actionable steps to align your behavior with your goals</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm flex items-start space-x-3 border border-gray-200">
                <div className="bg-gray-100 p-2 rounded-full">
                  <DollarSign className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="font-medium text-black">Financial Reality</h3>
                  <p className="text-sm text-gray-600">Assess your current financial situation and receive personalized strategies for growth</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-black mb-3">About This Assessment</h2>
              <ul className="space-y-2 text-black">
                <li className="flex items-center"><span className="h-2 w-2 rounded-full bg-gray-400 mr-2"></span><span>Takes approximately 10-15 minutes to complete</span></li>
                <li className="flex items-center"><span className="h-2 w-2 rounded-full bg-gray-400 mr-2"></span><span>Includes 48 questions across 4 key dimensions</span></li>
                <li className="flex items-center"><span className="h-2 w-2 rounded-full bg-gray-400 mr-2"></span><span>Provides detailed feedback and personalized recommendations</span></li>
                <li className="flex items-center"><span className="h-2 w-2 rounded-full bg-gray-400 mr-2"></span><span>Your responses are completely private and confidential</span></li>
              </ul>
            </div>
          </CardContent>
          <div className="flex justify-center pb-8">
            <Button 
              onClick={handleStartAssessment}
              className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-8 shadow-md transition-all hover:scale-105 rounded-full"
              style={{ fontSize: '1.125rem' }}
            >
              Begin Assessment
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
