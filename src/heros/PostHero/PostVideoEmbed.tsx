import React from 'react'

function getEmbedUrl(url: string): string | null {
  // YouTube: https://www.youtube.com/watch?v=ID or https://youtu.be/ID
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`

  // Vimeo: https://vimeo.com/ID
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`

  return null
}

export const PostVideoEmbed: React.FC<{ url: string }> = ({ url }) => {
  const embedUrl = getEmbedUrl(url)

  if (!embedUrl) return null

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted">
      <iframe
        src={embedUrl}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Video"
      />
    </div>
  )
}
