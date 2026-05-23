import { Helmet } from 'react-helmet-async';

interface PageMetaProps {
  title: string;
  description?: string;
  /** Only set on the Home page for social sharing */
  og?: {
    title: string;
    description: string;
    image?: string; // defaults to /og-image.png
    url?: string;
    type?: 'website' | 'article';
  };
}

export function PageMeta({ title, description, og }: PageMetaProps) {
  const fullTitle = `${title} | Red de Bienestar Laboral`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={og?.title ?? title} />
      <meta property="og:description" content={og?.description ?? description ?? ''} />
      <meta property="og:image" content={og?.image ?? '/og-image.png'} />
      {og?.url && <meta property="og:url" content={og.url} />}
      <meta property="og:type" content={og?.type ?? 'website'} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
