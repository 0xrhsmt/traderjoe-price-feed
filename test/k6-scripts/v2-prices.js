import { check, group } from 'k6';
import http from 'k6/http';

export function v2Prices(baseUrl, base, quote, binstep) {
  group('/v2/prices', function () {
    const res = http.get(`${baseUrl}/v2/prices/${base}/${quote}/${binstep}`);

    check(res, {
      'response code was 200': res => res.status == 200,
    });
  });
}
