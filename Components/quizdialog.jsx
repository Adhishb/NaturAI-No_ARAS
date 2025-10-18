import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Sparkles, ArrowLeft, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const questions = [
  { question: "What's your gardening experience?", options: ["Beginner", "Intermediate", "Advanced"] },
  { question: "How much sunlight does your space get?", options: ["Full Sun", "Partial Sun", "Shade"] },
  { question: "What matters most to you?", options: ["Beautiful flowers", "Fresh produce", "Low maintenance", "Fragrance", "Air purifying"] },
  { question: "How much time can you dedicate?", options: ["Minimal", "Moderate", "Lots"] },
  { question: "What's your space like?", options: ["Indoor", "Balcony", "Small garden", "Large outdoor"] },
];

export default function QuizDialog({ open, onClose }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  const handleAnswer = async (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setLoading(true);
      try {
        const allPlants = await base44.entities.Plant.list();
        const prompt = `Based on answers, recommend 5 perfect plants. Answers: ${JSON.stringify(newAnswers)}. Available plants: ${JSON.stringify(allPlants.slice(0,50))}`;
        const response = await base44.integrations.Core.InvokeLLM({ prompt, add_context_from_internet: false });
        setRecommendations(response);
      } catch (err) {
        console.error(err);
        setRecommendations("Unable to generate recommendations. Try browsing the plant library!");
      }
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const handleClose = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setRecommendations(null);
    onClose();
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-600" /> Find Your Perfect Plant
          </DialogTitle>
        </DialogHeader>

        {!recommendations ? (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                {questions[currentQuestion].question}
              </h3>
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, i) => (
                  <Card key={i} className="p-4 cursor-pointer hover:bg-green-50 hover:border-green-300 transition-all border-2" onClick={() => handleAnswer(option)}>
                    <p className="font-medium text-gray-900">{option}</p>
                  </Card>
                ))}
              </div>
            </div>

            {currentQuestion > 0 && (
              <Button variant="outline" onClick={handleBack} className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-green-600 mb-4" />
                <p className="text-gray-600">Analyzing your answers...</p>
              </div>
            ) : (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="font-bold text-xl mb-3 text-gray-900">Your Personalized Recommendations</h3>
                  <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                    {recommendations}
                  </div>
                </div>
                <Button onClick={handleClose} className="w-full bg-green-600 hover:bg-green-700">
                  Explore These Plants
                </Button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
