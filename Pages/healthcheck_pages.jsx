import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, Camera, Loader2, Bot, User } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function HealthCheck() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "👋 Hello! I'm your Plant Health Specialist. Upload a photo of your plant and I'll analyze its health, identify any issues, and provide care recommendations!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const { data: userPlants } = useQuery({
    queryKey: ['userPlantsForHealth'],
    queryFn: () => base44.entities.UserPlant.list(),
    initialData: [],
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setUploadedImage(file_url);
      await analyzeImage(file_url, "Analyze this plant's health in detail. What do you see?");
    } catch (error) {
      console.error('Upload error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I couldn't upload that image. Please try again.",
        },
      ]);
    }
    setUploadingImage(false);
  };

  const analyzeImage = async (imageUrl, userQuestion = "") => {
    if (!imageUrl) return;
    const userMessage = {
      role: 'user',
      content: userQuestion || 'What is the health status of this plant?',
      image: imageUrl,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const plantContext = selectedPlant
        ? `This is a ${selectedPlant.plant_name} (${selectedPlant.plant_category}), planted on ${
            selectedPlant.planted_date || 'unknown date'
          }, located ${selectedPlant.location || 'unknown location'}.`
        : "";

      const questionText = userQuestion || "What is the health status of this plant?";
      const prompt = `You are an expert plant health specialist. ${plantContext}

Analyze this plant photo and provide:
1. Overall Health Status
2. Visible Issues
3. Specific Symptoms
4. Root Causes
5. Action Plan
6. Prevention Tips
User question: ${questionText}`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        file_urls: [imageUrl],
        add_context_from_internet: false,
      });

      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);

      if (selectedPlant) {
        const statusText = response.toLowerCase();
        const healthStatus = statusText.includes('excellent')
          ? 'excellent'
          : statusText.includes('good')
          ? 'good'
          : statusText.includes('fair')
          ? 'fair'
          : 'poor';

        await base44.entities.HealthCheck.create({
          user_plant_id: selectedPlant.id,
          plant_name: selectedPlant.plant_name,
          image_url: imageUrl,
          health_status: healthStatus,
          recommendations: response.substring(0, 500),
          notes: userQuestion,
          check_date: new Date().toISOString().split('T')[0],
        });

        await base44.entities.UserPlant.update(selectedPlant.id, {
          ...selectedPlant,
          health_status: healthStatus,
        });
      }

      setUploadedImage(null);
      setSelectedPlant(null);
    } catch (error) {
      console.error('Analysis error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I apologize, but I encountered an error analyzing that image. Please try uploading another photo.",
        },
      ]);
    }
    setLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!uploadedImage) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "Please upload a photo of your plant first so I can analyze it! 📷" },
      ]);
      return;
    }
    await analyzeImage(uploadedImage, input);
  };

  return (
    <div>
      {/* The rendered chat UI is in the HTML section */}
    </div>
  );
}
