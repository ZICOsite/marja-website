import React from 'react'

type DynamicTitleProps = {
  as?: React.ElementType
  children: React.ReactNode
  className?: string
}

export const DynamicTitle: React.FC<DynamicTitleProps> = ({
  as: Component = 'h2',
  children,
  className,
}) => {
  return <Component className={className}>{children}</Component>
}
