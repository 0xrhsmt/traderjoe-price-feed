import express, { ErrorRequestHandler, Express, NextFunction, RequestHandler } from 'express'
import PriceFetcherV1Service from '../services/priceFetchers/v1';
import { errorRequestHandler } from './exceptions';

const app: express.Express = express()
app.use(express.json())

const PRICE_CACHE: { [base: `0x${string}`]: { [quote: `0x${string}`]: { value: number, cachedAt: Date } } } = {}
const CACHE_EXPIRY = 1000 * 1; // 1 second

const wrapAsync = (func: RequestHandler) => {
    return (req: express.Request, res: express.Response, next: NextFunction) => {
        const fnReturn = func(req, res, next);

        return Promise.resolve(fnReturn).catch(next);
    }
};

const fetchPrice = async (base: `0x${string}`, quote: `0x${string}`): Promise<number> => {
    base = base.toLowerCase() as `0x${string}`;
    quote = quote.toLowerCase() as `0x${string}`;

    const cached = PRICE_CACHE[base]?.[quote]?.cachedAt?.getTime() > Date.now() - CACHE_EXPIRY;
    if (cached) {
        return PRICE_CACHE[base][quote].value;
    }

    const service = new PriceFetcherV1Service();
    const price = await service.execute(base, quote);

    PRICE_CACHE[base] = PRICE_CACHE[base] || {};
    PRICE_CACHE[base][quote] = { value: price, cachedAt: new Date() };

    return price;
}

app.get('/v1/prices/:base/:quote', wrapAsync(async (req: express.Request, res: express.Response) => {
    const base = req.params.base as `0x${string}`;
    const quote = req.params.quote as `0x${string}`;

    // TODO: Validate base and quote params

    const price = await fetchPrice(base, quote);

    res.send(JSON.stringify({
        price: price,
    }))
}))

app.post('/v1/batch-prices', wrapAsync(async (req: express.Request, res: express.Response) => {
    const assets = req.body;
    
    // TODO: Validate body

    const prices = await Promise.all(
        assets.map(async (asset: { base_asset: `0x${string}`, quote_asset: `0x${string}` }) => fetchPrice(asset.base_asset, asset.quote_asset))
    )

    res.send(JSON.stringify(
        prices.map((price) => ({ price }))
    ));
}))

app.use(errorRequestHandler);

export default app
