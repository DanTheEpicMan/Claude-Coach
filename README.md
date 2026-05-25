This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.




# Claude-Coach
# !!!! Evem though the API utiliizes claude, AI was NOT (significantly) used in programming this, just as an endpoint

## Goals of the project

### 1) In Gym Controls
During workout, should be able to input: <br>
a) Add the exercise -> auto create first set
per set:
1) rest time (except first set)
2) pounds (auto fill from last)
3) reps
4) description of failure (and drop down presets) (optional)

Navigation throughout this should not require tapping small squares or anything. Space auto skips to next box.
<br>Arrow navigation on the keyboard, custom keyboard so numbers are always on it. Quick, add set button

### Out of Gym Feedback
A general check, a back and forth session exchange.

#### Diet
So far undetermined as to the method used to communicate this, but probably something similar to Out of Gym Feedback

### Pre-Gym Feedback
Short session plan for the day, coming before the out og Gym feedback, ie, initiated before the gym rather the Out of Gym witch is trigger by ending the session
-> When creating a new exercise in gym controls, AI plans (and there order in witch to complete) will be displayed in a drop-down (+ also just regular typing) (drop down will also include ability to delete just in case)

## 2) Other Daily integrations
Possible Ideas:
1) Google Calendar Integration
2) On site location integration (possibly google maps?)
3) Camera/Some API or processor to track calories through images of food.
4) Notification/Async triggering of events based on alarms/wakeup times or other parts of differ