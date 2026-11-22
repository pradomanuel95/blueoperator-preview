/* Blue Operator form + quote endpoints.
   SAFETY: RELAY_LIVE and QUOTE_LIVE stay false until Manuel OKs the test window.
   While false, NOTHING is sent anywhere: payloads are logged to the console and the response is simulated.
   Make queues posts sent to an OFF scenario and would fire real texts when it is switched on, so never flip
   these flags until Ops has switched the scenarios on and cleared any queue. */
window.BO_CFG = window.BO_CFG || {
  RELAY_LIVE: false,
  RELAY_URL: 'https://hook.us2.make.com/5pgowykxj0h3qzrham5pip8ir3kb4ddf',  // Make 7144400 "Website Form Relay" (OFF)
  QUOTE_LIVE: false,
  QUOTE_STATUS_URL: '',   // Ops: GET ?ref=<submission_id>  -> {ok,state:'pending'|'ready'|'no_price'|'out_of_area'|'failed',token}
  QUOTE_LOAD_URL: '',     // Ops: GET ?token=<token>        -> {ok,token,kind,status,language,first,price,first_month,discount,promo,expires_at}
  QUOTE_DECIDE_URL: '',   // Ops: POST {token,action}        -> {ok,action,status,repeat?}
  POLL_MS: 2000, MAX_WAIT_MS: 45000, MIN_PREP_MS: 3000
};
