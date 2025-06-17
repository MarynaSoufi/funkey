'use client'

import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  disableClose?: boolean
}

export default function Modal({ isOpen, onClose, children, disableClose }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button
              onClick={onClose}
              disabled={disableClose}
              className={cn(
                'absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition',
                disableClose && 'opacity-50 cursor-not-allowed',
              )}
            >
              ✖
            </button>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
