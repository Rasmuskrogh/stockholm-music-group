export interface VideoCardProps {
  composer: string;
  title: string;
  youtubeId: string;
}

export type SectionProps = {
  id?: string;
  children: React.ReactNode;
  className?: string;
};

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
}
