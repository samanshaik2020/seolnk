'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Copy, Check } from 'lucide-react'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [generatedUrl, setGeneratedUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      imageUrl: formData.get('imageUrl'),
      originalUrl: formData.get('originalUrl'),
    }

    try {
      const res = await fetch('/api/create', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })
      const json = await res.json()
      if (json.slug) {
        setGeneratedUrl(`${window.location.origin}/p/${json.slug}`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Link Preview</CardTitle>
          <CardDescription>Customize how your link looks on social media.</CardDescription>
        </CardHeader>
        <CardContent>
          {!generatedUrl ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="Enter title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalUrl">Original URL (Redirect Target)</Label>
                <Input id="originalUrl" name="originalUrl" placeholder="https://your-original-link.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Enter description" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" name="imageUrl" placeholder="https://example.com/image.jpg" required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Link
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 text-green-700 rounded-md">
                Link created successfully!
              </div>
              <div className="flex items-center space-x-2">
                <Input value={generatedUrl} readOnly />
                <Button size="icon" variant="outline" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <Button variant="ghost" className="w-full" onClick={() => setGeneratedUrl('')}>
                Create Another
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
