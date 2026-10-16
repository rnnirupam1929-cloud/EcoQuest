
  # EcoQuest app Design

  This is a code bundle for EcoQuest app Design. The original project is available at https://www.figma.com/design/g5TfaphBBE6TkiBNaAyDcv/EcoQuest-app-Design.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run server` in one terminal to start the Eco News RSS API. Eco News shows four latest articles and refreshes hourly. If live feeds are unavailable, four Google News topic links remain available and open current search results.

  Run `npm run dev` in another terminal to start the app. The dashboard refreshes environmental news hourly and caches recent stories in each signed-in user's Firestore profile.

  Selecting **Enter** on a daily challenge opens the Smart Waste detector inside the existing EcoQuest phone frame. Tap **Open Camera** to grant camera access, or use photo upload if a camera is unavailable. If AI classification is uncertain, choose the material manually to continue. The sorting guide links to a nearby-bin search and has a demo placement confirmation to complete the reward flow.

  Enable the Email/Password provider in Firebase Authentication to use email and password accounts. Google sign-in and phone OTP remain available as separate sign-in methods.

  The leaderboard uses the Firestore `leaderboard` collection and live listeners. Deploy the included Firestore rules to the Firebase project with `firebase deploy --only firestore:rules`; signed-in users can read leaderboard profiles, while each account can write only its own entry.

  Reward claims become one-time redemptions when the user selects “Redeem on Amazon.” The reward is then marked SOLD, and its point cost is deducted from the user's saved balance.

  The rewards screen includes a bundled catalogue fallback for static deployments such as Vercel. Signed-in users' claims and redemptions are also saved transactionally in their existing Firestore user document, so reward actions continue to work if the optional Express API is unavailable. Guest/demo claims are saved in that browser's local storage.

  ## Waste detection

  Daily challenge **Enter** buttons open the Smart Waste detector embedded in the EcoQuest phone frame. It uses the browser camera or an uploaded photo and the lightweight on-device COCO-SSD model to identify items, recommend a compartment, and award the selected challenge points after placement is confirmed. If the model is uncertain, the user can choose the material manually. No separate Python classifier service is needed for this flow.
  