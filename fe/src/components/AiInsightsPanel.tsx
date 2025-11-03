'use client';


import { Button } from "./ui/button";
import { Wand2, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useChatStore } from "@/store/ useChatStore";

export default function AiInsightsPanel() {
  const { selectedUser, chats, getInsightForConversation, insight, isInsightLoading } = useChatStore();


  if (!selectedUser) {
    return (
      <div className="w-80 border-l border-white/5 p-4 flex flex-col items-center justify-center text-center">
        <Wand2 className="h-10 w-10 text-white/20 mb-4" />
        <p className="text-sm text-white/50">Select a conversation to see AI insights.</p>
      </div>
    );
  }

  const currentChat = chats.find(c => c.otherParticipant.id === selectedUser.id);
  
  const handleGenerate = () => {
    if (currentChat) {
      getInsightForConversation(currentChat.conversationId);
    }
  };

  return (
    <div className="w-80 border-l border-white/5 p-4 flex flex-col gap-4 bg-black">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">AI Insights</h3>
        {insight && (
          <Button variant="ghost" size="icon" className="h-7 w-7 text-white/50 hover:text-white" onClick={handleGenerate}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>
      

      {!insight && !isInsightLoading && (
        <div className="flex flex-col items-center text-center gap-4 mt-8">
            <Wand2 className="h-10 w-10 text-white/20" />
            <p className="text-sm text-white/50">Click the button to generate a summary and sentiment analysis for this conversation.</p>
            <Button onClick={handleGenerate} className="bg-white/10 hover:bg-white/20 text-white">
              Generate Insights
            </Button>
        </div>
      )}

    
      {isInsightLoading && (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-white/50" />
        </div>
      )}


      {insight && !isInsightLoading && (
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-base">Conversation Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-white/80 leading-relaxed">{insight.summary}</p>
            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <span className="text-xs text-white/50">Sentiment:</span>
              <span className={`text-xs font-bold ${
                insight.sentiment === 'Positive' ? 'text-emerald-400' :
                insight.sentiment === 'Negative' ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {insight.sentiment}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}