import * as React from 'react';

export interface ButtonProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: 'primary' | 'outline';
  icon?: boolean;
  options?: React.ReactNode;
}

export function Button({ className, type, icon, ...props }: ButtonProps) {
  let buttonClass = `button ${className ? ' ' + className : ''}`;
  if (type) {
    buttonClass += ` button--${type}`;
  }

  if (icon) {
    buttonClass += ' button--icon';
  }

  return <button type="button" className={buttonClass} {...props} />;
}
