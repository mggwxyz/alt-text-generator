import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Plus, Star, Github } from 'lucide-react'
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
            <h1 className="text-xl sm:text-2xl font-bold">Alt Text Generator</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 ">
            <Button variant="outline" size="icon" className="sm:hidden" asChild>
              <Link to="/">
                <Plus className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="hidden sm:flex" asChild>
              <Link to="/" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>New</span>
              </Link>
            </Button>
            
            <Button variant="outline" size="icon" className="sm:hidden" asChild>
              <Link to="/saved" className="relative">
                <Star className="h-4 w-4" />
                {savedCount > 0 && (
                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full min-w-[1.25rem] text-center">
                    {savedCount}
                  </span>
                )}
              </Link>
            </Button>
            <Button variant="outline" className="hidden sm:flex" asChild>
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
            
            <Button variant="outline" size="icon" asChild>
              <a href="https://github.com/mggwxyz/alt-text-generator" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </a>
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