'use client';
import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { jsPDF } from 'jspdf';
import { FaDumbbell, FaFilePdf } from 'react-icons/fa';
import { Analytics } from '@vercel/analytics/react';

export default function Home() {
  const [days, setDays] = useState<number>(3);
  const [equipment, setEquipment] = useState<string>('minimal');
  const [focus, setFocus] = useState<string>('full-body');
  const [workoutPlan, setWorkoutPlan] = useState<string>('');

  const { messages, handleSubmit, handleInputChange, input, status } = useChat({
    api: '/api/generate-workout',
    onFinish: (result) => {
      setWorkoutPlan(result[0].content);
    },
  });

  const generatePrompt = () => `
    Generate a detailed weekly workout plan for ${days} days per week. 
    The user has ${equipment} equipment (e.g., none, minimal, gym). 
    Focus on ${focus} (e.g., full-body, upper body, lower body, cardio). 
    Include exercise names, sets, reps, and rest periods. Format as a markdown list.
  `;

  const handleGenerateWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e, { message: generatePrompt() });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Weekly Workout Plan', 10, 10);
    doc.text(workoutPlan, 10, 20, { maxWidth: 180 });
    doc.save('weekly-workout-plan.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center flex items-center justify-center">
          <FaDumbbell className="mr-2" /> Workout Generator
        </h1>
        <form onSubmit={handleGenerateWorkout} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Days per Week
            </label>
            <input
              type="number"
              min="1"
              max="7"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="mt-1 block w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Equipment Level
            </label>
            <select
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md"
            >
              <option value="none">None</option>
              <option value="minimal">Minimal (Dumbbells, Resistance Bands)</option>
              <option value="gym">Full Gym</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Focus Area
            </label>
            <select
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md"
            >
              <option value="full-body">Full Body</option>
              <option value="upper-body">Upper Body</option>
              <option value="lower-body">Lower Body</option>
              <option value="cardio">Cardio</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={status !== 'ready'}
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            Generate Workout
          </button>
        </form>
        {workoutPlan && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Your Workout Plan</h2>
            <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto">
              {workoutPlan}
            </pre>
            <button
              onClick={exportToPDF}
              className="mt-4 w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 flex items-center justify-center"
            >
              <FaFilePdf className="mr-2" /> Export to PDF
            </button>
          </div>
        )}
      </div>
      <Analytics />
    </div>
  );
}
