import http from 'k6/http';
import { Trend } from 'k6/metrics';
import { group, sleep } from 'k6';

const contactsLatency = new Trend('contact_duration');

export function contacts(baseUrl) {
  group('Contacts flow', function () {
    // save response as variable
    let res = http.get(`${baseUrl}/contacts.php`);
    // add duration property to metric
    contactsLatency.add(res.timings.duration);
    sleep(1);

    res = http.get(`${baseUrl}/`);
    // add duration property to metric
    contactsLatency.add(res.timings.duration);
    sleep(1);
  });
}
