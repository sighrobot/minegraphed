import { formatDistance } from "date-fns";

export const formatCm = (n) =>
  n >= 1e5
    ? `${Math.round(parseFloat((n / 1e5).toFixed(1)))} km`
    : n >= 100
    ? `${Math.round(n / 100)} m`
    : `${n} cm`;

export const formatTime = (n) => {
  return formatDistance(0, n * 60)
    .replace(/about /g, "")
    .replace("less than a minute", " 1 m")
    .replace("day", "d")
    .replace("minute", "m")
    .replace("hour", "h")
    .replace("s", "");
};
