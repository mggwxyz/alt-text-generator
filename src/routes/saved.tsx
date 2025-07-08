import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Trash2, Download, Edit, Plus, Star } from 'lucide-react'

export const Route = createFileRoute('/saved')({
  component: SavedImages,
})

interface SavedData {
  fileName: string
  fileSize: number
  altTextPrompt: string
  variability: number
  shortAltText: string
  longAltText: string
  timestamp: string
}

function SavedImages() {
  const [savedData, setSavedData] = useState<SavedData[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editData, setEditData] = useState<SavedData | null>(null)

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('altTextHistory') || '[]')
    setSavedData(data)
  }, [])

  const handleDelete = (index: number) => {
    const newData = savedData.filter((_, i) => i !== index)
    setSavedData(newData)
    localStorage.setItem('altTextHistory', JSON.stringify(newData))
  }

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setEditData({ ...savedData[index] })
  }

  const handleSaveEdit = () => {
    if (editingIndex !== null && editData) {
      const newData = [...savedData]
      newData[editingIndex] = editData
      setSavedData(newData)
      localStorage.setItem('altTextHistory', JSON.stringify(newData))
      setEditingIndex(null)
      setEditData(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditData(null)
  }

  const handleDownload = (item: SavedData) => {
    const content = `File: ${item.fileName}
Generated: ${new Date(item.timestamp).toLocaleString()}
Prompt: ${item.altTextPrompt}
Variability: ${item.variability}%

Short Alt Text:
${item.shortAltText}

Long Alt Text:
${item.longAltText}
`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${item.fileName.replace(/\.[^/.]+$/, '')}_alt_text.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Saved Images</h1>
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors">
              <Plus className="h-4 w-4" />
              <span>New</span>
            </Link>
            <Link to="/saved" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors">
              <Star className="h-4 w-4" />
              <span>Saved</span>
            </Link>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-6 py-8">
        {savedData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No saved images yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Generate some alt text and save it to see it here!
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {savedData.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.fileName}</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(item)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(index)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Generated: {new Date(item.timestamp).toLocaleString()}</p>
                    <p>Size: {(item.fileSize / 1024).toFixed(1)} KB</p>
                    <p>Variability: {item.variability}%</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editingIndex === index ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Alt Text Prompt</Label>
                        <Textarea
                          value={editData?.altTextPrompt || ''}
                          onChange={(e) => setEditData(prev => prev ? { ...prev, altTextPrompt: e.target.value } : null)}
                          className="min-h-[60px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Short Alt Text</Label>
                        <Textarea
                          value={editData?.shortAltText || ''}
                          onChange={(e) => setEditData(prev => prev ? { ...prev, shortAltText: e.target.value } : null)}
                          className="min-h-[80px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Long Alt Text</Label>
                        <Textarea
                          value={editData?.longAltText || ''}
                          onChange={(e) => setEditData(prev => prev ? { ...prev, longAltText: e.target.value } : null)}
                          className="min-h-[120px]"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveEdit}>Save Changes</Button>
                        <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Prompt</Label>
                        <p className="text-sm mt-1 p-2 bg-muted rounded">{item.altTextPrompt}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Short Alt Text</Label>
                        <p className="text-sm mt-1 p-2 bg-muted rounded">{item.shortAltText}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Long Alt Text</Label>
                        <p className="text-sm mt-1 p-2 bg-muted rounded">{item.longAltText}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}