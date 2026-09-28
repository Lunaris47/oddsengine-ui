# OddsEngine UI

React frontend for [OddsEngine](https://github.com/Lunaris47/OddsEngine), a sports betting mathematics API.

**Live demo: https://oddsengine-ui.vercel.app**

Seven calculators covering odds conversion, no-vig fair pricing, parlay pricing, expected value, Kelly criterion staking, hedging, and arbitrage detection. Each one includes a worked example and a plain-English reading of the result, so the math is usable by someone encountering it for the first time.

Built with Vite and React, deployed on Vercel. The API is a C#/ASP.NET Core service running in a container on Railway.

Note: the API sleeps when idle, so the first request after a quiet period can take 20 to 30 seconds.

## Running locally

    npm install
    npm run dev

Set `VITE_API_URL` to point at an API instance, or leave it unset to default to `http://localhost:5269`.