interface IconProps {
  className?: string;
  size?: number;
}

export const CoffeeLogo = ({ className = '', size = 32 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <defs>
      <linearGradient id="coffeeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D4A574" />
        <stop offset="100%" stopColor="#8B5A2B" />
      </linearGradient>
      <linearGradient id="steamGradient" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#D4A574" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#D4A574" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d="M16 8C16 8 18 5 16 2" stroke="url(#steamGradient)" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 6C24 6 26 3 24 0" stroke="url(#steamGradient)" strokeWidth="2" strokeLinecap="round" />
    <path d="M32 8C32 8 34 5 32 2" stroke="url(#steamGradient)" strokeWidth="2" strokeLinecap="round" />
    <path d="M8 16H36V32C36 38.6274 30.6274 44 24 44H20C13.3726 44 8 38.6274 8 32V16Z" fill="url(#coffeeGradient)" stroke="#6B4423" strokeWidth="2" />
    <path d="M36 20H40C42.2091 20 44 21.7909 44 24V26C44 28.2091 42.2091 30 40 30H36" stroke="#6B4423" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M12 20V30" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const DashboardIcon = ({ className = '', size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="13" width="4" height="8" rx="1" fill="currentColor" opacity="0.6" />
    <rect x="10" y="9" width="4" height="12" rx="1" fill="currentColor" opacity="0.8" />
    <rect x="17" y="3" width="4" height="18" rx="1" fill="currentColor" />
    <path d="M5 9L10 6L15 8L20 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="5" cy="9" r="2" fill="currentColor" />
    <circle cx="10" cy="6" r="2" fill="currentColor" />
    <circle cx="15" cy="8" r="2" fill="currentColor" />
    <circle cx="20" cy="3" r="2" fill="currentColor" />
  </svg>
);

export const CategoriesIcon = ({ className = '', size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M2 6C2 4.89543 2.89543 4 4 4H8.17157C8.70201 4 9.21071 4.21071 9.58579 4.58579L10.4142 5.41421C10.7893 5.78929 11.298 6 11.8284 6H20C21.1046 6 22 6.89543 22 8V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6Z" fill="currentColor" opacity="0.3" />
    <path d="M4 5C4 3.89543 4.89543 3 6 3H9.17157C9.70201 3 10.2107 3.21071 10.5858 3.58579L11.4142 4.41421C11.7893 4.78929 12.298 5 12.8284 5H20C21.1046 5 22 5.89543 22 7V16C22 17.1046 21.1046 18 20 18H6C4.89543 18 4 17.1046 4 16V5Z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.6" />
    <path d="M6 4C6 2.89543 6.89543 2 8 2H11.1716C11.702 2 12.2107 2.21071 12.5858 2.58579L13.4142 3.41421C13.7893 3.78929 14.298 4 14.8284 4H20C21.1046 4 22 4.89543 22 6V14C22 15.1046 21.1046 16 20 16H8C6.89543 16 6 15.1046 6 14V4Z" fill="currentColor" />
  </svg>
);

export const ProductsIcon = ({ className = '', size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3C12 3 12 4 12 4.5C8 5 5 8.5 5 12H19C19 8.5 16 5 12 4.5C12 4 12 3 12 3Z" fill="currentColor" opacity="0.6" />
    <circle cx="12" cy="3" r="1.5" fill="currentColor" />
    <path d="M3 14H21V15C21 16.1046 20.1046 17 19 17H5C3.89543 17 3 16.1046 3 15V14Z" fill="currentColor" />
    <path d="M8 19H16V20C16 20.5523 15.5523 21 15 21H9C8.44772 21 8 20.5523 8 20V19Z" fill="currentColor" opacity="0.8" />
    <rect x="10" y="17" width="4" height="2" fill="currentColor" opacity="0.6" />
  </svg>
);

export const OrdersIcon = ({ className = '', size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6 2L4 4V22L6 20L8 22L10 20L12 22L14 20L16 22L18 20L20 22V4L18 2H6Z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <line x1="8" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="8" y1="15" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const TablesIcon = ({ className = '', size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <ellipse cx="12" cy="10" rx="10" ry="4" fill="currentColor" opacity="0.8" />
    <ellipse cx="12" cy="9" rx="7" ry="2" fill="currentColor" opacity="0.3" />
    <path d="M6 12V20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M18 12V20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M10 13V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    <path d="M14 13V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    <path d="M4 20H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 20H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const UserIcon = ({ className = '', size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="8" r="4" fill="currentColor" />
    <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V20Z" fill="currentColor" opacity="0.8" />
  </svg>
);

export const LogoutIcon = ({ className = '', size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M9 21H5C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
