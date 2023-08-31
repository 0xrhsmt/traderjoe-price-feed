import { check, group } from 'k6';
import http from 'k6/http';

export function v1Prices(baseUrl, base, quote) {
  group('/v1/prices', function () {
    const res = http.get(`${baseUrl}/v1/prices/${base}/${quote}`);

    check(res, {
      'response code was 200': res => res.status == 200,
    });
  });
}
