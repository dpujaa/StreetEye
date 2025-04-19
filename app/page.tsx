"use client"

import type React from "react"

import { useState, useRef } from "react"
import { AlertCircle, Download, Volume2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
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
    // Simulate analysis with a timeout
    setTimeout(() => {
      setIsAnalyzing(false)
      setThreatDetected(Math.random() > 0.5)

      // Generate some mock flagged frames
      const mockFrames = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        timestamp: `00:${Math.floor(Math.random() * 59)
          .toString()
          .padStart(2, "0")}`,
        coordinates: `${(Math.random() * 90).toFixed(6)}, ${(Math.random() * 180).toFixed(6)}`,
        severity: Math.random() > 0.5 ? "high" : "medium",
      }))

      setFlaggedFrames(mockFrames)
    }, 3000)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const speakRights = () => {
    const utterance = new SpeechSynthesisUtterance(
      "You have the right to remain silent. Anything you say can and will be used against you in a court of law. You have the right to an attorney. If you cannot afford an attorney, one will be provided for you.",
    )
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900 px-6 py-4">
        <h1 className="text-2xl font-bold text-red-500 md:text-3xl">StreetEye</h1>
        <p className="text-sm text-gray-400">Real-Time Police Accountability AI</p>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full border-b border-gray-800 bg-gray-900 p-4 md:w-80 md:border-b-0 md:border-r">
          <div className={`mb-6 rounded-lg p-4 ${threatDetected ? "bg-red-900/30" : "bg-green-900/30"}`}>
            <h3 className="mb-2 font-medium">Status</h3>
            {isAnalyzing ? (
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 animate-pulse rounded-full bg-blue-500"></div>
                <span>Analyzing video...</span>
              </div>
            ) : threatDetected ? (
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="h-5 w-5" />
                <span>⚠️ Potential Misconduct Detected</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-400">
                <Badge variant="outline" className="bg-green-900/30 text-green-400">
                  SAFE
                </Badge>
                <span>No Threat Detected</span>
              </div>
            )}
          </div>

          <div className="mb-6 rounded-lg border border-gray-800 bg-gray-900/50 p-4">
            <h3 className="mb-2 font-medium">Your Rights</h3>
            <ScrollArea className="h-40 rounded-md border border-gray-800 bg-gray-950 p-4">
              <p className="text-sm text-gray-300">
                You have the right to record police officers performing their public duties. The First Amendment
                protects your right to record the police as they perform their official duties in public. This includes
                taking photos, videos, or audio recordings.
              </p>
              <p className="mt-2 text-sm text-gray-300">
                Police officers may not confiscate or demand to view your photographs or video without a warrant, nor
                may they delete data under any circumstances. If an officer orders you to stop recording or interferes
                with your recording, you should politely inform them that you are engaged in constitutionally protected
                activity.
              </p>
            </ScrollArea>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-gray-800 bg-gray-900 hover:bg-gray-800"
              onClick={() => alert("Report downloaded")}
            >
              <Download className="h-4 w-4" />
              Download Report
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-gray-800 bg-gray-900 hover:bg-gray-800"
              onClick={speakRights}
            >
              <Volume2 className="h-4 w-4" />
              Speak Rights Aloud
            </Button>
          </div>
        </div>

        {/* Main Panel */}
        <div className="flex flex-1 flex-col p-4">
          {/* Video Upload & Player */}
          <div className="mb-4 rounded-lg border border-gray-800 bg-gray-900 p-4">
            <div className="mb-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Video Analysis</h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-gray-700 bg-gray-800 hover:bg-gray-700"
                  onClick={triggerFileInput}
                >
                  <Upload className="h-4 w-4" />
                  Upload Video Feed (.mp4, .mov)
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".mp4,.mov"
                  onChange={handleFileUpload}
                />
              </div>
            </div>

            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-950">
              {videoSrc ? (
                <video src={videoSrc} controls className="h-full w-full"></video>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center text-gray-500">
                  <Upload className="mb-2 h-10 w-10" />
                  <p>Upload a video to begin analysis</p>
                </div>
              )}
            </div>
          </div>

          {/* Flagged Frames */}
          {flaggedFrames.length > 0 && (
            <div className="mb-4 rounded-lg border border-gray-800 bg-gray-900 p-4">
              <h3 className="mb-3 font-medium">Flagged Frames</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {flaggedFrames.map((frame) => (
                  <div key={frame.id} className="relative flex-shrink-0">
                    <div className="relative h-24 w-40 overflow-hidden rounded-md border border-gray-700">
                      <div className="absolute inset-0 bg-gray-800">
                        <img
                          src={`/placeholder.svg?height=96&width=160`}
                          alt={`Flagged frame at ${frame.timestamp}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div
                        className={`absolute top-0 right-0 m-1 rounded-full p-1 ${frame.severity === "high" ? "bg-red-500" : "bg-yellow-500"}`}
                      >
                        <AlertCircle className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div className="mt-1 text-xs">
                      <div className="font-medium">{frame.timestamp}</div>
                      <div className="text-gray-400">{frame.coordinates}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past Alerts Log */}
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
            <h3 className="mb-3 font-medium">Past Alerts Log</h3>
            <Tabs defaultValue="all">
              <TabsList className="mb-4 grid w-full grid-cols-3 bg-gray-800">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="high">High Priority</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <ScrollArea className="h-[calc(100vh-600px)] min-h-[200px]">
                  <div className="grid gap-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Card key={i} className="border-gray-800 bg-gray-950">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium">Incident #{1000 + i}</CardTitle>
                            <Badge
                              variant={i % 2 === 0 ? "destructive" : "outline"}
                              className={i % 2 === 0 ? "" : "bg-yellow-900/30 text-yellow-400"}
                            >
                              {i % 2 === 0 ? "High Priority" : "Medium Priority"}
                            </Badge>
                          </div>
                          <CardDescription className="text-xs text-gray-400">
                            {new Date(Date.now() - i * 86400000).toLocaleDateString()} at{" "}
                            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2 text-xs">
                          <p>
                            Potential misconduct detected at Main St & 5th Ave. Officer badge #4{i}21 identified in
                            frame.
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-0">
                          <Button variant="link" size="sm" className="h-auto p-0 text-xs text-blue-400">
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 gap-1 border-gray-700 bg-gray-800 px-2 text-xs hover:bg-gray-700"
                          >
                            <Download className="h-3 w-3" />
                            Export
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="high">
                <div className="flex h-40 items-center justify-center text-gray-500">
                  <p>High priority alerts will appear here</p>
                </div>
              </TabsContent>

              <TabsContent value="resolved">
                <div className="flex h-40 items-center justify-center text-gray-500">
                  <p>Resolved alerts will appear here</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
