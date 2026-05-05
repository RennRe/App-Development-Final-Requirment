Final
Overview:
📱 Tara! (Collaborative Barkada Planner & Ambagan)
Tagline: Plan together, pay together, no hiya involved.
● Target Persona: Friend groups (barkadas), student organizations, and families planning
out-of-town trips or local gatherings.
● Core Problem: Planning a group event usually involves a chaotic Messenger group
chat, a messy shared Notes app, and someone manually calculating who owes what.
Items are forgotten, and collecting money is awkward.
🚀 Core Features (Your Requested Additions)
● Real-Time "Canva-like" Planning Board: A shared workspace where participants can
see real-time updates. If user A adds "Charcoal" to the checklist, user B sees it appear
instantly on their screen without refreshing.
● Auto-Sync Inventory & Budget (Add/Subtract): * The Feature: When a user checks
off an item on the "To Buy" list (e.g., scanning a grocery receipt via the device camera),
the app automatically subtracts the cost from the "Total Ambagan Pool," divides the new
cost, and moves the items into an "Acquired/Inventory" tab.
● Integrated "Chika" Thread (In-App Messaging): Instead of leaving the app to update
everyone on Messenger, the app features an event-specific mini-chat. It automatically
posts system updates here (e.g., "System: Jhirick just paid his ₱500 ambag via GCash"
or "System: Kristel checked off 'Paper Plates' from the list").
Filipino Taste Integrations (Hits the 3+ Requirement)
● Local Payments & "Resibo" Generator: Generates a GCash/Maya QR code for exact
ambag payments. Users can upload a screenshot of their GCash transfer, which the app
verifies as a "resibo" (receipt) to mark them as paid.
● Culturally Appropriate UI (Walang Hiya System): Automated, playful push
notifications remind people to pay their share, removing the embarrassment (hiya) of
having to personally ask friends for money.
● Filipino-Centric Content: Pre-made event templates tailored for Filipino gatherings
(e.g., "Out of Town/Beach," "Inuman Session," "Sari-sari Store Run," "Fiesta Prep").
️ Tech Stack Highlight
To pull off the real-time and collaborative features, here is how you can structure the stack:
● Real-Time Database & Messaging: Supabase (or Firebase). Supabase's Realtime
subscriptions allow you to broadcast state changes instantly to all connected users,
providing that "Canva-like" live collaboration.
● Global State: Zustand is perfect here to hold the local UI state while Supabase handles
the remote state sync.
● Native Feature: Expo Camera. Users snap a picture of the grocery receipt. You can
stretch for bonus points by integrating a free OCR API (like Google Cloud Vision or a
lightweight React Native OCR library) to scan the total amount and automatically log the
expense.
● API/Notifications: Expo Push Notifications to ping users when an event detail
changes or a payment is due.
Resibo System:
Option 1: Manual Input + Photo Proof (Recommended to start)
The system uses the camera purely to capture the "resibo" (receipt) for transparency, but the
user types in the final amount.
● How it works: The user taps "Add Expense," takes a picture of the grocery receipt using
expo-camera, and types "₱1,250" into a text input. The app uploads the photo to the
shared feed and deducts the manually entered ₱1,250 from the pool.
● Pros: Highly reliable, perfectly accurate, and much easier to code. It completely fulfills
the rubric’s "Native Feature (Camera)" requirement without the headache of
text-recognition bugs.
1. Photo of the Goods (The "Proof of Life")
Instead of forcing the user to take a picture of a receipt that doesn't exist, the camera prompt
changes.
● The Flow: The user taps "Add Expense" -> selects "Palengke / No Receipt" -> types in
the manual amount (e.g., ₱600).
● The Proof: The app prompts them to take a photo of the actual items purchased (e.g.,
the plastic bags of meat and charcoal) instead of a piece of paper. This maintains
transparency in the group without requiring official documentation.
2. The Handwritten "Lista"
Many wet market buyers carry a small piece of paper where they jot down the prices of the fish,
meat, and vegetables as they walk from stall to stall.
● The Flow: The app allows users to snap a photo of their handwritten notes as the official
"resibo" for that specific trip.
3. E-Wallet Transfer Screenshot
Even in wet markets, many vendors now have a laminated GCash or Maya QR code hanging at
their stall.
● The Flow: Allow the user to upload an image from their phone's gallery (using
expo-image-picker) of the successful GCash transfer screenshot, rather than taking
a live photo.
Ambagan System:
Phase 1: The Initial Purchase (The Math)
Let’s assume the total budget is empty at the start of the trip.
1. The Action: You go to the wet market and buy ₱1,000 worth of meat. You input this into
the app under "Meat" and select yourself as the "Payer."
2. Total Expenses Update: The app's global state (using Zustand or Redux) instantly
updates the Total Event Cost to ₱1,000.
3. The Auto-Distribution: The app divides the new total by the number of people in the
group (₱1,000 ÷ 4). It calculates that everyone's fair share or Target Ambag is now
₱250.
Phase 2: Updating the Balances (Who owes who?)
This is where the app shines. Instead of asking people to hand you cash right then and there,
the app calculates a running "Balance" for each user:
● Your Balance: You paid ₱1,000, but your fair share is only ₱250. The app gives you a
+₱750 balance (meaning the group owes you money).
● Jhirick, Kristel, and Friend 4's Balances: They have paid ₱0 so far, but their fair share
is ₱250. The app gives them each a -₱250 balance (meaning they owe money to the
pool).
Phase 3: The Next Purchase
The state recalculates automatically every time a new expense is added.
1. The Action: Later that day, Kristel buys ₱200 worth of charcoal.
2. New Total: The Total Event Cost jumps to ₱1,200.
3. New Target Ambag: The app divides ₱1,200 by 4. Everyone's new fair share is ₱300.
4. New Balances: * You: Paid ₱1,000. Share is ₱300. Balance is +₱700.
○ Kristel: Paid ₱200. Share is ₱300. Balance is -₱100.
○ Jhirick & Friend 4: Paid ₱0. Share is ₱300. Balance is -₱300 each.
💡 The "Kanya-Kanya" Edge Case (Bonus Feature)
To make this truly robust, you need to account for exceptions. What if Jhirick is vegetarian and
won't eat the ₱1,000 meat? It's unfair to charge him for it.
You can add a "Split Exclusions" toggle when adding an expense.
● When adding the Meat, you deselect Jhirick.
● The app now splits the ₱1,000 only between you, Kristel, and Friend 4 (₱333.33 each),
leaving Jhirick's balance completely untouched for that specific item.
This continuous background math eliminates the messy Messenger debates at the end of the
trip. When the event is over, users just look at their final negative balance, hit a "Settle Up"
button, and pay whoever has a positive balance via the GCash QR code.
Calendar:
📅 The Feature: "Anti-Filipino Time" Calendar Sync
Instead of just adding a standard event, you can design this feature to combat the notorious
"Filipino Time" (the habit of arriving late).
● How it works: Once the barkada agrees on a date and time on the shared planning
board, users can tap a "Sync to Calendar" button.
● The Cultural Twist: The app playfully asks, "Do we need to adjust for Filipino Time?" If
they select "Yes," the app automatically schedules the Google Calendar event 1 to 2
hours earlier than the actual call time, ensuring everyone actually arrives when they are
supposed to!
️ How to Build It (The Tech Stack)
You actually have two ways to do this, depending on how you want to score your rubric points:
Option A: The Native Approach (Highly Recommended) Instead of dealing with complex
Google OAuth logins, you can use expo-calendar.
● Why it's great: It directly fulfills the "Native Device Features" rubric requirement.
● How it functions: It asks the user for permission to access their phone's native
calendar. When they tap the sync button, it pushes the event (with the location, time, and
a link to the Tara! app) directly to their default calendar (which is usually Google
Calendar for Android users or Apple Calendar for iOS).
Option B: The API Approach You can use the Google Calendar REST API.
● Why it's great: It fulfills the "API Integration" requirement.
● How it functions: Users log in via Google, and you send a POST request via axios or
fetch to insert the event directly into their cloud calendar.
Where does this go in the proposal?
I highly recommend putting this under Core Features alongside the "Chika" thread and the
Inventory tracker. It rounds out the app perfectly: you are now solving the money problem
(Ambagan), the logistics problem (Shared Checklist), and the scheduling problem (Calendar
Sync).
Optional for Connectivity:
1. The "Optimistic UI" & Offline Queue (Data Flow)
Instead of the app freezing or showing an endless loading spinner when there is no internet, you
design it to act "optimistically."
● How it works: When you add a ₱600 expense for meat in the palengke, Zustand
instantly updates the local state on your phone. It recalculates your balance and moves
the item to "Acquired" immediately, even if you are offline.
● The Sync Queue: Behind the scenes, the app saves this action to local storage (using
react-native-mmkv or AsyncStorage). The moment your phone detects a Wi-Fi or
cellular connection, it silently pushes that queued update to Supabase so Jhirick, Kristel,
and the rest of the group see it.
2. Low-Bandwidth Image Optimization
Uploading a high-resolution photo of a grocery receipt or wet market goods will fail instantly on a
weak 3G network.
● How it works: You integrate a library like expo-image-manipulator. Before the app
tries to upload the "resibo" to Supabase, it compresses the image heavily (e.g., reducing
quality by 70% and resizing it).
● The Justification: This ensures the "Proof of Life" photo uploads quickly without eating
up the user's precious prepaid data load.
3. Local Caching for the "Command Center"
When you open the app to check the event itinerary or see who owes you money, it shouldn't
need to fetch that data from the internet every single time.
● How it works: The app caches the latest version of the Ambagan ledger and the
checklist locally. If you open the app while offline, a small banner appears at the top
saying: "You are offline. Showing last synced data from 10 mins ago."
Ui
Global UI Elements & State
● Offline Mode Banner: A slim banner at the top of the screen that appears when the
connection drops, reading: "You are offline. Showing last synced data from 10 mins ago."
● Optimistic UI Indicators: When a user checks off an item offline, it should visually tick
off immediately (driven by Zustand), perhaps with a subtle "syncing" cloud icon next to it
until the background queue pushes it to Supabase.
Screen 1: The Command Center (Dashboard)
This is the main hub users see when they open an event (e.g., "Out of Town/Beach" or "Sari-sari
Store Run").
● Header: Event Name, Date, and a "Sync to Calendar" button.
○ Interaction: Tapping the calendar button triggers the "Anti-Filipino Time"
Modal. It playfully asks if the group needs to adjust for Filipino Time, offering to
push the event to the device's native calendar 1 to 2 hours earlier than the actual
call time.
● The Bento Grid Layout:
○ Tile 1 (Top Left - High Priority): The Ambagan Snapshot. Displays the "Total
Event Cost" and the user's specific current balance (e.g., "+P750" in green or
"-P250" in red).
○ Tile 2 (Top Right): Quick access to the QR Code / Resibo Generator.
○ Tile 3 (Wide Middle): A preview of the "To Buy" Checklist, showing the top 3
unacquired items.
○ Tile 4 (Bottom - Live Feed): A preview of the "Chika" Thread, showing the
latest system auto-post (e.g., "System: Jhirick just paid his P500 ambag").
Screen 2: The Shared Planning Board (Inventory)
A real-time workspace divided into clear tabs for logistics.
● Tabs: "To Buy" and "Acquired/Inventory".
● The List: Each item on the "To Buy" list features a checkbox.
● The Action: Checking a box instantly triggers a modal to input the cost and shifts the
item to the "Acquired" tab. Because of Supabase, when you check off "Charcoal," Kristel
will see it move to the Acquired tab on her screen instantly without refreshing.
Screen 3: The "Add Expense" Modal (Resibo Flow)
This is a critical screen where the math and the native Expo Camera feature unite.
● Amount Input: A large, clear text input for the manual amount (e.g., "P1,250").
● Payer Selection: A dropdown to select who paid for the item (defaults to the current
user).
● The "Proof of Life" Section: Three options for transparency:
1. Palengke / No Receipt: Prompts the native Expo Camera to take a live picture
of the actual goods (e.g., plastic bags of meat).
2. Handwritten Lista: Prompts the camera to snap a photo of the wet market
notes.
3. E-Wallet Screenshot: Uses expo-image-picker to upload a GCash/Maya
transfer screenshot from the gallery.
● Image Compression: Before uploading to Supabase, the UI should show a quick
"Optimizing..." state while expo-image-manipulator compresses the image to save
prepaid data load.
● The "Kanya-Kanya" Toggle (Split Exclusions): A checklist of participants. If someone
shouldn't pay for an item (e.g., Jhirick is vegetarian and shouldn't pay for the P1,000
meat), you deselect their name so the cost is only split among the remaining members.
Screen 4: The Ambagan Ledger (The Math Hub)
This screen replaces the awkward Messenger math debates.
● Total Pool: A large display of the "Total Event Cost" (e.g., P1,200) and the calculated
"Target Ambag" per person (e.g., P300).
● Running Balances List: A clean list of all members:
○ You: Paid P1,000. Balance: +P700 (Highlighted in Green).
○ Kristel: Paid P200. Balance: -P100 (Highlighted in Red).
○ Jhirick & Friend 4: Paid P0. Balance: -P300 (Highlighted in Red).
● "Walang Hiya" Nudge Button: A playful button next to negative balances that sends an
automated push notification via Expo Push Notifications to remind them to pay, removing
the embarrassment of asking manually.
● Settle Up Action: A prominent button at the bottom for users with negative balances to
view the positive-balance users' GCash/Maya QR codes and upload their transfer
screenshots.
Screen 5: The "Chika" Thread (In-App Messaging)
An event-specific chat interface to keep everything centralized.
● Chat Interface: Standard message bubbles for user-generated chats.
● System Auto-Posts: Distinct, visually different chat bubbles (perhaps styled like an alert
or notification pill) that automatically generate when Zustand updates the global state.
○ Example: "System: Kristel checked off 'Paper Plates' from the list".
UI 2
That is an incredibly solid foundation. Your feature list directly tackles the rubric, and integrating
the "Anti-Filipino Time" calendar sync alongside a robust offline-first architecture is going to
make this app stand out. Your professor is absolutely right, though: real-time collaborative apps
live or die by their usability. If it feels clunky to add an expense or hard to navigate between
different trips, users will just revert to their Messenger group chats.
To ensure your app handles multiple events seamlessly and provides a frictionless collaborative
experience, here is a recommended UI structure and UX strategy for "Tara!".
Global App Navigation
To manage multiple events without confusing the user, rely on a Hub-and-Spoke navigation
model. The user starts at a central dashboard (the Hub) and dives into specific events (the
Spokes). Once inside an event, a Bottom Tab Navigator keeps the core tools accessible.
Screen 1: The "Kaganapan" (Home Dashboard)
This is the first screen users see. It needs to handle the "multiple events" requirement clearly.
● Welcome Header: A warm greeting (e.g., "Uy, Jhirick!") with a notification bell for
pending invites or ambagan nudges.
● Quick Action Bar: Two prominent buttons at the top: "Create New Event" and "Join via
Code/QR".
● Active Events (Horizontal Scroll): Large, visually distinct cards for upcoming trips.
Each card shows the event name, date (with "Filipino Time" indicator if active), total
group budget so far, and small avatar circles of the barkada.
● Past Events (Vertical List): A simpler, grayed-out list of finished events. Users can still
tap these to view old receipts or settle lingering debts.
Screen 2: Event "Command Center" (Inside an Event)
Once a user taps an active event (e.g., "Puerto Galera 2026"), they enter the workspace. The
top header stays fixed with the Event Name and active user avatars, while the bottom features
three main tabs.
● Tab 1: Board (The Planner): A clean, segmented list. It shows "To Bring" and "To Buy".
Tapping an item opens a quick edit menu. A floating action button (FAB) in the corner
allows quick additions.
● Tab 2: Ambagan (The Ledger): The financial heart of the app. The top half shows a
summary card with "Total Event Cost" and the user's specific status (e.g., "You owe
₱250" in red, or "You are owed ₱700" in green). The bottom half is a feed of all
purchased items with the payer's name attached.
● Tab 3: Chika (The Thread): The chat interface. Regular user messages appear on the
left/right, while system-generated logs (e.g., "System: Kristel checked off 'Charcoal'")
appear centered and grayed out.
Screen 3: The "Add Expense" Bottom Sheet
Adding an expense must be completely frictionless. Instead of opening a new screen that takes
them out of the context, use a Bottom Sheet that slides up over the current screen.
● Amount Input: A massive, easily tappable number pad interface.
● Item Name: A simple text field.
● Category/Tag: Quick chips for "Food," "Transpo," "Accommodation."
● Proof Upload: A large, inviting button to "Snap Resibo / Palengke Goods."
● Split Rule: Defaults to "Split Equally," but tapping it reveals the Kanya-Kanya toggle to
exclude specific people.
UX Suggestions for Seamless Collaboration
To specifically address your professor's feedback on usability, implement these
micro-interactions:
● Real-Time Presence Indicators: In the top header of the Event Command Center,
show the avatars of everyone currently looking at the app. Add a subtle glowing green
ring around their avatar so users know exactly who is online and co-planning with them
in that exact second.
● "Typing..." and "Editing..." States: If Kristel is currently editing the budget for the rental
van, gray out that specific item for other users and display a lock icon with "Kristel is
editing..." to prevent data collision and confusion.
● Contextual "Settle Up" Flow: When the event is over, the "Settle Up" button shouldn't
just show numbers. It should show a direct action: "Pay Jhirick ₱300" alongside Jhirick's
GCash QR code, removing any friction from the payment process.
● Subtle Offline Banners: Implement your optimistic UI seamlessly. If the internet drops,
do not block the screen. Just change the top header background slightly and show a tiny
banner reading "Offline Mode - Saving locally." When reconnected, change it to "Synced"
for two seconds before disappearing.
