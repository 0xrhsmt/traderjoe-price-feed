import { check, group } from 'k6';
import http from 'k6/http';

export function v2_1BatchPrices(baseUrl, pairs) {
  group('/v2_1/batch-prices', function () {
    const res = http.post(`${baseUrl}/v2_1/batch-prices`, JSON.stringify(pairs), {
      headers: { 'Content-Type': 'application/json' },
    });

    check(res, {
      'response code was 200': res => res.status == 200,
    });
  });
}
