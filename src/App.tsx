import React from 'react';
import logo from './logo.svg';
import './App.css';
import { GoogleGenerativeAI } from '@google/generative-ai';


function App() {
  const [messages, setMessages] = React.useState<Array<{role: 'user' | 'bot', content: string}>>([]);
  const [input, setInput] = React.useState('');

  const handleSend = async () => {
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY ?? '');
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      // Get response from Gemini
      const result = await model.generateContent(input);
      const response = await result.response;
      const botMessage = { role: 'bot' as const, content: response.text() };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { role: 'bot' as const, content: 'Sorry, I encountered an error.' };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                {message.content}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
