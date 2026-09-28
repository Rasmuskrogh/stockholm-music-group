/** Accepts a bare video ID or any common YouTube URL and returns the ID. */
export function youtubeIdFrom(input: string): string {
  const value = input.trim();
  const match = value.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
  return match ? match[1] : value;
}
