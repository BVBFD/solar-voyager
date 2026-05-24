import { useTranslation } from 'react-i18next'

export function LoadingScreen({ message }) {
  const { t } = useTranslation()

  return (
    <div className="loading-screen" role="status">
      {message ?? t('loadingScreen.message')}
    </div>
  )
}
