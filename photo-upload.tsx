"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Camera, Upload, X, FileImage, Loader2, Copy, Wand2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { useLiteMode } from "./lite-mode-toggle"

interface PhotoUploadProps {
  onTextExtracted?: (text: string) => void
  onImageUploaded?: (imageUrl: string) => void
  className?: string
}

interface UploadedImage {
  id: string
  file: File
  url: string
  extractedText?: string
  isProcessing: boolean
}

export function PhotoUpload({ onTextExtracted, onImageUploaded, className = "" }: PhotoUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const { isLiteMode } = useLiteMode()

  // Simulate OCR text extraction
  const extractTextFromImage = async (file: File): Promise<string> => {
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock extracted text based on common programming questions
    const mockTexts = [
      "How do I fix this error: TypeError: Cannot read property 'map' of undefined in React?",
      "What's the difference between let, const, and var in JavaScript?",
      "How to implement authentication in Next.js with TypeScript?",
      "Why am I getting a CORS error when making API calls?",
      "How to optimize React component performance with useMemo?",
    ]

    return mockTexts[Math.floor(Math.random() * mockTexts.length)]
  }

  // Simulate image upload
  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })
  }

  const processImage = async (file: File) => {
    const imageId = Math.random().toString(36).substr(2, 9)
    const imageUrl = await uploadImage(file)

    const newImage: UploadedImage = {
      id: imageId,
      file,
      url: imageUrl,
      isProcessing: true,
    }

    setImages((prev) => [...prev, newImage])
    onImageUploaded?.(imageUrl)

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    try {
      const extractedText = await extractTextFromImage(file)

      setImages((prev) =>
        prev.map((img) => (img.id === imageId ? { ...img, extractedText, isProcessing: false } : img)),
      )

      onTextExtracted?.(extractedText)
      toast.success("Text extracted successfully!", {
        description: "The text from your image has been extracted and can be used in your question.",
      })
    } catch (error) {
      setImages((prev) => prev.map((img) => (img.id === imageId ? { ...img, isProcessing: false } : img)))
      toast.error("Failed to extract text from image")
    }

    setUploadProgress(0)
  }

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        processImage(file)
      } else {
        toast.error("Please select only image files")
      }
    })
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFileSelect(e.dataTransfer.files)
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const removeImage = (imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  const copyExtractedText = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Text copied to clipboard!")
  }

  const MotionDiv = isLiteMode ? "div" : motion.div

  return (
    <div className={className}>
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragging ? "border-blue-500 bg-blue-500/10" : "border-gray-700 hover:border-gray-600"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <FileImage className="h-12 w-12 text-gray-400" />
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-2">Upload Question Image</h3>
              <p className="text-sm text-gray-400 mb-4">
                Take a photo or upload an image of your code, error message, or diagram
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="bg-gray-800 border-gray-700 hover:bg-gray-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>

              <Button
                onClick={() => cameraInputRef.current?.click()}
                variant="outline"
                className="bg-gray-800 border-gray-700 hover:bg-gray-700"
              >
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
            </div>

            <p className="text-xs text-gray-500">
              Supports JPG, PNG, GIF up to 10MB. Text will be automatically extracted.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      {/* Upload Progress */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Uploading and processing...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Uploaded Images */}
      <AnimatePresence>
        {images.length > 0 && (
          <MotionDiv
            {...(isLiteMode
              ? {}
              : {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: -20 },
                })}
            className="mt-6 space-y-4"
          >
            <h4 className="text-sm font-medium text-white">Uploaded Images</h4>

            {images.map((image) => (
              <Card key={image.id} className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt="Uploaded"
                        className="w-20 h-20 object-cover rounded-lg border border-gray-700"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-white truncate">{image.file.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {(image.file.size / 1024 / 1024).toFixed(1)}MB
                          </Badge>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(image.id)}
                          className="h-8 w-8 p-0 hover:bg-red-500/20"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {image.isProcessing ? (
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Extracting text...</span>
                        </div>
                      ) : image.extractedText ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Wand2 className="h-4 w-4 text-green-400" />
                            <span className="text-sm font-medium text-green-400">Text Extracted</span>
                          </div>

                          <div className="bg-gray-800 rounded-lg p-3">
                            <p className="text-sm text-gray-300 mb-2">{image.extractedText}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyExtractedText(image.extractedText!)}
                              className="h-8 text-xs"
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy Text
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-red-400">Failed to extract text</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  )
}
