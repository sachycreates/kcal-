export function getTheme() {
  if (typeof window === 'undefined') return 'light'
  return localStorage.getItem('kcal-theme') || 'light'
}

export function setTheme(theme: 'light' | 'dark') {
  localStorage.setItem('kcal-theme', theme)
  document.documentElement.setAttribute('data-theme', theme)
}

export const light = {
  bg: '#F8F5EF',
  surface: '#FFFFFF',
  border: '#E8E0D4',
  textPrimary: '#5B4636',
  textSecondary: '#9A8B7A',
  textTertiary: '#C4B8A8',
  accent: '#FFB38A',
  accentDark: '#E8956A',
  accentText: '#5B4636',
  sage: '#8EA889',
  navBg: '#FFFFFF',
  navBorder: '#E8E0D4',
  inputBg: '#FFFFFF',
  skeleton1: '#EDE8E0',
  skeleton2: '#E4DDD4',
  danger: '#E07070',
  dangerBg: '#FDF0F0',
  dangerBorder: '#F0C8C8',
}

export const dark = {
  bg: '#0E0C0A',
  surface: '#161310',
  border: '#252118',
  textPrimary: '#F0EBE4',
  textSecondary: '#7A6F65',
  textTertiary: '#3A3028',
  accent: '#C8714A',
  accentDark: '#B5623D',
  accentText: '#FFFFFF',
  sage: '#7A9E72',
  navBg: '#0E0C0A',
  navBorder: '#1E1B18',
  inputBg: '#0E0C0A',
  skeleton1: '#1E1B18',
  skeleton2: '#252118',
  danger: '#9A5252',
  dangerBg: '#1E1010',
  dangerBorder: '#3A1A1A',
}

export type Theme = typeof light