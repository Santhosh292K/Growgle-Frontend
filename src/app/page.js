'use client';

import React from 'react';
import Link from 'next/link';
import { motion ,AnimatePresence} from 'framer-motion';
import { 
  ArrowRight, 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Award,
  Zap,
  Globe,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

const features = [
  {
    icon: Target,
    title: 'Skills Mapping',
    description: 'Upload your resume or manually input skills. Our AI analyzes and maps your competencies to career opportunities.',
    color: 'text-blue-600'
  },
  {
    icon: Brain,
    title: 'AI-Powered Recommendations',
    description: 'Get tailored career path suggestions based on your skills, interests, and market trends.',
    color: 'text-green-600'
  },
  {
    icon: TrendingUp,
    title: 'Industry Insights',
    description: 'Stay ahead with real-time industry trends and government policy impacts on your career path.',
    color: 'text-red-600'
  },
  {
    icon: BookOpen,
    title: 'Personalized Roadmap',
    description: 'Receive actionable milestones, skill development plans, and certification recommendations.',
    color: 'text-yellow-600'
  }
];

const quotes = [
  {
    text: "Choose a job you love, and you will never have to work a day in your life.",
    author: "- Confucius",
  },
  {
    text: "Opportunities don't happen. You create them.",
    author: "- Chris Grosser",
  },
];

export default function Home() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = React.useState(0);

React.useEffect(() => {
  const interval = setInterval(() => {
    setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
  }, 3000); // change quote every 5 seconds
  return () => clearInterval(interval);
}, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 pt-16 pb-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-20 w-40 h-40 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-grey-900 mb-6 tracking-tight">
                Your AI-Powered
                <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  {' '}Career Compass
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-grey-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Navigate your career journey with personalized AI guidance. 
                Map your skills, discover opportunities, and build your future.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Button size="lg" className="px-8 py-4" asChild>
              <Link href="/skills" className="flex items-center gap-2 text-lg">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>

              <Button variant="outlined" size="lg" className="text-lg px-8 py-4" asChild>
                <Link href="/dashboard">
                  View Demo
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            {/* Quote Carousel */}
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.4 }}
  className="mt-16 flex justify-center"
>
  <div className="max-w-xl w-full text-center">
    <AnimatePresence mode="wait">
      <motion.div
        key={currentQuoteIndex}
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="italic text-gray-700 text-sm md:text-base font-light tracking-wide"
      >
  &ldquo;{quotes[currentQuoteIndex].text}&rdquo;
        <span className="block mt-1 text-gray-500 text-xs md:text-sm font-medium">
          {quotes[currentQuoteIndex].author}
        </span>
      </motion.div>
    </AnimatePresence>
  </div>
</motion.div>


          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-grey-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-grey-600 max-w-2xl mx-auto">
              Comprehensive AI-powered tools to guide your career journey from discovery to success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-grey-100 mb-4 ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-grey-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-grey-900 mb-4">
              How Growgle Works
            </h2>
            <p className="text-xl text-grey-600 max-w-2xl mx-auto">
              Three simple steps to unlock your career potential
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Map Your Skills',
                description: 'Upload your resume or manually input your skills. Our AI analyzes your competencies.',
                icon: Target,
                color: 'bg-blue-100 text-blue-600'
              },
              {
                step: '2',
                title: 'Get Recommendations',
                description: 'Receive personalized career paths and opportunities based on your profile.',
                icon: Brain,
                color: 'bg-green-100 text-green-600'
              },
              {
                step: '3',
                title: 'Follow Your Roadmap',
                description: 'Access your personalized learning path with milestones and certifications.',
                icon: BookOpen,
                color: 'bg-red-100 text-red-600'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${step.color} mb-6`}>
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-grey-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-grey-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to accelerate your career?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who&rsquo;ve found their perfect career path with Growgle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4" asChild>
                <Link href="/skills" className="flex items-center gap-2 text-lg">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-blue-600" asChild>
                <Link href="/dashboard">
                  Explore Features
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
