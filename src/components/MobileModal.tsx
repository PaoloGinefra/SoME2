import { useEffect, useState } from 'react'
import Modal from './Modal'

const MEDIA_QUERY = '(max-width : 800px)'

export default function MobileModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const mediaQueryList = window.matchMedia(MEDIA_QUERY)
    if (mediaQueryList.matches) {
      setOpen(true)
    }
  }, [])

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <p>
        Hi, it looks like you are using a mobile device (or at least a device
        with a screen that isn&apos;t very wide); this website is best viewed on
        a PC.
      </p>
    </Modal>
  )
}
