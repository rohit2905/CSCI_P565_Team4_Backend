// / Cron job to hit endpoint every 14 sec to keep backend alive always
const cron = require ('cron' );
const https = require ('https');
const backendUrl = 'https://dwb-wgcq.onrender.com'
const job = new cron. CronJob ('*/5 * * * *', function () {
    console.log('Restarting server', new Date());
    // Perform an HTTPS GET request to hit any backend api.
https
.get (backendUrl, (res) => {
if (res.statusCode === 200) {
console.log ('Server restarted by cron');
} else {
console.error (
"failed to restart server by cron with status code: ${res.statusCode}");
}
})
.on ('error',(err) => {
console.error ('Error during Restart:', err.message);
});
});
module.exports={
    job:job
};