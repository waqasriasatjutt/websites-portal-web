import type { SiteConfig } from '@/lib/odoo';

/**
 * Renders site-level analytics + verification scripts.
 * Inserted near </body> to avoid blocking initial render.
 */
export default function SiteScripts({ site }: { site: SiteConfig }) {
  return (
    <>
      {site.ga4 && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${site.ga4}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${site.ga4}', { anonymize_ip: true });`,
            }}
          />
        </>
      )}

      {site.adsense_publisher_id && site.adsense_auto_ads && (
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${site.adsense_publisher_id}`}
          crossOrigin="anonymous"
        />
      )}

      {site.fb_pixel_id && (
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${site.fb_pixel_id}');fbq('track', 'PageView');`,
          }}
        />
      )}
    </>
  );
}
