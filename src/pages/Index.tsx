import React, { useState } from 'react';
import { MoneyAssessment } from '@/components/MoneyAssessment';
import { AssessmentResults } from '@/components/AssessmentResults';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Heart, Brain, Target, DollarSign } from 'lucide-react';

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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="px-4 py-16 text-center animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-6">
            Transform Your Money Relationship
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover and shift your money relationship across four key dimensions: 
            emotions, beliefs, actions, and reality with our comprehensive assessment.
          </p>
          <Button 
            onClick={handleStartAssessment}
            size="lg"
            className="btn-gradient text-lg px-8 py-6 animate-slide-up"
          >
            Start Your Assessment
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            What You'll Discover
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="gradient-card border-0 shadow-lg animate-slide-up">
              <CardHeader className="text-center">
                <div className="mx-auto p-3 bg-red-100 rounded-lg w-fit mb-4">
                  <Heart className="h-6 w-6 text-red-500" />
                </div>
                <CardTitle>Money Feelings</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Understand your emotional responses to money situations and learn to elevate your frequency.
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-card border-0 shadow-lg animate-slide-up">
              <CardHeader className="text-center">
                <div className="mx-auto p-3 bg-blue-100 rounded-lg w-fit mb-4">
                  <Brain className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle>Money Beliefs</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Identify limiting beliefs and reprogram your subconscious for wealth and abundance.
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-card border-0 shadow-lg animate-slide-up">
              <CardHeader className="text-center">
                <div className="mx-auto p-3 bg-green-100 rounded-lg w-fit mb-4">
                  <Target className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle>Money Actions</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Analyze your financial habits and get actionable steps to align your behavior with your goals.
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-card border-0 shadow-lg animate-slide-up">
              <CardHeader className="text-center">
                <div className="mx-auto p-3 bg-yellow-100 rounded-lg w-fit mb-4">
                  <DollarSign className="h-6 w-6 text-yellow-500" />
                </div>
                <CardTitle>Financial Reality</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  Assess your current financial situation and receive personalized strategies for growth.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="animate-slide-up">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-accent-foreground">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Take Assessment</h3>
              <p className="text-muted-foreground">
                Answer 48 carefully crafted questions across four dimensions of your money relationship.
              </p>
            </div>
            <div className="animate-slide-up">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-accent-foreground">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Results</h3>
              <p className="text-muted-foreground">
                Receive detailed analysis with scores, patterns, and personalized recommendations.
              </p>
            </div>
            <div className="animate-slide-up">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-accent-foreground">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Transform</h3>
              <p className="text-muted-foreground">
                Apply actionable insights and affirmations to shift your money relationship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Money Relationship?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands who have discovered their money patterns and created lasting change.
          </p>
          <Button 
            onClick={handleStartAssessment}
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6"
          >
            <TrendingUp className="mr-2 h-5 w-5" />
            Start Your Journey Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
