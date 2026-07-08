"use client";

import { useEffect } from "react";
import { CONFIG } from "@/lib/constants";

/**
 * Loads the Cal.com embed so any element with a `data-cal-link` attribute
 * opens the booking calendar in a popup on this site. This is Cal.com's
 * official vanilla embed snippet — no npm dependency required.
 *
 * The calendar only appears once CONFIG.calLink is set to a real Cal.com
 * link (e.g. "tanuj-kakumani/mentoring"). Until then the booking buttons
 * still work as normal links to cal.com.
 */
export function CalEmbed() {
  useEffect(() => {
    if (!CONFIG.calLink || CONFIG.calLink.indexOf("your-cal-username") !== -1) {
      return;
    }
    const w = window as unknown as { Cal?: unknown };

    /* eslint-disable */
    (function (C: any, A: string, L: string) {
      const p = function (a: any, ar: any) {
        a.q.push(ar);
      };
      const d = C.document;
      C.Cal =
        C.Cal ||
        function () {
          const cal = C.Cal;
          const ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api: any = function () {
              p(api, arguments);
            };
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["initNamespace", namespace]);
            } else {
              p(cal, ar);
            }
            return;
          }
          p(cal, ar);
        };
    })(w, "https://app.cal.com/embed/embed.js", "init");

    (w.Cal as any)("init", { origin: "https://cal.com" });
    (w.Cal as any)("ui", {
      hideEventTypeDetails: false,
      layout: "month_view",
    });
    /* eslint-enable */
  }, []);

  return null;
}
