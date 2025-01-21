import { toast } from "react-toastify";

export const formattingStrings = (message: string, isReg = true, isBr = false) => {
  const regex = /(?!s)<[^>]*>(\\s*<[^>]*>)*/gm;
  let text = message?.replace(/<head>[\s\S]*?<\/head>/gi, "");

  if (isBr) {
    text = text.replace(/<br>/gm, "\n");
  }
  if (isReg) {
    text = text.replace(regex, "");
  }

  return text;
};

const secsInMinut = 60;
const secsInHour = 60 * secsInMinut;
const secsInDay = secsInHour * 24;

export const getVisitDuration = (secs: number) => {
  const d = Math.floor(secs / secsInDay);
  secs = secs - d * secsInDay;

  const h = Math.floor(secs / secsInHour);
  secs = secs - h * secsInHour;

  const m = Math.floor(secs / secsInMinut);
  secs = secs - m * secsInMinut;

  let res = "";

  if (d) {
    res = `${d} days`;
    if (h) res += ` ${h} hours`;
    return res;
  }

  if (h) {
    res = `${h} hours`;
    if (m) res += ` ${m} minutes`;
    return res;
  }

  if (m) {
    res = `${m} minutes`;
    if (secs) res += ` ${secs} seconds`;
    return res;
  }

  return `${secs} seconds`;
};

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text ?? "");
  toast.success("Successfully copied to Clipboard!");
};

export const domainPattern =
  /\b((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}\b/;

export const validateDomain = (domain: string) => {
  if (!domain) return "Domain is required";
  if (!domain.match(domainPattern)) return "Domain is not valid";
  return "";
};

export const getCode = (token: string) => {
  return `<script async>
  (function(w, d) {
    d.addEventListener("DOMContentLoaded", function () {
      var token = "${token}";
      var script = d.createElement('script');
      script.async = true;
      script.src = "https://track.saleshub.ai/assets/for-cache.min.js?authorization=${token}";
      script.onload = function () {
        w.salesToolsObserverCached(token);
      };
      d.body.appendChild(script);
    })
  })(window, document)
</script>`;
};
