function Spinner({ size = 'md' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  }

  return (
    <div
      className={`${sizes[size]} animate-spin rounded-full border-2 border-gray-200 border-t-blue-600`}
      role="status"
      aria-label="Loading"
    />
  )
}

export default Spinner