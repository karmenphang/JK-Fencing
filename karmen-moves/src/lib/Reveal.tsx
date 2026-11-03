import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

/** Gentle fade and lift on enter. Static when reduced motion is on. */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'li' | 'article' | 'p' | 'h2'
}) {
  const reduce = useReducedMotion()
  const M = motion[as]
  if (reduce) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  )
}
