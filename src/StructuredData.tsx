import { useEffect } from 'react'

interface PersonData {
  name: string
  jobTitle: string
  description: string
  url: string
  sameAs: string[]
}

function StructuredData({ name, jobTitle, description, url, sameAs }: PersonData) {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": name,
      "jobTitle": jobTitle,
      "description": description,
      "url": url,
      "sameAs": sameAs,
      "knowsAbout": [
        "AI Agent Development",
        "Custom AI Agents",
        "LangChain Integration", 
        "Workflow Automation",
        "Intelligent Automation",
        "Drupal Development",
        "Enterprise Drupal",
        "AI Workflow Solutions",
        "Custom Automation Development",
        "NextJS",
        "React",
        "DevOps",
        "Full-stack Development"
      ],
      "offers": [
        {
          "@type": "Service",
          "name": "AI Agent Development",
          "description": "Custom AI agent development for workflow automation and business process optimization"
        },
        {
          "@type": "Service", 
          "name": "Drupal Development",
          "description": "Enterprise Drupal development and custom module creation"
        },
        {
          "@type": "Service",
          "name": "LangChain Integration",
          "description": "Expert LangChain implementation for intelligent automation systems"
        },
        {
          "@type": "Service",
          "name": "Workflow Automation",
          "description": "Custom workflow automation solutions that reduce manual work by 80%"
        }
      ],
      "hasOccupation": {
        "@type": "Occupation",
        "name": "Full-stack Developer",
        "description": "Specializing in Drupal, AI agents, and modern web technologies"
      }
    }

    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]')
    if (existingScript) {
      existingScript.remove()
    }

    // Add new structured data
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(structuredData)
    document.head.appendChild(script)

    return () => {
      // Cleanup on unmount
      const scriptToRemove = document.querySelector('script[type="application/ld+json"]')
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [name, jobTitle, description, url, sameAs])

  return null
}

export default StructuredData