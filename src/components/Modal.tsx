import { ReactNode, useEffect, useRef } from 'react'
import classes from '../styles/Modal.module.css'

export interface ModalProps {
  children: ReactNode
  open: boolean
  onClose: () => void
}

export default function Modal({ children, open, onClose }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current

    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  })

  useEffect(() => {
    const dialog = ref.current

    const handleCancel = (event) => {
      event.preventDefault()
      onClose()
    }

    dialog.addEventListener('cancel', handleCancel)
    return () => {
      dialog.removeEventListener('cancel', handleCancel)
    }
  })

  return (
    <dialog ref={ref} className={classes.modal}>
      <div className={classes.container}>
        <div className={classes.content}>{children}</div>
        <div className={classes.actions}>
          <button onClick={() => onClose()} className={classes['btn-close']}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  )
}
