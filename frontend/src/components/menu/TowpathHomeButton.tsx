// src/components/menu/TowpathHomeButton.tsx
import { Link } from 'react-router-dom'

export default function TowpathHomeButton() {

  return (
    <div className="absolute top-4 left-4 z-10">
      <Link 
        to="/"
        className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center bg-component-navy hover:bg-component-navy-hover"
        aria-label="Return to home"
      >
        <span className="text-major-blue font-bold text-2xl">T</span>
      </Link>
    </div>
  )
}