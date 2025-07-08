import { createFileRoute, Link } from '@tanstack/react-router'
import { FileDropzone } from '@/components/FileDropzone'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { useMutation } from '@tanstack/react-query'
import { generateAltText } from '../utils/generate-alt-text'
import { useAppStore } from '@/store/store'
import { useServerFn } from '@tanstack/react-start'
import { Buffer } from 'buffer'
import { Plus, Star } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const generateAltTextFn = useServerFn(generateAltText)
  const selectedFile = useAppStore(state => state.selectedFile)
  const preview = useAppStore(state => state.preview)
  const altTextPrompt = useAppStore(state => state.altTextPrompt)
  const variability = useAppStore(state => state.variability)
  const shortAltText = useAppStore(state => state.shortAltText)
  const longAltText = useAppStore(state => state.longAltText)
  const isGenerating = useAppStore(state => state.isGenerating)

  console.log('selectedFile', selectedFile)
  
  const setAltTextPrompt = useAppStore(state => state.setAltTextPrompt)
  const setVariability = useAppStore(state => state.setVariability)
  const setShortAltText = useAppStore(state => state.setShortAltText)
  const setLongAltText = useAppStore(state => state.setLongAltText)
  const setIsGenerating = useAppStore(state => state.setIsGenerating)
  
  const handleFileSelect = useAppStore(state => state.handleFileSelect)
  const handleClearFile = useAppStore(state => state.handleClearFile)
  const handleReset = useAppStore(state => state.handleReset)
  const handleSave = useAppStore(state => state.handleSave)

  const { mutate } = useMutation({
    mutationFn: generateAltTextFn,
    onMutate: () => {
      setIsGenerating(true)
    },
    onSuccess: (data) => {
      console.log('data', data)
      setShortAltText(data.shortText)
      setLongAltText(data.longText)
    },
    onError: (error) => {
      console.error(error)
    },
    onSettled: () => {
      setIsGenerating(false)
    }
  });

  return (
    <div className="min-h-screen bg-blue-200">
      <nav className="border-b bg-white">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Alt Text Generator</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                <Plus className="h-4 w-4" />
                <span>New</span>
              </Link>
            </Button>
            <Button variant="outline" asChild>
            <Link to="/saved" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors">
              <Star className="h-4 w-4" />
                <span>Saved</span>
              </Link>
            </Button>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Step 1: Upload and Configure */}
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Upload & Configure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FileDropzone
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                preview={preview}
                onClear={handleClearFile}
              />
              
              <div className="space-y-2">
                <Label htmlFor="alt-text-prompt">Alt Text Prompt</Label>
                <Textarea
                  id="alt-text-prompt"
                  placeholder="Describe what you'd like emphasized in the alt text..."
                  value={altTextPrompt}
                  onChange={(e) => setAltTextPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="variability">Variability</Label>
                  <span className="text-sm text-muted-foreground">{variability}%</span>
                </div>
                <Slider
                  id="variability"
                  min={0}
                  max={100}
                  step={1}
                  value={[variability]}
                  onValueChange={(value) => setVariability(value[0])}
                  className="w-full"
                />
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={async() =>  {
                    const imageBuffer = await selectedFile?.arrayBuffer();
                    const imageBase64 = Buffer.from(imageBuffer as ArrayBuffer).toString('base64');
                    
                    mutate({data: {
                    image: imageBase64,
                    prompt: altTextPrompt,
                    variability: variability,
                  }})
                  }}
                  disabled={!selectedFile || isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? 'Generating...' : 'Generate Alt Text'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="flex-1"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Review and Save */}
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Review & Save</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="short-alt-text">Short Alt Text</Label>
                <Textarea
                  id="short-alt-text"
                  placeholder="Short alt text will appear here..."
                  value={shortAltText}
                  onChange={(e) => setShortAltText(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="long-alt-text">Long Alt Text</Label>
                <Textarea
                  id="long-alt-text"
                  placeholder="Long alt text will appear here..."
                  value={longAltText}
                  onChange={(e) => setLongAltText(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>
              
              <Button 
                onClick={handleSave}
                disabled={!selectedFile || !shortAltText || !longAltText}
                className="w-full"
              >
                Save Image & Alt Text
              </Button>
              
              {(shortAltText || longAltText) && (
                <div className="text-sm text-muted-foreground">
                  <p>💡 You can edit the generated alt text above before saving.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
