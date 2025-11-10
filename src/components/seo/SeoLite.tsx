import { useEffect } from 'react';

type Props = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  noindex?: boolean;
};

function setTag(selector: string, create: () => HTMLElement, set: (el: HTMLElement) => void) {
  let el = document.head.querySelector(selector) as HTMLElement | null;
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  set(el);
  return () => {
    el?.parentElement?.removeChild(el);
  };
}

export default function SeoLite({
  title = 'abclinic.uz — семейная стоматология',
  description = 'Наследие трёх поколений, цифровая стоматология и минимализм в каждой детали.',
  url = 'https://abclinic.uz',
  image = 'https://abclinic.uz/images/logo.png',
  noindex = false,
}: Props) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    const cleanups: Array<() => void> = [];

    // description
    cleanups.push(
      setTag(
        'meta[name="description"]',
        () => {
          const m = document.createElement('meta');
          m.setAttribute('name', 'description');
          return m;
        },
        (el) => el.setAttribute('content', description)
      )
    );

    // robots
    cleanups.push(
      setTag(
        'meta[name="robots"]',
        () => {
          const m = document.createElement('meta');
          m.setAttribute('name', 'robots');
          return m;
        },
        (el) => el.setAttribute('content', noindex ? 'noindex, nofollow' : 'index, follow')
      )
    );

    // canonical
    cleanups.push(
      setTag(
        'link[rel="canonical"]',
        () => {
          const l = document.createElement('link');
          l.setAttribute('rel', 'canonical');
          return l;
        },
        (el) => el.setAttribute('href', url)
      )
    );

    // Open Graph
    const og = (p: string, v: string) =>
      setTag(
        `meta[property="${p}"]`,
        () => {
          const m = document.createElement('meta');
          m.setAttribute('property', p);
          return m;
        },
        (el) => el.setAttribute('content', v)
      );
    cleanups.push(og('og:type', 'website'));
    cleanups.push(og('og:title', title));
    cleanups.push(og('og:description', description));
    cleanups.push(og('og:url', url));
    cleanups.push(og('og:image', image));

    // Twitter
    const tw = (n: string, v: string) =>
      setTag(
        `meta[name="${n}"]`,
        () => {
          const m = document.createElement('meta');
          m.setAttribute('name', n);
          return m;
        },
        (el) => el.setAttribute('content', v)
      );
    cleanups.push(tw('twitter:card', 'summary_large_image'));
    cleanups.push(tw('twitter:title', title));
    cleanups.push(tw('twitter:description', description));
    cleanups.push(tw('twitter:image', image));

    return () => {
      document.title = prevTitle;
      cleanups.forEach((fn) => fn());
    };
  }, [title, description, url, image, noindex]);

  return null;
}
