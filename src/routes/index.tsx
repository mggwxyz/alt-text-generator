import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '@/components/Layout'
import { FileDropzone } from '@/components/FileDropzone'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useMutation } from '@tanstack/react-query'
import { generateAltText } from '../utils/generate-alt-text'
import { useAppStore } from '@/store/store'
import { useServerFn } from '@tanstack/react-start'
import { Buffer } from 'buffer'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const generateAltTextFn = useServerFn(generateAltText)
  const selectedFile = useAppStore(state => state.selectedFile)
  const preview = useAppStore(state => state.preview)
  const altTextPrompt = useAppStore(state => state.altTextPrompt)
  const shortAltText = useAppStore(state => state.shortAltText)
  const longAltText = useAppStore(state => state.longAltText)
  const isGenerating = useAppStore(state => state.isGenerating)

  console.log('selectedFile', selectedFile)
  
  const setAltTextPrompt = useAppStore(state => state.setAltTextPrompt)
  const setShortAltText = useAppStore(state => state.setShortAltText)
  const setLongAltText = useAppStore(state => state.setLongAltText)
  const setIsGenerating = useAppStore(state => state.setIsGenerating)
  
  const handleFileSelect = useAppStore(state => state.handleFileSelect)
  const handleClearFile = useAppStore(state => state.handleClearFile)
  const handleReset = useAppStore(state => state.handleReset)
  const handleSave = useAppStore(state => state.handleSave)

  const handleCopyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Text copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy text:', err)
      toast.error('Failed to copy text to clipboard')
    }
  }

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
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Step 1: Upload and Configure */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Step 1: Upload & Configure</CardTitle>
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
              
              
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="flex-1"
                >
                  Reset
                </Button>
                <Button 
                  onClick={async() =>  {
                    const imageBuffer = await selectedFile?.arrayBuffer();
                    const imageBase64 = Buffer.from(imageBuffer as ArrayBuffer).toString('base64');
                    
                    mutate({data: {
                    image: imageBase64,
                    prompt: altTextPrompt,
                  }})
                  }}
                  disabled={!selectedFile || isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? 'Generating...' : 'Generate Alt Text'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Review and Save */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Step 2: Review & Save</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <img 
                    src="https://64.media.tumblr.com/fe078c6ee77abcba0335a81a3a6823f4/tumblr_mnbo1uliIN1s8d736o1_500.gifv"
                    alt="Generating alt text..."
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <p className="text-muted-foreground">Generating alt text...</p>
                </div>
              ) : (shortAltText || longAltText) ? (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="short-alt-text">Short Alt Text</Label>
                      {shortAltText && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyText(shortAltText)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <Textarea
                      id="short-alt-text"
                      placeholder="Short alt text will appear here..."
                      value={shortAltText}
                      onChange={(e) => setShortAltText(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="long-alt-text">Long Alt Text</Label>
                      {longAltText && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyText(longAltText)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
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
                  
                  <div className="text-sm text-muted-foreground">
                    <p>💡 You can edit the generated alt text above before saving.</p>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">Generate alt text to see results here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
    </Layout>
  )
}
