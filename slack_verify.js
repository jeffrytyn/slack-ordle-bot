import crypto from 'crypto';

export default function(timestamp, body_string, actual_sig){
  if(!timestamp || !body_string || Math.abs(
    Math.floor(new Date().getTime() / 1000) - timestamp) > 300) return false;
  const val  = `v0:${timestamp}:${body_string}`;
  const sig = "v0=" + crypto.createHmac('sha256', process.env.SLACK_SIGNING_SECRET)
    .update(val)
    .digest('hex');
  return sig === actual_sig;
}