"use client"

import { useState, useRef } from "react"
import { AlertCircle, Download, Upload, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Dashboard() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [threatDetected, setThreatDetected] = useState(false)
  const [flaggedFrames, setFlaggedFrames] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setVideoSrc(url)
      simulateAnalysis()
    }
  }

  const simulateAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setThreatDetected(Math.random() > 0.5)
      const mockFrames = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        timestamp: `00:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
        coordinates: `${(Math.random() * 90).toFixed(6)}, ${(Math.random() * 180).toFixed(6)}`
      }))
      setFlaggedFrames(mockFrames)
    }, 3000)
  }

  const speakRights = () => {
    const utterance = new SpeechSynthesisUtterance(
      "You have the right to remain silent. Anything you say can and will be used against you in a court of law. You have the right to an attorney."
    )
    window.speechSynthesis.speak(utterance)
  }

  const triggerFileInput = () => fileInputRef.current?.click()

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-black via-gray-900 to-black text-white font-sans tracking-wide">
      <header className="border-b border-gray-800 bg-gray-950/80 px-8 py-6 backdrop-blur-lg shadow-md">
        <h1 className="text-4xl font-extrabold text-red-500 drop-shadow-md">StreetEye</h1>
        <p className="text-sm text-gray-400 tracking-widest mt-1">Real-Time Police Accountability AI</p>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="w-full md:w-80 bg-gray-900 p-4 border-b md:border-r md:border-b-0 border-gray-800">
          <div className={`rounded-2xl p-4 mb-6 shadow-inner backdrop-blur-lg border border-gray-700 transition-all ${threatDetected ? "bg-red-900/30 ring-1 ring-red-400" : "bg-green-900/30 ring-1 ring-green-400"}`}>
            <h3 className="font-medium mb-2">Status</h3>
            {isAnalyzing ? (
              <span className="flex items-center gap-2 animate-pulse text-blue-400">
                <div className="h-3 w-3 rounded-full bg-blue-400"></div>
                Analyzing...
              </span>
            ) : threatDetected ? (
              <span className="flex items-center gap-2 text-red-400">
                <AlertCircle className="h-5 w-5" /> ⚠️ Potential Misconduct Detected
              </span>
            ) : (
              <span className="flex items-center gap-2 text-green-400">
                <Badge variant="outline" className="bg-green-800/30 text-green-300 ring-1 ring-green-400">✅ All Clear</Badge> No Threat Detected
              </span>
            )}
          </div>

          <div className="rounded-lg bg-black/30 backdrop-blur-sm p-4 border border-gray-700 mb-6">
            <h3 className="font-medium mb-2">Your Rights</h3>
            <ScrollArea className="h-40 p-3 border border-gray-700 rounded-lg">
              <p className="text-sm text-gray-300">
                You have the right to record police officers performing their public duties. The First Amendment protects your right to record them in public.
              </p>
              <p className="text-sm mt-2 text-gray-300">
                Officers may not delete or demand videos without a warrant. You should inform them you're engaged in constitutionally protected activity.
              </p>
            </ScrollArea>
          </div>

          <div className="flex flex-col gap-3">
            <Button variant="outline" className="justify-start gap-2 border-gray-800 bg-gray-900 hover:bg-gray-800">
              <Download className="h-4 w-4" /> Download Report
            </Button>
            <Button onClick={speakRights} variant="outline" className="justify-start gap-2 border-gray-800 bg-gray-900 hover:bg-gray-800">
              <Volume2 className="h-4 w-4" /> Speak Rights Aloud
            </Button>
          </div>
        </aside>

        <main className="flex-1 p-6 flex flex-col gap-6">
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Video Analysis</h2>
              <Button onClick={triggerFileInput} size="sm" variant="outline" className="gap-2 border-gray-700 bg-gray-800 hover:bg-gray-700">
                <Upload className="h-4 w-4" /> Upload Video Feed (.mp4, .mov)
              </Button>
              <input type="file" accept=".mp4,.mov" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
            </div>
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-950 border border-gray-800 flex items-center justify-center">
              {videoSrc ? (
                <video src={videoSrc} controls className="w-full h-full rounded-lg shadow-md" />
              ) : (
                <div className="text-center text-gray-600">
                  <Upload className="h-10 w-10 mx-auto mb-2" />
                  <p className="text-sm">Upload a video to begin analysis</p>
                </div>
              )}
            </div>
          </div>

          {flaggedFrames.length > 0 && (
            <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
              <h3 className="mb-3 font-medium">Flagged Frames</h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {flaggedFrames.map((frame) => (
                  <div key={frame.id} className="flex-shrink-0 text-xs">
                    <div className="h-24 w-40 bg-gray-800 rounded-xl overflow-hidden relative border border-gray-700 hover:ring-2 hover:ring-red-500 transition">
                      <img src="/placeholder.svg" alt={`Frame ${frame.timestamp}`} className="w-full h-full object-cover" />
                      <span className="absolute top-1 right-1 text-white text-xs bg-red-600 px-1 rounded">⚠️</span>
                    </div>
                    <div className="mt-1">{frame.timestamp}</div>
                    <div className="text-gray-400">{frame.coordinates}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
            <h3 className="mb-3 font-medium">Past Alerts Log</h3>
            <Tabs defaultValue="all">
              <TabsList className="grid grid-cols-3 w-full mb-4 bg-gray-800 rounded-lg shadow-sm">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="high">High Priority</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <ScrollArea className="h-60">
                  <div className="grid gap-3">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="bg-gray-950 border border-gray-800 rounded-xl shadow-md hover:ring-1 hover:ring-blue-400 transition">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <CardTitle className="text-sm">Incident #{1000 + i}</CardTitle>
                            <Badge variant={i % 2 === 0 ? "destructive" : "outline"}>
                              {i % 2 === 0 ? "High Priority" : "Medium Priority"}
                            </Badge>
                          </div>
                          <CardDescription className="text-xs text-gray-400">
                            {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="text-xs pb-2">
                          Potential misconduct detected at Main & 5th. Officer badge #{i}42 recorded.
                        </CardContent>
                        <CardFooter className="pt-0 flex justify-between">
                          <Button variant="link" size="sm" className="text-xs text-blue-400 p-0">View Details</Button>
                          <Button variant="outline" size="sm" className="px-2 text-xs border-gray-700 bg-gray-800 hover:bg-gray-700">
                            <Download className="h-3 w-3 mr-1" /> Export
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="high">
                <p className="text-gray-500 text-sm text-center">No high priority alerts yet.</p>
              </TabsContent>

              <TabsContent value="resolved">
                <p className="text-gray-500 text-sm text-center">No resolved alerts yet.</p>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
