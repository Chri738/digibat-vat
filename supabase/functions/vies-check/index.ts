import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { vatNumber, country } = await req.json();

    if (!vatNumber || !country) {
      return new Response(
        JSON.stringify({ error: "vatNumber and country are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const cleanVat = vatNumber.replace(/\s+/g, "").toUpperCase();
    const cleanCountry = country.toUpperCase();

    const soapBody = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns1="urn:ec.europa.eu:taxud:vies:services:checkVat" xmlns:impl="urn:ec.europa.eu:taxud:vies:services:checkVat">
  <soap:Header/>
  <soap:Body>
    <impl:checkVat xmlns:impl="urn:ec.europa.eu:taxud:vies:services:checkVat">
      <countryCode>${cleanCountry}</countryCode>
      <vatNumber>${cleanVat.replace(cleanCountry, "")}</vatNumber>
    </impl:checkVat>
  </soap:Body>
</soap:Envelope>`;

    const viesResponse = await fetch(
      "https://ec.europa.eu/taxation_customs/vies/services/checkVatService",
      {
        method: "POST",
        headers: {
          "Content-Type": "text/xml; charset=UTF-8",
          "SOAPAction": "",
        },
        body: soapBody,
      },
    );

    if (!viesResponse.ok) {
      return new Response(
        JSON.stringify({ valid: false, error: "VIES service unavailable" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const xmlText = await viesResponse.text();
    const isValid = xmlText.includes("<valid>true</valid>");

    return new Response(
      JSON.stringify({ valid: isValid }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
