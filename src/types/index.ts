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
