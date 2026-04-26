import useViewport from '../hooks/useViewport'

const baseCardStyle = (item, clickable) => ({
  minHeight: item.large ? '240px' : '114px',
  borderRadius: item.large ? '28px' : '20px',
  padding: item.large ? '28px' : '18px',
  background: item.background,
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  position: 'relative',
  overflow: 'hidden',
  textAlign: 'left',
  width: '100%',
  cursor: clickable ? 'pointer' : 'default',
})

export default function FeaturedCard({ item, onAction }) {
  const { isMobile, isTabletOrBelow, isWide } = useViewport()
  const cardStyle = {
    ...baseCardStyle(item, Boolean(onAction) && !item.large),
    minHeight: item.large ? (isMobile ? '220px' : isWide ? '280px' : '240px') : isMobile ? '104px' : '114px',
    borderRadius: isTabletOrBelow ? '22px' : item.large ? '28px' : '20px',
    padding: item.large ? (isMobile ? '20px' : '28px') : isMobile ? '16px' : '18px',
  }

  if (!item.large && onAction) {
    return (
      <button type="button" style={cardStyle} onClick={onAction} aria-label={`Open ${item.title}`}>
        {item.badge ? (
          <span
            style={{
              alignSelf: 'flex-start',
              background: 'rgba(255,255,255,0.14)',
              padding: '6px 12px',
              borderRadius: '999px',
              fontSize: '11px',
              letterSpacing: '0.08em',
              fontWeight: 700,
              marginBottom: '12px',
            }}
          >
            {item.badge}
          </span>
        ) : null}
        <h2 style={{ fontSize: item.large ? (isMobile ? '28px' : isWide ? '40px' : '36px') : isMobile ? '18px' : '20px', marginBottom: '8px' }}>{item.title}</h2>
        <p style={{ maxWidth: '32ch', color: 'rgba(255,255,255,0.72)', marginBottom: item.large ? '18px' : 0 }}>
          {item.description}
        </p>
      </button>
    )
  }

  return (
    <div style={cardStyle}>
      {item.badge ? (
        <span
          style={{
            alignSelf: 'flex-start',
            background: 'rgba(255,255,255,0.14)',
            padding: '6px 12px',
            borderRadius: '999px',
            fontSize: '11px',
            letterSpacing: '0.08em',
            fontWeight: 700,
            marginBottom: '12px',
          }}
        >
          {item.badge}
        </span>
      ) : null}
      <h2 style={{ fontSize: item.large ? (isMobile ? '28px' : isWide ? '40px' : '36px') : isMobile ? '18px' : '20px', marginBottom: '8px' }}>{item.title}</h2>
      <p style={{ maxWidth: '32ch', color: 'rgba(255,255,255,0.72)', marginBottom: item.large ? '18px' : 0 }}>
        {item.description}
      </p>
      {item.large ? (
        <button
          type="button"
          style={{
            width: isMobile ? '100%' : 'fit-content',
            padding: '12px 18px',
            borderRadius: '999px',
            background: '#fff',
            color: 'var(--text)',
            fontWeight: 700,
            cursor: 'pointer',
          }}
          onClick={onAction}
        >
          Play Mix
        </button>
      ) : null}
    </div>
  )
}
