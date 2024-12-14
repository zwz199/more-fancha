import Script from "next/script"
import { CONFIG } from "site.config"

const Scripts: React.FC = () => (
  <>
    {CONFIG?.googleAnalytics?.enable === true && (
      <>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${CONFIG.googleAnalytics.config.measurementId}`}
        />
        <Script strategy="lazyOnload" id="ga">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${CONFIG.googleAnalytics.config.measurementId}', {
              page_path: window.location.pathname,
            });`}
        </Script>
      </>
    )}
{CONFIG?.crisp?.enable === true && (
      <>
        <Script id="mycrisp">
        {`window.$crisp = [];
        window.CRISP_WEBSITE_ID = "6c078f6c-7060-473b-ab40-639c0817c1cb";
        (function() {
           d = document;
          s = d.createElement("script");
          s.src = "https://client.crisp.chat/l.js";
          s.async = true;
          d.getElementsByTagName("head")[0].appendChild(s);
        })();`}
        </Script>
      </>
    )}
    
  </>
)

export default Scripts
