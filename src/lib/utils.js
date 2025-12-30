import { clsx } from "clsx";

export function cn(...inputs) {
  return clsx(inputs);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function truncate(str, length) {
  return str.length > length ? str.substring(0, length) + "..." : str;
}

export const googleColors = {
  blue: {
    50: '#e3f2fd',
    100: '#bbdefb',
    500: '#2196f3',
    600: '#1976d2',
    700: '#1565c0',
  },
  red: {
    50: '#ffebee',
    100: '#ffcdd2',
    500: '#f44336',
    600: '#e53935',
    700: '#d32f2f',
  },
  green: {
    50: '#e8f5e8',
    100: '#c8e6c9',
    500: '#4caf50',
    600: '#43a047',
    700: '#388e3c',
  },
  yellow: {
    50: '#fffde7',
    100: '#fff9c4',
    500: '#ffeb3b',
    600: '#fdd835',
    700: '#f9a825',
  },
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  }
};