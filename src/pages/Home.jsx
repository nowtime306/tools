import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import '../App.css'

function Home() {
  const { t, language, setLanguage, languageNames } = useLanguage()
  const [url, setUrl] = useState('')
  const [videoId, setVideoId] = useState('')
  const [error, setError] = useState('')
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const languageMenuRef = useRef(null)

  // YouTube URL 格式支持：
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - https://m.youtube.com/watch?v=VIDEO_ID
  const extractVideoId = (url) => {
    if (!url) return null

    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|m\.youtube\.com\/watch\?v=)([^&\n?#]+)/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }

    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    // 如果输入为空，不做处理
    if (!url || !url.trim()) {
      return
    }
    
    const id = extractVideoId(url)
    if (id) {
      setVideoId(id)
    } else {
      setError(t('errorInvalidUrl'))
    }
  }

  const thumbnailSizes = [
    {
      name: t('thumbnailMaxRes'),
      url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      size: '1280x720',
      width: 1280,
      height: 720,
    },
    {
      name: t('thumbnailSD'),
      url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      size: '640x480',
      width: 640,
      height: 480,
    },
    {
      name: t('thumbnailHigh'),
      url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      size: '480x360',
      width: 480,
      height: 360,
    },
    {
      name: t('thumbnailMedium'),
      url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      size: '320x180',
      width: 320,
      height: 180,
    },
    {
      name: t('thumbnailDefault'),
      url: `https://img.youtube.com/vi/${videoId}/default.jpg`,
      size: '120x90',
      width: 120,
      height: 90,
    },
  ]

  const downloadImage = (imageUrl, filename) => {
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      })
      .catch((err) => {
        console.error('Download failed:', err)
        setError(t('errorDownloadFailed'))
      })
  }

  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    setShowLanguageMenu(false)
  }

  // 点击外部关闭语言菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setShowLanguageMenu(false)
      }
    }

    if (showLanguageMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showLanguageMenu])

  return (
    <div className="app" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container">
        <div className="header">
          <h1 className="title">{t('title')}</h1>
          <div className="header-right">
            <div className="language-selector" ref={languageMenuRef}>
              <button
                className="language-button"
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              >
                {languageNames[language]}
                <span className={`language-arrow ${showLanguageMenu ? 'open' : ''}`}>▼</span>
              </button>
              {showLanguageMenu && (
                <div className="language-menu">
                  {Object.entries(languageNames).map(([code, name]) => (
                    <button
                      key={code}
                      className={`language-option ${language === code ? 'active' : ''}`}
                      onClick={() => handleLanguageChange(code)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Link to="/privacy" className="privacy-link-header">
              {t('privacyPolicy') || 'Privacy Policy'}
            </Link>
          </div>
        </div>
        <p className="subtitle">{t('subtitle')}</p>

        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t('inputPlaceholder')}
              className="input"
            />
            <button type="submit" className="button">
              {t('getThumbnailButton')}
            </button>
          </div>
          {error && <div className="error">{error}</div>}
        </form>

        {videoId && (
          <div className="thumbnails-container">
            <div className="thumbnails-grid">
              {thumbnailSizes.map((thumbnail, index) => (
                <div key={index} className="thumbnail-card">
                  <div className="thumbnail-info">
                    <h3>{thumbnail.name} ({thumbnail.size})</h3>
                  </div>
                  <div 
                    className="thumbnail-image-container"
                    style={{
                      aspectRatio: `${thumbnail.width} / ${thumbnail.height}`,
                      width: `${thumbnail.width}px`,
                      maxWidth: '100%'
                    }}
                  >
                    <img
                      src={thumbnail.url}
                      alt={`${t('thumbnailDefault')} ${thumbnail.size}`}
                      className="thumbnail-image"
                      width={thumbnail.width}
                      height={thumbnail.height}
                      style={{
                        width: '100%',
                        height: 'auto'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'block'
                      }}
                    />
                    <div className="thumbnail-error" style={{ display: 'none' }}>
                      {t('imageNotAvailable')}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      downloadImage(
                        thumbnail.url,
                        `youtube-thumbnail-${videoId}-${thumbnail.size}.jpg`
                      )
                    }
                    className="download-button"
                  >
                    {t('downloadButton')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home

