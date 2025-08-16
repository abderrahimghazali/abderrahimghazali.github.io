import { useEffect } from 'react'

interface SEOProps {
  title: string
  description: string
  keywords?: string
  url?: string
  image?: string
}

function SEO({ title, description, keywords, url, image }: SEOProps) {
  useEffect(() => {
    // Update title
    document.title = title

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name'
      let meta = document.querySelector(`meta[${attribute}="${name}"]`)
      
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attribute, name)
        document.head.appendChild(meta)
      }
      
      meta.setAttribute('content', content)
    }

    // Basic meta tags
    updateMetaTag('description', description)
    if (keywords) updateMetaTag('keywords', keywords)

    // Open Graph tags
    updateMetaTag('og:title', title, true)
    updateMetaTag('og:description', description, true)
    updateMetaTag('og:type', 'website', true)
    if (url) updateMetaTag('og:url', url, true)
    if (image) updateMetaTag('og:image', image, true)

    // Twitter Card tags
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    if (image) updateMetaTag('twitter:image', image)

    // Canonical URL
    if (url) {
      let canonical = document.querySelector('link[rel="canonical"]')
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.setAttribute('rel', 'canonical')
        document.head.appendChild(canonical)
      }
      canonical.setAttribute('href', url)
    }
  }, [title, description, keywords, url, image])

  return null // This component doesn't render anything
}

export default SEO