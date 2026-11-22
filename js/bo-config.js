/* Blue Operator form + quote endpoints.
   SAFETY: RELAY_LIVE and QUOTE_LIVE stay false until Manuel OKs the test window.
   While false, NOTHING is sent anywhere: payloads are logged to the console and the response is simulated.
   Make queues posts sent to an OFF scenario and would fire real texts when it is switched on, so never flip
   these flags until Ops has switched the scenarios on and cleared any queue. */
window.BO_CFG = window.BO_CFG || {
  RELAY_LIVE: false,
  RELAY_URL: 'https://hook.us2.make.com/5pgowykxj0h3qzrham5pip8ir3kb4ddf',  // Make 7144400 "Website Form Relay" (OFF)
  QUOTE_LIVE: false,
  // Ops quote scenarios (all OFF, spec /workspace/website-form-relay/quotes.md). Never request these while QUOTE_LIVE is false.
  QUOTE_STATUS_URL: 'https://hook.us2.make.com/33d72j18ajmp46hyd1i53cyglovd9uum',  // Make 7144552: GET ?ref=<submission_id> -> 200 {ok,state:'pending'|'ready'|'no_price'|'out_of_area'|'failed',token?,quote_url?} | 400 bad_ref
  QUOTE_LOAD_URL: 'https://hook.us2.make.com/3piukcp5w5vyh1pmbl2dfy1key4r65lc',    // Make 7144556: GET ?token= -> 200 {ok,token,kind,status,language,first,price,first_month,discount,promo,expires_at} | 404 not_found_or_expired
  QUOTE_DECIDE_URL: 'https://hook.us2.make.com/vl7ztx7ug3rjtemo2yv0or5m1xb2g3ny',  // Make 7144598: POST text/plain JSON {token,action,reason?} -> 200 {ok,action,status,repeat?} | 400 bad_action/bad_reason | 404 not_found | 410 expired
  POLL_MS: 2000, MAX_WAIT_MS: 45000, MIN_PREP_MS: 3000
};
