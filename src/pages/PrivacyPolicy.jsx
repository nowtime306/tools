import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import './PrivacyPolicy.css'

function PrivacyPolicy() {
  const { t, language } = useLanguage()
  const [content, setContent] = useState('')

  useEffect(() => {
    // 读取 privacy 文件内容
    fetch('/privacy')
      .then((response) => response.text())
      .then((text) => setContent(text))
      .catch((err) => {
        console.error('Failed to load privacy policy:', err)
        setContent('Privacy Policy content could not be loaded.')
      })
  }, [])

  // 将文本内容转换为段落
  const formatContent = (text) => {
    if (!text) return []
    
    const lines = text.split('\n')
    const paragraphs = []
    let currentParagraph = []
    
    lines.forEach((line) => {
      const trimmedLine = line.trim()
      
      if (!trimmedLine) {
        // 空行，结束当前段落
        if (currentParagraph.length > 0) {
          paragraphs.push({ type: 'paragraph', content: currentParagraph.join(' ') })
          currentParagraph = []
        }
        return
      }
      
      // 判断是否是标题（全大写且较短，或特定格式）
      const isHeading = 
        (trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length < 60 && trimmedLine.length > 2) ||
        (trimmedLine.length < 50 && /^[A-Z][a-zA-Z\s]+$/.test(trimmedLine) && !trimmedLine.includes('.'))
      
      if (isHeading) {
        // 先保存当前段落
        if (currentParagraph.length > 0) {
          paragraphs.push({ type: 'paragraph', content: currentParagraph.join(' ') })
          currentParagraph = []
        }
        paragraphs.push({ type: 'heading', content: trimmedLine })
      } else {
        currentParagraph.push(trimmedLine)
      }
    })
    
    // 保存最后一个段落
    if (currentParagraph.length > 0) {
      paragraphs.push({ type: 'paragraph', content: currentParagraph.join(' ') })
    }
    
    return paragraphs
  }

  const formattedContent = formatContent(content)

  // 格式化日期
  const formatDate = (date) => {
    const localeMap = {
      en: 'en-US',
      es: 'es-ES',
      pt: 'pt-BR',
      hi: 'hi-IN',
      id: 'id-ID',
      ar: 'ar-SA',
    }
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    const locale = localeMap[language] || 'en-US'
    return date.toLocaleDateString(locale, options)
  }

  // 设置日期（可以使用固定日期或当前日期）
  const policyDate = new Date('2024-01-01')

  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <div className="privacy-header">
          <Link to="/" className="back-link">
            ← {t('backToHome') || 'Back to Home'}
          </Link>
          <h1 className="privacy-title">Privacy Policy</h1>
          <div className="privacy-date">
            <div className="written-by">{t('writtenBy') || 'Written by'}</div>
            <div className="date-text">{t('onDate') || 'on'} {formatDate(policyDate)}</div>
          </div>
        </div>
        
        <div className="privacy-content">
          {formattedContent.length > 0 ? (
            formattedContent.map((item, index) => {
              if (item.type === 'heading') {
                return (
                  <h2 key={index} className="privacy-heading">
                    {item.content}
                  </h2>
                )
              } else {
                // 处理链接
                const parts = item.content.split(/(https?:\/\/[^\s]+)/g)
                return (
                  <p key={index} className="privacy-paragraph">
                    {parts.map((part, i) => {
                      if (part.match(/^https?:\/\//)) {
                        return (
                          <a
                            key={i}
                            href={part}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="privacy-link"
                          >
                            {part}
                          </a>
                        )
                      }
                      return part
                    })}
                  </p>
                )
              }
            })
          ) : (
            <p>Loading privacy policy...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy

