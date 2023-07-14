import express, { ErrorRequestHandler, Express, NextFunction, RequestHandler } from 'express'
import PriceFetcherV1Service from '../services/priceFetchers/v1';
import { errorRequestHandler } from './exceptions';
import PriceFetcherV2Service from '@/services/priceFetchers/v2';

const app: express.Express = express()
app.use(express.json())

const PRICE_CACHE_V1: { [base: `0x${string}`]: { [quote: `0x${string}`]: { value: number, cachedAt: Date } } } = {}
const PRICE_CACHE_V2: { [base: `0x${string}`]: { [quote: `0x${string}`]: { [binstep: number]: { value: number, cachedAt: Date } } } } = {}
const PRICE_CACHE_V2_1: { [base: `0x${string}`]: { [quote: `0x${string}`]: { [binstep: number]: { value: number, cachedAt: Date } } } } = {}
const CACHE_EXPIRY = 1000 * 1; // 1 second

const wrapAsync = (func: RequestHandler) => {
    return (req: express.Request, res: express.Response, next: NextFunction) => {
        const fnReturn = func(req, res, next);

        return Promise.resolve(fnReturn).catch(next);
    }
};

const fetchPriceV1 = async (base: `0x${string}`, quote: `0x${string}`): Promise<number> => {
    base = base.toLowerCase() as `0x${string}`;
    quote = quote.toLowerCase() as `0x${string}`;

    const cached = PRICE_CACHE_V1[base]?.[quote]?.cachedAt?.getTime() > Date.now() - CACHE_EXPIRY;
    if (cached) {
        return PRICE_CACHE_V1[base][quote].value;
    }

    const service = new PriceFetcherV1Service();
    const price = await service.execute(base, quote);

    PRICE_CACHE_V1[base] = PRICE_CACHE_V1[base] || {};
    PRICE_CACHE_V1[base][quote] = { value: price, cachedAt: new Date() };

    return price;
}

const fetchPriceV2 = async (base: `0x${string}`, quote: `0x${string}`, binStep: number): Promise<number> => {
    base = base.toLowerCase() as `0x${string}`;
    quote = quote.toLowerCase() as `0x${string}`;

    const cached = PRICE_CACHE_V2[base]?.[quote]?.[binStep]?.cachedAt?.getTime() > Date.now() - CACHE_EXPIRY;
    if (cached) {
        return PRICE_CACHE_V2[base][quote][binStep].value;
    }

    const service = new PriceFetcherV2Service();
    const price = await service.execute(base, quote, binStep);

    PRICE_CACHE_V2[base] = PRICE_CACHE_V2[base] || {};
    PRICE_CACHE_V2[base][quote] = PRICE_CACHE_V2[base][quote] || {};
    PRICE_CACHE_V2[base][quote][binStep] = { value: price, cachedAt: new Date() };

    return price;
}

app.get('/v1/prices/:base/:quote', wrapAsync(async (req: express.Request, res: express.Response) => {
    // TODO: Validate base and quote params
    const base = req.params.base as `0x${string}`;
    const quote = req.params.quote as `0x${string}`;

    const price = await fetchPriceV1(base, quote);

    res.send(JSON.stringify({
        price: price,
    }))
}))

app.post('/v1/batch-prices', wrapAsync(async (req: express.Request, res: express.Response) => {
    const assets = req.body;

    // TODO: Validate body

    const prices = await Promise.all(
        assets.map(async (asset: { base_asset: `0x${string}`, quote_asset: `0x${string}` }) => fetchPriceV1(asset.base_asset, asset.quote_asset))
    )

    res.send(JSON.stringify(
        prices.map((price) => ({ price }))
    ));
}))

app.get('/v2/prices/:base/:quote/:binstep', wrapAsync(async (req: express.Request, res: express.Response) => {
    const base = req.params.base as `0x${string}`;
    const quote = req.params.quote as `0x${string}`;
    const binstep = parseInt(req.params.binstep, 10) as number;

    // TODO: Validate base and quote params

    const price = await fetchPriceV2(base, quote, binstep);

    res.send(JSON.stringify({
        price: price,
    }))
}))

app.post('/v2/batch-prices', wrapAsync(async (req: express.Request, res: express.Response) => {
    // TODO: Validate body
    const assets = req.body;

    const prices = await Promise.all(
        assets.map(async (asset: { base_asset: `0x${string}`, quote_asset: `0x${string}`, bin_step: number }) => fetchPriceV2(asset.base_asset, asset.quote_asset, asset.bin_step))
    )

    res.send(JSON.stringify(
        prices.map((price) => ({ price }))
    ));
}))

app.use(errorRequestHandler);

export default app
