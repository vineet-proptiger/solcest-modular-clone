/* =========================================
   RS LEAD – FULL PRODUCTION SCRIPT
========================================= */

/* =========================================
   30-DAY FRONTEND BLOCK (UX LEVEL)
========================================= */
// const RS_BLOCK_KEY = "rs_lead_block";
// const RS_BLOCK_DAYS = 30;

// function rsIsBlocked() {
//   const record = localStorage.getItem(RS_BLOCK_KEY);
//   if (!record) return false;

//   const data = JSON.parse(record);
//   const expiry = data.time + (RS_BLOCK_DAYS * 24 * 60 * 60 * 1000);

//   if (Date.now() > expiry) {
//     localStorage.removeItem(RS_BLOCK_KEY);
//     return false;
//   }

//   return true;
// }

// function rsBlockNow(phone) {
//   localStorage.setItem(RS_BLOCK_KEY, JSON.stringify({
//     phone: phone,
//     time: Date.now()
//   }));
// }

/* =========================================
   TEST MODE OVERRIDE
========================================= */

// const RS_TEST_MODE = (
//   window.location.search.includes('test=true') ||
//   window.location.hash.includes('test=true')
// );

/* =========================================
   AUTO POPULATE UTM (QUERY + HASH SUPPORT)
========================================= */

(function () {
  let params = new URLSearchParams(window.location.search);

  /* ======================================
     EXTRACT UTM FROM HASH IF PRESENT
  ====================================== */
  if (window.location.hash.includes("?")) {
    const hashPart = window.location.hash.split("?")[1];
    const hashParams = new URLSearchParams(hashPart);

    hashParams.forEach((value, key) => {
      params.set(key, value); // merge hash params into main params
    });
  }

  const fields = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "utm_assetgroupid",
    "campaign_name",
    "campaign_type",
    "asset_group",
    "content_name",
    "adgroup_name",
    "gclid",
    "gbraid",
    "wbraid",
    "fbclid",
    "device",
  ];

  document.querySelectorAll("form.rs-lead-form").forEach((form) => {
    fields.forEach((name) => {
      const input = form.querySelector(`[name="${name}"]`);
      if (input && params.get(name)) {
        input.value = params.get(name);
      }
    });

    const ref = form.querySelector('[name="referrer"]');
    if (ref) ref.value = document.referrer || "direct";

    const lp = form.querySelector('[name="landing_page"]');
    if (lp) lp.value = window.location.href;
  });
})();

/* =========================================
   FETCH USER IP
========================================= */

fetch("https://api.ipify.org?format=json")
  .then((res) => res.json())
  .then((data) => {
    document
      .querySelectorAll('[name="Ipaddress"]')
      .forEach((i) => (i.value = data.ip));
  })
  .catch(() => {});

/* =========================================
   LIVE VALIDATION RESET
========================================= */

document.addEventListener("input", function (e) {
  const form = e.target.closest("form.rs-lead-form");
  if (!form) return;

  // Real-time Phone Validation (Next.js replica)
  if (e.target.name === "phone") {
    // Remove all non-digits
    let val = e.target.value.replace(/\D/g, "");
    // Slice to max 10 digits
    if (val.length > 10) val = val.slice(0, 10);
    e.target.value = val;
  }

  e.target.setCustomValidity("");
  e.target.classList.remove("is-invalid");

  const msgBox = form.querySelector("[data-form-message]");
  if (msgBox) msgBox.innerHTML = "";
});

/* =========================================
   MAIN SUBMIT HANDLER
========================================= */

function RSLeadSubmit(form, event) {
  event.preventDefault();

  const msgBox = form.querySelector("[data-form-message]");
  const btn = form.querySelector('button[type="submit"]');

  msgBox.innerHTML = "";

  const name = form.querySelector('[name="fullname"]');
  const email = form.querySelector('[name="email"]');
  const phone = form.querySelector('[name="phone"]');

  const fakeNumberPattern = /^(\d)\1{9}$/;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

  let valid = true;

  /* ---------- NAME ---------- */
  if (!name.value.trim() || !/^[A-Za-z\s]+$/.test(name.value)) {
    name.setCustomValidity("Please enter valid name");
    name.classList.add("is-invalid");
    valid = false;
  }

  /* ---------- EMAIL ---------- */
  if (!email.value.trim() || !emailPattern.test(email.value)) {
    email.setCustomValidity("Please enter valid email");
    email.classList.add("is-invalid");
    valid = false;
  }

  /* ---------- PHONE ---------- */
  if (
    !phone.value.trim() ||
    !/^[6-9][0-9]{9}$/.test(phone.value) ||
    fakeNumberPattern.test(phone.value)
  ) {
    phone.setCustomValidity("Please enter valid 10-digit mobile number");
    phone.classList.add("is-invalid");
    valid = false;
  }

  if (!valid) {
    form.reportValidity();
    return false;
  }

  /* ---------- LOCK BUTTON ---------- */
  btn.disabled = true;

  /* ---------- PREPARE TRACKING DATA ---------- */
  const payload = new FormData(form);
  const trackingData = window.buildTrackingFields(form);

  /* ---------- EXACT NEXT.JS SHEET PAYLOAD MATCH ---------- */
  const fullNameStr = (name.value || "").trim();
  const nameParts = fullNameStr.split(/\s+/);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const sheetPayload = new URLSearchParams({
    secret: window.SECRET_KEY,
    ProjectID: window.PROJECT_ID,
    ProjectName: window.PROJECT_NAME,
    FullName: fullNameStr,
    FirstName: firstName,
    LastName: lastName,
    Email: email.value.trim(),
    Mobile: phone.value.trim(),
    Comments: payload.get("comments") || "",

    utm_source: trackingData.utm_source,
    utm_medium: trackingData.utm_medium,
    utm_campaign: trackingData.utm_campaign,
    utm_term: trackingData.utm_term,
    utm_content: trackingData.utm_content,

    gclid: trackingData.gclid,
    gbraid: trackingData.gbraid,
    wbraid: trackingData.wbraid,

    google_campaign_id: trackingData.google_campaign_id,
    google_ad_group_id: trackingData.google_ad_group_id,
    google_ad_group_name: trackingData.google_ad_group_name,
    google_ad_id: trackingData.google_ad_id,
    google_wbraid: trackingData.google_wbraid,
    google_gbraid: trackingData.google_gbraid,
    google_keyword: trackingData.google_keyword,
    google_matchtype: trackingData.google_matchtype,
    google_network: trackingData.google_network,
    google_device: trackingData.google_device,
    google_gclid: trackingData.google_gclid,

    utm_campaign_id: trackingData.utm_campaign_id,
    utm_adgroup: trackingData.utm_adgroup,
    utm_adgroup_id: trackingData.utm_adgroup_id,
    utm_ad_id: trackingData.utm_ad_id,
    utm_keyword: trackingData.utm_keyword,
    utm_matchtype: trackingData.utm_matchtype,
    utm_network: trackingData.utm_network,
    utm_device: trackingData.utm_device,
    utm_gclid: trackingData.utm_gclid,
    utm_gbraid: trackingData.utm_gbraid,
    utm_wbraid: trackingData.utm_wbraid,

    SourceURL: trackingData.SourceURL,
    landing_page: trackingData.landing_page,

    Device: trackingData.device,
    Referrer: trackingData.referrer,
    IpAddress: trackingData.ip_address,
    FormName: payload.get("form_name") || window.PROJECT_NAME,
    ProjectCity: window.CITY_DISPLAY,
    sheet_name: window.SHEET_NAME,
  });

  /* ---------- SUBMIT ---------- */
  fetch(window.SHEET_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: sheetPayload.toString(),
    cache: "no-store",
  })
    .then((res) => res.json())
    .then((res) => {
      if (res || res.status === true || res.result === "success") {
        // Update GCLID Count on Success
        if (form._gclid) {
          const newCount = form._currentCount + 1;
          document.cookie = `lead_trk_${window.PROJECT_ID}_${form._gclid}=${newCount}; max-age=2592000; path=/`;

          let lsData = form._lsData || {};
          lsData[form._gclid] = {
            count: newCount,
            firstSeen:
              lsData[form._gclid] && lsData[form._gclid].firstSeen
                ? lsData[form._gclid].firstSeen
                : Date.now(),
          };
          localStorage.setItem(form._lsKey, JSON.stringify(lsData));
        }

        window.dataLayer = window.dataLayer || [];

        const [firstName, ...last] = name.value.trim().split(" ");
        const lastName = last.join(" ");

        window.dataLayer.push({
          event: "lead_submit_success",
          form_name: form.querySelector('[name="form_name"]')?.value || "",
          user_data: {
            email: email.value.trim(),
            phone: phone.value.trim(),
            first_name: firstName || "",
            last_name: lastName || "",
          },
        });

        form.reset();

        msgBox.innerHTML = `
        <div class="alert alert-success mt-3">
          ✅ Thank you! Our team will contact you shortly.
        </div>
      `;

        btn.innerHTML = "Submitted ✔";
        btn.disabled = true;
      } else {
        throw new Error(res.msg || "Submission failed");
      }
    })
    .catch((error) => {
      msgBox.innerHTML = `
      <div class="alert alert-danger mt-3">
        ❌ Submission failed. Please try again.
      </div>
    `;

      btn.disabled = false;
      console.error("Submission error:", error);
    });

  return false;
}
