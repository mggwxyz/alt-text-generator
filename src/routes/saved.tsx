import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Trash2, Download, Edit, Copy, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/saved')({
  component: SavedImages,
})

interface SavedData {
  fileName: string
  fileSize: number
  altTextPrompt: string
  shortAltText: string
  longAltText: string
  timestamp: string
  imageData?: string // Optional for backward compatibility
}

function SavedImages() {
  const [savedData, setSavedData] = useState<SavedData[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editData, setEditData] = useState<SavedData | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('altTextHistory') || '[]')
    setSavedData(data)
  }, [])

  const handleDelete = (index: number) => {
    const newData = savedData.filter((_, i) => i !== index)
    setSavedData(newData)
    localStorage.setItem('altTextHistory', JSON.stringify(newData))
    
    // Dispatch custom event to update count
    window.dispatchEvent(new CustomEvent('savedItemsChanged'))
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
      
      // Dispatch custom event to update count (though count doesn't change, other data might)
      window.dispatchEvent(new CustomEvent('savedItemsChanged'))
      
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

  const handleCopyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Text copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy text:', err)
      toast.error('Failed to copy text to clipboard')
    }
  }

  const confirmDeleteAll = () => {
    setSavedData([])
    localStorage.setItem('altTextHistory', JSON.stringify([]))
    
    // Dispatch custom event to update count
    window.dispatchEvent(new CustomEvent('savedItemsChanged'))
    
    toast.success('All saved images deleted')
    setIsDeleteDialogOpen(false)
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Saved Images</h1>
          {savedData.length > 0 && (
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Delete All
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete All Saved Images?</DialogTitle>
                  <DialogDescription>
                    This will permanently delete all {savedData.length} saved images and their alt text. 
                    This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={confirmDeleteAll}>
                    Delete All
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {savedData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No saved images yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Generate some alt text and save it to see it here!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedData.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                {item.imageData && (
                  <div className="aspect-video relative">
                    <img
                      src={item.imageData}
                      alt={item.fileName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm font-medium truncate" title={item.fileName}>
                      {item.fileName}
                    </CardTitle>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(item)}
                        className="h-6 w-6 p-0"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(index)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(index)}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {editingIndex === index ? (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Alt Text Prompt</Label>
                        <Textarea
                          value={editData?.altTextPrompt || ''}
                          onChange={(e) => setEditData(prev => prev ? { ...prev, altTextPrompt: e.target.value } : null)}
                          className="min-h-[50px] text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Short Alt Text</Label>
                        <Textarea
                          value={editData?.shortAltText || ''}
                          onChange={(e) => setEditData(prev => prev ? { ...prev, shortAltText: e.target.value } : null)}
                          className="min-h-[60px] text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Long Alt Text</Label>
                        <Textarea
                          value={editData?.longAltText || ''}
                          onChange={(e) => setEditData(prev => prev ? { ...prev, longAltText: e.target.value } : null)}
                          className="min-h-[80px] text-xs"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>Save</Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground">Prompt</Label>
                        <p className="text-xs mt-1 p-2 bg-muted/50 rounded text-muted-foreground line-clamp-2">{item.altTextPrompt}</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-medium">Short Alt Text</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyText(item.shortAltText)}
                            className="h-5 w-5 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs mt-1 p-2 bg-muted/50 rounded line-clamp-3">{item.shortAltText}</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-medium">Long Alt Text</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyText(item.longAltText)}
                            className="h-5 w-5 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs mt-1 p-2 bg-muted/50 rounded line-clamp-4">{item.longAltText}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}