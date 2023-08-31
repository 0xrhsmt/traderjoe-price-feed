export const smokeWorkload = {
  executor: 'shared-iterations',
  iterations: 5,
  vus: 1,
};

export const thresholdsSettings = {
  http_req_failed: [{ threshold: 'rate<0.01' }],
  http_req_duration: ['p(90)<1000'],
};

export const breakingWorkload = {
  executor: 'ramping-vus',
  stages: [
    { duration: '10s', target: 20 },
    { duration: '20s', target: 20 },
    { duration: '20s', target: 40 },
    { duration: '20s', target: 60 },
    { duration: '20s', target: 80 },
    { duration: '20s', target: 100 },
    { duration: '20s', target: 120 },
    { duration: '20s', target: 140 },
    { duration: '20s', target: 160 },
    { duration: '20s', target: 180 },
    { duration: '20s', target: 200 },
  ],
};

export const spikeWorkload = {
  executor: 'ramping-vus',
  stages: [
    { duration: '2m', target: 2000 },
    { duration: '1m', target: 0 },
  ],
};
