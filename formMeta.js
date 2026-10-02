// ═══════════════════════════════════════════════════
//  FORM TRACKING METADATA
// ═══════════════════════════════════════════════════

window.getParam = function (name) {
  return new URLSearchParams(window.location.search).get(name) || "";
};

window.buildTrackingFields = function (form) {
  return {
    utm_source: window.getParam("utm_source") || "Microsite",
    utm_medium: window.getParam("utm_medium") || "organic",
    utm_campaign: window.getParam("utm_campaign"),
    utm_term: window.getParam("utm_term"),
    utm_content: window.getParam("utm_content"),
    campaign_name: window.getParam("campaign_name"),
    adgroup_name: window.getParam("adgroup_name"),
    gclid: window.getParam("gclid"),
    gbraid: window.getParam("gbraid"),
    wbraid: window.getParam("wbraid"),

    google_campaign_id: window.getParam("google_campaign_id"),
    google_ad_group_id: window.getParam("google_ad_group_id"),
    google_ad_group_name: window.getParam("google_ad_group_name"),
    google_ad_id: window.getParam("google_ad_id"),
    google_wbraid: window.getParam("google_wbraid"),
    google_gbraid: window.getParam("google_gbraid"),
    google_keyword: window.getParam("google_keyword"),
    google_matchtype: window.getParam("google_matchtype"),
    google_network: window.getParam("google_network"),
    google_device: window.getParam("google_device"),
    google_gclid: window.getParam("google_gclid"),

    utm_campaign_id: window.getParam("utm_campaign_id"),
    utm_adgroup: window.getParam("utm_adgroup"),
    utm_adgroup_id: window.getParam("utm_adgroup_id"),
    utm_ad_id: window.getParam("utm_ad_id"),
    utm_keyword: window.getParam("utm_keyword"),
    utm_matchtype: window.getParam("utm_matchtype"),
    utm_network: window.getParam("utm_network"),
    utm_device: window.getParam("utm_device"),
    utm_gclid: window.getParam("utm_gclid"),
    utm_gbraid: window.getParam("utm_gbraid"),
    utm_wbraid: window.getParam("utm_wbraid"),

    SourceURL: window.location.href,
    landing_page: window.location.href,
    referrer: document.referrer || "",
    device: window.innerWidth < 768 ? "mobile" : "desktop",
    ip_address: form
      ? form.querySelector('[name="Ipaddress"]')?.value || ""
      : "",
    geo_city: "",
    geo_region: "",
    geo_postal: "",
    geo_country: "",
    website: "",
    projectId: window.PROJECT_ID,
    projectName: window.PROJECT_NAME,
    city: window.CITY_DISPLAY,
  };
};
