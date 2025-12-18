const BaseIcon = ({ size = 24, className = '', children }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
)

export const CircleIcon = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="9" />
  </BaseIcon>
)

export const CheckCircleIcon = (props) => (
  <BaseIcon {...props}>
    <path d="M9 12l2 2 4-4" />
    <circle cx="12" cy="12" r="9" />
  </BaseIcon>
)

export const XCircleIcon = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <line x1="9" y1="9" x2="15" y2="15" />
    <line x1="15" y1="9" x2="9" y2="15" />
  </BaseIcon>
)

export const ClockIcon = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 14" />
  </BaseIcon>
)

export const AlertCircleIcon = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </BaseIcon>
)

export const AwardIcon = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="8" r="5" />
    <path d="M8.5 13.5L7 22l5-3 5 3-1.5-8.5" />
  </BaseIcon>
)

export const ChevronRightIcon = (props) => (
  <BaseIcon {...props}>
    <polyline points="9 18 15 12 9 6" />
  </BaseIcon>
)

export const ChevronLeftIcon = (props) => (
  <BaseIcon {...props}>
    <polyline points="15 18 9 12 15 6" />
  </BaseIcon>
)
