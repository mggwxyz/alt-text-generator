import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Plus, Star } from 'lucide-react'
import { Toaster } from '@/components/ui/sonner'
import { useState, useEffect } from 'react'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [savedCount, setSavedCount] = useState(0)

  useEffect(() => {
    const updateSavedCount = () => {
      const savedData = JSON.parse(localStorage.getItem('altTextHistory') || '[]')
      setSavedCount(savedData.length)
    }

    // Initial count
    updateSavedCount()

    // Listen for storage changes (when items are added/removed)
    window.addEventListener('storage', updateSavedCount)
    
    // Custom event for same-tab updates
    window.addEventListener('savedItemsChanged', updateSavedCount)

    return () => {
      window.removeEventListener('storage', updateSavedCount)
      window.removeEventListener('savedItemsChanged', updateSavedCount)
    }
  }, [])

  return (
    <div className="min-h-screen bg-blue-200">
      <nav className="border-b bg-white">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/favicon.png" alt="Alt Text Generator" className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Alt Text Generator</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>New</span>
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/saved" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>Saved</span>
                {savedCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full min-w-[1.25rem] text-center">
                    {savedCount}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-6 py-8">
        {children}
      </div>
      <Toaster />
    </div>
  )
}