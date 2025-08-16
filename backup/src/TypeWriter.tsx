import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface TypeWriterProps {
  text: string
  className?: string
  speed?: number
  delay?: number
}

function TypeWriter({ text, className = '', speed = 100, delay = 0 }: TypeWriterProps) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      } else {
        // Hide cursor after typing is complete
        setTimeout(() => setShowCursor(false), 1000)
      }
    }, currentIndex === 0 ? delay : speed)

    return () => clearTimeout(timer)
  }, [currentIndex, text, speed, delay])

  // Cursor blinking effect
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => clearInterval(cursorTimer)
  }, [])

  return (
    <motion.h1 
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayText}
      {currentIndex <= text.length && (
        <motion.span
          animate={{ opacity: showCursor ? 1 : 0 }}
          transition={{ duration: 0.1 }}
          className="text-custom-gray"
        >
          |
        </motion.span>
      )}
    </motion.h1>
  )
}

export default TypeWriter