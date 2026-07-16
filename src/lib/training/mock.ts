// Seed content for Staff Training — same pattern as src/lib/knowledge/mock.ts:
// this is the real, structured content parsed from Sweet Disorder's training
// guide PDFs, shaped exactly like the trainingModules table. It's what a
// database seed would insert; the UI runs on these fixtures until a real
// Postgres instance is configured (see src/lib/training/repository.ts).
//
// Section content convention (rendered by SectionContent, see
// src/components/training/section-content.tsx):
//   - Blocks are separated by a blank line ("\n\n"); each renders as its own
//     paragraph, list, or reference table.
//   - A block where every line starts "1. ", "2. " etc renders as an ordered
//     list (steps).
//   - A block where every line starts "- " renders as a bullet list.
//   - A block with 2+ lines where every line matches "Label: value" renders
//     as a reference table — used for "Common questions" (question: answer)
//     and any other structured lookup from the source guide.
//   - Anything else renders as plain paragraph text.
import type { StaffTrainingProgress, TrainingModule } from "./types";

// No real staff/auth records exist yet (same reasoning as reviewedBy in
// wholesale-orders) — this mirrors the fixed roster already used for
// Production (see ProductionStaffMember in lib/types.ts), plus Molly since
// she completes training too.
export const trainingStaffRoster = ["Ange", "Charlie", "Molly"] as const;

export type TrainingStaffMember = (typeof trainingStaffRoster)[number];

export const mockTrainingModules: TrainingModule[] = [
  {
    id: "mod-hygiene",
    slug: "hygiene",
    title: "Hygiene",
    sourceDocument: "Hygiene Training Guide",
    createdAt: "2026-07-01T09:00:00.000Z",
    sections: [
      {
        heading: "Overview",
        content:
          "You're handling loose sweets that people eat, so a few simple habits matter a lot here. None of this is complicated, but all of it is non-negotiable, every time, not just when it's convenient.",
        isKeyRule: false,
      },
      {
        heading: "The one rule that matters most",
        content:
          "If you're unwell, especially with vomiting, diarrhoea, or anything like that, tell Molly before you start work, don't just push through it.",
        isKeyRule: true,
      },
      {
        heading: "Before you touch any product",
        content:
          "1. Wash your hands properly: soap and water, 20 seconds (about the length of singing 'happy birthday' twice), dry them thoroughly.\n2. Put on your apron and hairnet.\n3. Take off rings, bracelets, watches, and dangling earrings.\n4. Check your hands and arms, got a cut or sore? Cover it with a plaster, and if you're handling loose product directly, put a glove over that too.",
        isKeyRule: false,
      },
      {
        heading: "Wash your hands again after...",
        content:
          "- Any break, even a short one.\n- Using the toilet.\n- Coughing or sneezing.\n- Using your phone.\n- Taking out the rubbish.\n- Touching anything that felt dirty, a door handle, a bin lid, whatever.\n\nIt sounds like a lot, but it becomes automatic fast. When in doubt, just wash your hands again, there's no such thing as washing them too often.",
        isKeyRule: false,
      },
      {
        heading: "Filling jars or boxes: the checklist",
        content:
          "1. Wash hands.\n2. Apron, hairnet, no jewellery.\n3. Check your hands and arms are properly covered if you have any cuts.\n4. Have a quick look that your work surface and containers are clean, if you're not sure, clean them again before you start.\n5. Have a quick look at the sweets themselves before you start scooping, anything that looks off (debris, something that shouldn't be there), stop and tell Molly rather than carrying on.\n6. Fill to the correct weight.\n7. Seal, label, and add the best-before date.\n8. Wash your hands again if you take a break partway through.",
        isKeyRule: false,
      },
      {
        heading: "If you're feeling unwell",
        content:
          "This is the part that matters most, and it's simple: if you've vomited, had diarrhoea, or had jaundice in the last 48 hours, or you start feeling like that during a shift, tell Molly straight away. Don't wait until your break, don't push through it hoping it passes.\n\nYou'll stay away from handling food until you've been clear of symptoms for 48 hours. That doesn't necessarily mean staying home on no pay if there's something else you can help with that doesn't involve touching food or food-contact surfaces, so it's worth asking rather than assuming the worst.\n\nIf it's something more serious, jaundice, being sick or having diarrhoea more than twice in a day, or being unwell for more than a day, see a doctor as well as telling Molly.",
        isKeyRule: false,
      },
      {
        heading: "Common questions",
        content:
          "I've only got a small cut, does it really need covering?: Yes. A plaster, and a glove over it if you're handling loose sweets directly. Small cuts are exactly how bugs get into food.\nI feel fine but had a stomach bug two days ago: Still mention it. 48 hours clear of symptoms is the rule, not 48 hours since you started feeling better.\nI need to nip outside for two minutes: Take your apron off first, and wash your hands again when you come back before touching product.\nI noticed something odd in the sweets I'm about to fill: Stop, don't use them, tell Molly. This isn't something to quietly work around.\nI'm not sure if something counts as a hygiene issue: Ask anyway. A quick question costs nothing, a missed hygiene issue can mean product gets thrown out or worse.",
        isKeyRule: false,
      },
    ],
    quizQuestions: [
      {
        question: "What's the rule if you're feeling unwell with vomiting or diarrhoea?",
        options: [
          "Push through the shift if you can manage",
          "Tell Molly before you start work, don't push through it",
          "Just avoid touching sweets directly, otherwise carry on",
          "Take something for it and see how you feel by lunch",
        ],
        correctAnswerIndex: 1,
        explanation:
          "The one rule that matters most: tell Molly before you start work rather than pushing through it.",
      },
      {
        question: "How long do you need to be clear of symptoms before handling food again?",
        options: ["24 hours", "48 hours", "Until you feel back to normal, no set time", "One week"],
        correctAnswerIndex: 1,
        explanation: "48 hours clear of symptoms is the rule, not 48 hours since you started feeling better.",
      },
      {
        question: "You've got a small cut on your finger. Does it need covering?",
        options: [
          "No, it's too small to matter",
          "Yes, a plaster, and a glove over it if handling loose sweets directly",
          "Only if it's still bleeding",
          "Only on your dominant hand",
        ],
        correctAnswerIndex: 1,
        explanation: "Small cuts are exactly how bugs get into food, so they always get covered.",
      },
      {
        question: "You had a stomach bug two days ago but feel fine now. Do you need to mention it?",
        options: [
          "No, it was days ago",
          "Yes, 48 hours clear of symptoms is the rule, not 48 hours since you started feeling better",
          "Only if you're still not 100%",
          "Only if a customer might have been affected",
        ],
        correctAnswerIndex: 1,
        explanation: "Mention it regardless — the 48-hour clock starts from being symptom-free, not feeling better.",
      },
      {
        question: "You notice something odd (debris, something that shouldn't be there) in the sweets you're about to fill. What do you do?",
        options: [
          "Pick around it and carry on",
          "Stop, don't use them, and tell Molly",
          "Rinse the sweets before filling",
          "Fill anyway, it's probably fine",
        ],
        correctAnswerIndex: 1,
        explanation: "This isn't something to quietly work around — stop and tell Molly.",
      },
      {
        question: "When should you wash your hands again during a shift?",
        options: [
          "Only at the start of the shift",
          "After any break, using the toilet, coughing/sneezing, using your phone, or touching anything dirty",
          "Only before lunch",
          "Once every couple of hours regardless of what you've touched",
        ],
        correctAnswerIndex: 1,
        explanation: "There's no such thing as washing your hands too often — do it after any of these.",
      },
    ],
  },
  {
    id: "mod-best-before-shelf-life",
    slug: "best-before-shelf-life",
    title: "Best-Before & Shelf Life",
    sourceDocument: "Best-Before & Shelf Life Training Guide",
    createdAt: "2026-07-01T09:05:00.000Z",
    sections: [
      {
        heading: "Overview",
        content:
          "Sweet Disorder has one hard rule here: nothing goes out the door, to anyone, with less than 6 months' shelf life left. This guide covers what that means day to day and how to work out a best-before date.",
        isKeyRule: false,
      },
      {
        heading: "The one rule that matters most",
        content:
          "If you're picking stock for an order and it's got under 6 months left, don't send it, even if it's the stock closest to hand.",
        isKeyRule: true,
      },
      {
        heading: "Best-before vs use-by, quickly",
        content:
          "These aren't the same thing. A use-by date is a safety cut-off, food past it can actually make someone sick. A best-before date is about quality, food past it is unlikely to be unsafe, it just might not be at its absolute best. Sweets are shelf-stable, so everything we sell uses best-before dates, not use-by dates.",
        isKeyRule: false,
      },
      {
        heading: "Working out a best-before date",
        content:
          "1. Check the Shelf-life Reference spreadsheet for the product you're packing.\n2. If it's been directly tested, use that figure.\n3. If it hasn't, use that ingredient's own shelf life, since each jar only ever has one sweet type in it, there's no comparing between ingredients.\n4. Best-before date = packing date + that shelf life figure.\n5. Double-check this against the actual product you're labelling before printing, not a date copied from the last print run, different products can have different shelf lives.",
        isKeyRule: false,
      },
      {
        heading: "Stock rotation (FIFO/FEFO)",
        content:
          "- Oldest stock goes out first. When new stock comes in, it goes behind or underneath what's already there, not in front of it.\n- Even when you're following rotation properly, still check the actual best-before date before an order goes out. Rotation order and the 6-month check are both required, doing one doesn't mean you can skip the other.",
        isKeyRule: false,
      },
      {
        heading: "Common questions",
        content:
          "Does the shelf life change if a jar has more sweets in it, or a bigger jar?: No, shelf life comes from the sweet type itself, not the quantity. Each jar only ever has one sweet type, so it's always just that ingredient's shelf life.\nThe stock I've picked for an order is close to 6 months but I'm not 100% sure: Check the actual best-before date rather than estimating. If it's under 6 months, don't send it.\nI'm printing labels and can't remember the shelf life for this product: Check the Shelf-life Reference spreadsheet, don't guess or reuse a date from a different product.\nIsn't a best-before date basically the same as use-by?: No. Best-before is about quality, use-by is about safety. Everything we sell is best-before, since sweets don't have the same safety cut-off that something like dairy or meat would.\nNew stock just arrived, where does it go?: Behind or underneath the existing stock, so the older stock still gets picked first.",
        isKeyRule: false,
      },
    ],
    quizQuestions: [
      {
        question: "What's the minimum shelf life required before stock can be sent out to anyone?",
        options: ["3 months", "6 months", "12 months", "No minimum, just check it's not expired"],
        correctAnswerIndex: 1,
        explanation: "Sweet Disorder's hard rule: at least 6 months left on any stock going out the door.",
      },
      {
        question:
          "You're picking stock for an order and the closest jar has 5 months left before its best-before date. What do you do?",
        options: [
          "Send it since it's not expired yet",
          "Pick a different jar with more shelf life left, even if it's less convenient",
          "Send it if the customer doesn't ask",
          "Round it up to 6 months since it's close",
        ],
        correctAnswerIndex: 1,
        explanation: "Under 6 months, don't send it, even if it's the stock closest to hand.",
      },
      {
        question: "What's the difference between a best-before date and a use-by date?",
        options: [
          "They're the same thing",
          "Best-before is about quality; use-by is a safety cut-off",
          "Use-by is only for imported product",
          "Best-before only applies to packaging, not sweets",
        ],
        correctAnswerIndex: 1,
        explanation: "Use-by is a safety cut-off; best-before is about quality. Everything Sweet Disorder sells is best-before.",
      },
      {
        question: "Does a bigger jar, or one with more sweets in it, get a longer shelf life?",
        options: [
          "Yes, more sweets means longer shelf life",
          "No, shelf life comes from the sweet type itself, not the quantity",
          "Only for chocolate products",
          "Yes, but only for wholesale orders",
        ],
        correctAnswerIndex: 1,
        explanation: "Each jar only ever has one sweet type, so shelf life is always just that ingredient's.",
      },
      {
        question: "How do you work out a best-before date for a product you're packing?",
        options: [
          "Copy the date used on the last print run",
          "Check the Shelf-life Reference spreadsheet, then add that shelf life to the packing date",
          "Estimate based on how the sweets look",
          "Use whichever ingredient in the jar has the shortest shelf life",
        ],
        correctAnswerIndex: 1,
        explanation: "Best-before date = packing date + the shelf life figure from the reference spreadsheet.",
      },
      {
        question: "New stock has just arrived. Where does it go relative to existing stock?",
        options: [
          "In front, so it's used first",
          "Behind or underneath the existing stock, so older stock is still picked first",
          "Wherever there's space",
          "It doesn't matter as long as it's dated",
        ],
        correctAnswerIndex: 1,
        explanation: "FIFO/FEFO rotation: new stock goes behind or underneath what's already there.",
      },
    ],
  },
  {
    id: "mod-calibration",
    slug: "calibration",
    title: "Calibration",
    sourceDocument: "Calibration Training Guide",
    createdAt: "2026-07-01T09:10:00.000Z",
    sections: [
      {
        heading: "Overview",
        content:
          "Every jar we sell has a weight printed on the label, and by law it has to weigh at least that much, every time. Calibration is how we make sure the scales are actually telling the truth, and the overfill policy is how we make sure natural variation in the sweets never lets a jar slip under that weight.",
        isKeyRule: false,
      },
      {
        heading: "The one rule that matters most",
        content:
          "If a scale's reading looks off, stop weighing product on it. Fix it first, weigh second, never the other way around.",
        isKeyRule: true,
      },
      {
        heading: "Why this matters",
        content:
          "A jar can legally weigh more than the label says. It can never legally weigh less. Selling underweight product is against the law, not just bad customer service, so this isn't a box-ticking exercise, it's what keeps the business on the right side of trade measurement rules.\n\nLoose sweets aren't uniform, some pack tighter than others depending on shape and size, so filling exactly to label weight isn't reliable. That's why we deliberately fill a bit over, usually around 20 grams over the labelled weight, so every jar clears the legal minimum even when the sweets vary a little from batch to batch.",
        isKeyRule: false,
      },
      {
        heading: "Calibrating a scale (AM and PM)",
        content:
          "1. Before weighing any product, check the scale against the known reference weight (or its built-in calibration check).\n2. Write the actual reading down in the Scale Calibration Log, next to the target reading for that scale.\n3. If it matches (within tolerance), you're good to go.\n4. If it doesn't, don't weigh product on that scale. Sort it out first, whether that's recalibrating, adjusting, or grabbing a different scale, and note what you did in the 'Corrective Action' column.\n5. Do the same check again at the midway point of the day (the PM check), before you go back to weighing after any break.",
        isKeyRule: false,
      },
      {
        heading: "Filling in the log",
        content:
          "- Print a fresh log each week and keep it at the scale, it's meant to be filled in by hand on the spot, not from memory later.\n- Every row is one scale, one time of day, date, scale number, actual reading, target reading, corrective action if needed, your initials, and any notes.\n- The Target Reading isn't the same as the label weight, it's the label weight plus the overfill buffer for that product. If you're not sure what the target should be for a particular product, ask rather than guess.\n- An empty 'Corrective Action' box is fine, it just means the check was within tolerance and nothing needed fixing.",
        isKeyRule: false,
      },
      {
        heading: "Common questions",
        content:
          "Why are we filling jars heavier than the label says?: It's deliberate. Sweets vary in density, so a small overfill buffer (usually ~20g) makes sure every jar clears the legal minimum weight, not just most jars.\nThe scale's reading is a bit off, is that a big deal?: Yes, stop weighing product on it until it's sorted. Log what happened and what you did about it.\nI forgot to do the PM check: Do it now if product is still being weighed today, and note the late check in the log. Don't skip it or backdate it.\nI'm not sure what the target reading should be for a product: Ask, rather than guess. The target depends on that product's label weight plus its overfill tolerance, and that can differ between products.\nCan I just eyeball it if the scale's being slow to check?: No. If it's not calibrated and logged, don't weigh product on it, even under time pressure.",
        isKeyRule: false,
      },
    ],
    quizQuestions: [
      {
        question: "What should you do if a scale's reading looks off?",
        options: [
          "Keep going carefully",
          "Stop weighing product on it until it's fixed",
          "Weigh a bit heavier to compensate",
          "Only worry about it if it's very off",
        ],
        correctAnswerIndex: 1,
        explanation: "Fix it first, weigh second, never the other way around.",
      },
      {
        question: "Can a jar legally weigh less than the label says?",
        options: [
          "Yes, as long as it's close",
          "No, never, it can weigh more, never less",
          "Only for wholesale orders",
          "Yes, up to 5% under",
        ],
        correctAnswerIndex: 1,
        explanation: "Selling underweight product is against the law, not just bad customer service.",
      },
      {
        question: "Why do we deliberately fill jars heavier than the label weight?",
        options: [
          "To use up excess stock",
          "Because sweets vary in density, so an overfill buffer (~20g) makes sure every jar clears the legal minimum",
          "Because customers prefer heavier jars",
          "It's not deliberate, it just happens",
        ],
        correctAnswerIndex: 1,
        explanation: "Loose sweets aren't uniform, so a deliberate overfill buffer keeps every jar over the legal minimum.",
      },
      {
        question: "When should you calibrate a scale?",
        options: [
          "Once a week",
          "AM and again at the midway point of the day (PM), before weighing after a break",
          "Only when it looks wrong",
          "Once when it's first installed",
        ],
        correctAnswerIndex: 1,
        explanation: "Both an AM and a PM check are required, every day.",
      },
      {
        question: "You forgot to do the PM check and there's still product being weighed today. What do you do?",
        options: [
          "Skip it and do it tomorrow",
          "Do it now, and note the late check in the log",
          "Backdate the log entry",
          "Ignore it since the AM check was fine",
        ],
        correctAnswerIndex: 1,
        explanation: "Don't skip it or backdate it — do it now and note that it was late.",
      },
      {
        question: "You're not sure what the Target Reading should be for a product. What do you do?",
        options: [
          "Guess based on similar products",
          "Ask, rather than guess, the target is the label weight plus that product's overfill tolerance",
          "Use the label weight exactly",
          "Leave that row blank",
        ],
        correctAnswerIndex: 1,
        explanation: "The target can differ between products, so ask rather than guess.",
      },
    ],
  },
  {
    id: "mod-pest-control",
    slug: "pest-control",
    title: "Pest Control",
    sourceDocument: "Pest Control Training Guide",
    createdAt: "2026-07-01T09:15:00.000Z",
    sections: [
      {
        heading: "Overview",
        content:
          "We keep pests out of Sweet Disorder by keeping the place clean, not by running bait stations or traps. That means everyone's eyes matter, you don't need to be an expert, you just need to notice something and say something.",
        isKeyRule: false,
      },
      {
        heading: "The one rule that matters most",
        content:
          "If you see a possible sign of pests, don't clean it up or ignore it, report it straight away.",
        isKeyRule: true,
      },
      {
        heading: "What counts as a sign?",
        content:
          "You're not expected to know what caused it, just to recognise that something's worth flagging. That includes:\n\n- Droppings, even just a little.\n- Scratch or gnaw marks on packaging, walls, or boxes.\n- A nest, or anything that looks like nesting material.\n- Dead insects in numbers that seem unusual, or live insects that shouldn't be there.\n- A musty or strange smell in storage areas.\n- Actually seeing a pest, dead or alive.",
        isKeyRule: false,
      },
      {
        heading: "What to do if you spot something",
        content:
          "1. Stop. Leave it where it is, don't clean it up yet.\n2. If it's near stock or ingredients, move that stock aside and don't use or sell it until it's been checked.\n3. Tell Molly straight away, don't wait until the end of your shift.\n4. Molly (or whoever's handling it) logs it in the Pest Sighting Register and calls NZ Pest Control for advice.\n5. Whatever NZ Pest Control advises gets written down and followed through.\n\nThat's it, your job is really just steps 1 to 3, stop, isolate if needed, and tell someone. You're not expected to identify the pest, treat anything yourself, or decide whether it's serious, that's what the call to NZ Pest Control is for.",
        isKeyRule: false,
      },
      {
        heading: "A worked example",
        content:
          "Here's what a real report might look like, so you know roughly what 'good' looks like.\n\nDate & time: 12 March 2026, 8:10am\nLocation: Dry storage shelving, warehouse\nSign observed: Small droppings, corner of bottom shelf\nReported by: Whoever found it, straight away\nImmediate action: Shelf area isolated, nearby stock moved and checked, no contamination found\nPest control contacted?: Yes, same morning\nAdvice given: Likely mouse activity, inspection and treatment booked for that week, and a reminder to check the loading bay door seal\nFollow-up: Door seal checked and replaced a couple of days later\nResolved: No further signs after treatment\n\nNotice what actually happened here, someone noticed something small, said something immediately, and it got sorted within days with a full written record. That's the whole point of the process, catch it early, write it down, get proper advice, done.",
        isKeyRule: false,
      },
      {
        heading: "Not sure if something counts?",
        content: "Report it anyway. A false alarm costs five minutes. A missed sign doesn't.",
        isKeyRule: false,
      },
    ],
    quizQuestions: [
      {
        question: "You notice small droppings near dry storage. What's the first thing you should do?",
        options: [
          "Clean it up quickly so no one else sees it",
          "Stop, leave it where it is, don't clean it up yet",
          "Ignore it since it's probably nothing",
          "Move all the stock in the warehouse immediately",
        ],
        correctAnswerIndex: 1,
        explanation: "Stop and leave it as-is — cleaning it up destroys evidence NZ Pest Control might need.",
      },
      {
        question: "What's the rule if you spot a possible sign of pests?",
        options: [
          "Only report it if you're sure it's actually pests",
          "Report it straight away, don't clean it up or ignore it",
          "Deal with it yourself if it looks minor",
          "Wait until the end of your shift to mention it",
        ],
        correctAnswerIndex: 1,
        explanation: "The one rule that matters most: report it straight away, don't clean up or ignore it.",
      },
      {
        question: "Are you expected to identify the pest or treat it yourself?",
        options: [
          "Yes, that's the main part of your job",
          "No, your job is to stop, isolate if needed, and tell someone; NZ Pest Control handles the rest",
          "Yes, but only for insects, not rodents",
          "Only if Molly is unavailable",
        ],
        correctAnswerIndex: 1,
        explanation: "Steps 1 to 3 (stop, isolate, tell someone) are the whole of your job here.",
      },
      {
        question: "You spot something odd near stock or ingredients. What should you do with that stock?",
        options: [
          "Leave it exactly where it is and keep selling from it",
          "Move it aside and don't use or sell it until it's been checked",
          "Throw it out immediately just in case",
          "Mark it down for a quick clearance sale",
        ],
        correctAnswerIndex: 1,
        explanation: "Isolate nearby stock until it's been checked, rather than continuing to sell it.",
      },
      {
        question: "You're not sure if what you saw actually counts as a pest sign. What should you do?",
        options: [
          "Don't report it unless you're certain",
          "Report it anyway, a false alarm costs five minutes, a missed sign doesn't",
          "Ask a coworker to double check before saying anything to Molly",
          "Take a photo and decide at the end of the week",
        ],
        correctAnswerIndex: 1,
        explanation: "A false alarm costs five minutes. A missed sign doesn't.",
      },
      {
        question: "Who actually calls NZ Pest Control for advice once something is reported?",
        options: [
          "You, straight away, before telling anyone else",
          "Molly (or whoever's handling it), after logging it in the Pest Sighting Register",
          "Whichever staff member is free",
          "No one, pest control checks in on a fixed schedule regardless",
        ],
        correctAnswerIndex: 1,
        explanation: "Your job stops at reporting it — Molly (or whoever's handling it) logs it and makes the call.",
      },
    ],
  },
  {
    id: "mod-supplier-records-traceability",
    slug: "supplier-records-traceability",
    title: "Supplier Records & Traceability",
    sourceDocument: "Supplier Records and Traceability Training Guide",
    createdAt: "2026-07-01T09:20:00.000Z",
    sections: [
      {
        heading: "Overview",
        content:
          "Welcome to Sweet Disorder. This guide walks you through two everyday processes you'll use often: keeping track of our suppliers, and keeping track of what we've packed and sold. Neither is complicated, but both matter a lot, they're what let us prove where every sweet in a jar came from, and find it again fast if we ever needed to.\n\nThis is written assuming you've never done either of these before. If anything here doesn't match what you're actually being asked to do day to day, stop and ask rather than guess, these records only work if they're accurate.",
        isKeyRule: false,
      },
      {
        heading: "Where everything lives",
        content:
          "Sweet Disorder Supplier Records.xlsx: Every approved supplier, what they supply, and their contact details.\nSweet Disorder Traceability Register.xlsx: Batch and Lot Register, Distribution Log, and Mock Recall Test Log.",
        isKeyRule: false,
      },
      {
        heading: "Before you order from a supplier",
        content:
          "1. Open Sweet_Disorder_Supplier_Records.xlsx.\n2. Go to the Suppliers tab, it's the first tab after Instructions, and lists every supplier in plain English.\n3. Find the supplier you want to order from and check the 'Approved Supplier?' column.\n4. If it says Y, you're good to order.\n5. If it says N, or the supplier isn't listed at all, do not place the order yet, see below.",
        isKeyRule: false,
      },
      {
        heading: "Adding a brand new supplier",
        content:
          "This only needs to happen once per supplier, when we use them for the first time.\n\n1. Get their food safety certificate or, for non-food suppliers, confirm they can meet what we need. For anything that touches product directly (like jars), get their food-grade / food-contact-safe certificate.\n2. If they supply an ingredient, get an allergen declaration from them, this just means a note confirming what allergens are or aren't in what they supply.\n3. Get their contact details: business name, contact person, phone, email, and address.\n4. Ask how long it takes to place an order and how long delivery takes.\n5. Add all of this to the right category tab (Sweets, Packaging, Merchandise, or Key Rings), and mark 'Onboarding Check Completed' as Y with today's date.\n6. Only once you have the certificate/compliance document on file too, mark 'Approved Supplier?' as Y.",
        isKeyRule: false,
      },
      {
        heading: "If in doubt",
        content:
          "Don't mark a supplier Approved until every check above is done and filed. It's fine to leave it as N while you wait on paperwork.",
        isKeyRule: true,
      },
      {
        heading: "Every time a delivery arrives",
        content:
          "1. Check the delivery includes a Certificate of Analysis (for ingredients) or compliance document, and a batch or lot number printed somewhere on the packaging or paperwork.\n2. If it's missing, don't use the stock yet, put it aside and flag it to Molly.\n3. If it's there, file the document and note the batch/lot number, you'll need it for the traceability steps below.",
        isKeyRule: false,
      },
      {
        heading: "One sweet type per packing run",
        content:
          "Never mix two different supplier batches of the same sweet in the same run. If a delivery runs out partway through, stop, that run is finished, and the next batch starts a new run with its own code.",
        isKeyRule: true,
      },
      {
        heading: "When you pack a batch (e.g. filling jars)",
        content:
          "1. Open Sweet_Disorder_Traceability_Register.xlsx and go to the Batch & Lot Register tab.\n2. Add a new row with: the supplier's batch/lot code, the supplier's name, what you're packing (e.g. 'Chocolate fish, packed into You Rock jars'), today's date, and how many units you packed.\n3. Leave the Best-before Date field for whoever manages that (it depends on the shelf-life rules, which you don't need to work out yourself).\n4. Write your name in 'Packed By'.",
        isKeyRule: false,
      },
      {
        heading: "When an order goes out (retail, wholesale, stockist, or bespoke)",
        content:
          "1. Go to the Distribution Log tab.\n2. Add a row with: the supplier batch/lot code you're shipping, today's date, the channel (Retail, Wholesale, Stockist, or Bespoke/Corporate), and who it's going to.\n3. For a retail sale straight to a customer (Shopify or in-shop), you don't need their name, just write 'Retail, direct to consumer'.\n4. For wholesale, stockist, or bespoke orders, always write the business or customer name.\n\nIf one order uses two different batches, for example 20 units where 10 come from one batch and 10 from another, add two rows, one per batch, and give both the same Order/Invoice Reference so it's clear they're the same order.",
        isKeyRule: false,
      },
      {
        heading: "Mock recall tests",
        content:
          "Once a year, someone (usually Molly) will run a practice trace test, picking a real batch and checking we can find where it came from and where it went, using only what's written down. You don't need to run this yourself, but if you're asked to help find something for one, treat it like the real thing, that's exactly what it's practising for.",
        isKeyRule: false,
      },
      {
        heading: "Common questions",
        content:
          "A supplier isn't in the spreadsheet yet: Don't order from them until they're onboarded, see 'Adding a brand new supplier' above.\nA delivery arrives with no batch/lot code visible: Put the stock aside, don't use it, and flag it to Molly.\nYou're not sure if a supplier is approved: Check the 'Approved Supplier?' column on the Suppliers tab, if it's not a clear Y, ask before ordering.\nAn order is being split across two batches: Log two rows in the Distribution Log with the same Order/Invoice Reference.\nYou've made a mistake in a record: Don't delete it, correct it and leave a comment noting what changed and why, the history matters as much as the current entry.\nYou're not sure what to do: Ask Molly before guessing. These records only work if they're accurate, a quick question is always better than a guess.",
        isKeyRule: false,
      },
    ],
    quizQuestions: [
      {
        question: "Before ordering from a supplier, what should you check in Sweet_Disorder_Supplier_Records.xlsx?",
        options: [
          "Their bank account details",
          "The 'Approved Supplier?' column on the Suppliers tab",
          "Whether they're the cheapest option",
          "Nothing, you can order from anyone",
        ],
        correctAnswerIndex: 1,
        explanation: "If it isn't a clear Y, don't place the order yet.",
      },
      {
        question: "A new supplier isn't marked 'Approved' yet, but you need stock urgently. What do you do?",
        options: [
          "Order anyway, the paperwork can catch up later",
          "Don't place the order, it's fine to leave the supplier as N while you wait on paperwork",
          "Mark 'Approved Supplier?' as Y yourself so the order can go ahead",
          "Ask Molly to verbally approve it instead of updating the spreadsheet",
        ],
        correctAnswerIndex: 1,
        explanation: "Don't mark a supplier Approved until every onboarding check is done and filed.",
      },
      {
        question: "What's the rule about mixing supplier batches within one packing run?",
        options: [
          "It's fine as long as they're the same sweet type",
          "Never mix two different supplier batches of the same sweet in the same run, a new batch starts a new run",
          "You can mix them if you note it in the comments",
          "Only mix them for retail orders, never wholesale",
        ],
        correctAnswerIndex: 1,
        explanation: "One sweet type per packing run — a delivery running out partway through means that run is finished.",
      },
      {
        question: "A delivery arrives with no batch or lot number visible anywhere. What do you do?",
        options: [
          "Use it anyway and note 'unknown batch' in the register",
          "Put the stock aside, don't use it, and flag it to Molly",
          "Assign it the previous delivery's batch code",
          "Throw it out immediately",
        ],
        correctAnswerIndex: 1,
        explanation: "Don't use it yet — put it aside and flag it to Molly.",
      },
      {
        question:
          "An order of 20 units is split across two supplier batches (10 from each). How do you log it in the Distribution Log?",
        options: [
          "One row covering both batches",
          "Two rows, one per batch, both sharing the same Order/Invoice Reference",
          "Two separate Order/Invoice References so they don't get confused",
          "Just log the larger batch",
        ],
        correctAnswerIndex: 1,
        explanation: "Two rows, one per batch, with the same Order/Invoice Reference so it's clear they're the same order.",
      },
      {
        question: "You spot a mistake in a traceability record you filled in earlier. What should you do?",
        options: [
          "Delete it and re-enter it correctly",
          "Correct it and leave a comment noting what changed and why",
          "Leave it, close enough is fine",
          "Ask Molly to delete the whole row",
        ],
        correctAnswerIndex: 1,
        explanation: "Don't delete it — correct it and leave a comment. The history matters as much as the current entry.",
      },
    ],
  },
  // -------------------------------------------------------------------------
  // Placeholder modules — topics from Staff_Training_record.xlsx with no
  // written guide yet. sourceDocument stays null and sections/quizQuestions
  // stay empty so these surface in the admin list as "content needed" rather
  // than being silently missing.
  // -------------------------------------------------------------------------
  {
    id: "mod-heat-gun",
    slug: "heat-gun",
    title: "Heat Gun",
    sourceDocument: null,
    sections: [],
    quizQuestions: [],
    createdAt: "2026-07-01T09:25:00.000Z",
  },
  {
    id: "mod-lifting",
    slug: "lifting",
    title: "Lifting",
    sourceDocument: null,
    sections: [],
    quizQuestions: [],
    createdAt: "2026-07-01T09:26:00.000Z",
  },
  {
    id: "mod-general-hazards",
    slug: "general-hazards",
    title: "General Hazards",
    sourceDocument: null,
    sections: [],
    quizQuestions: [],
    createdAt: "2026-07-01T09:27:00.000Z",
  },
  {
    id: "mod-cleaning-routine",
    slug: "cleaning-routine",
    title: "General Cleaning Routine",
    sourceDocument: null,
    sections: [],
    quizQuestions: [],
    createdAt: "2026-07-01T09:28:00.000Z",
  },
  {
    id: "mod-staff-sickness",
    slug: "staff-sickness",
    title: "Staff Sickness",
    sourceDocument: null,
    sections: [],
    quizQuestions: [],
    createdAt: "2026-07-01T09:29:00.000Z",
  },
  {
    id: "mod-suppliers",
    slug: "suppliers",
    title: "Suppliers",
    sourceDocument: null,
    sections: [],
    quizQuestions: [],
    createdAt: "2026-07-01T09:30:00.000Z",
  },
  {
    id: "mod-sales-of-products",
    slug: "sales-of-products",
    title: "Sales of Products",
    sourceDocument: null,
    sections: [],
    quizQuestions: [],
    createdAt: "2026-07-01T09:31:00.000Z",
  },
];

export const mockStaffTrainingProgress: StaffTrainingProgress[] = [
  {
    id: "prog-ange-hygiene",
    staffName: "Ange",
    moduleId: "mod-hygiene",
    status: "completed",
    quizScore: 100,
    quizAttempts: 1,
    completedAt: "2026-06-02T04:30:00.000Z",
    trainerInitial: "MT",
  },
  {
    id: "prog-ange-best-before",
    staffName: "Ange",
    moduleId: "mod-best-before-shelf-life",
    status: "completed",
    quizScore: 83,
    quizAttempts: 2,
    completedAt: "2026-06-05T05:00:00.000Z",
    trainerInitial: "MT",
  },
  {
    id: "prog-ange-calibration",
    staffName: "Ange",
    moduleId: "mod-calibration",
    status: "in_progress",
    quizScore: null,
    quizAttempts: 0,
    completedAt: null,
    trainerInitial: null,
  },
  {
    id: "prog-charlie-hygiene",
    staffName: "Charlie",
    moduleId: "mod-hygiene",
    status: "completed",
    quizScore: 100,
    quizAttempts: 1,
    completedAt: "2026-06-03T03:15:00.000Z",
    trainerInitial: "MT",
  },
  {
    id: "prog-charlie-best-before",
    staffName: "Charlie",
    moduleId: "mod-best-before-shelf-life",
    status: "in_progress",
    quizScore: null,
    quizAttempts: 0,
    completedAt: null,
    trainerInitial: null,
  },
  {
    id: "prog-charlie-pest-control",
    staffName: "Charlie",
    moduleId: "mod-pest-control",
    status: "completed",
    quizScore: 100,
    quizAttempts: 1,
    completedAt: "2026-06-20T02:45:00.000Z",
    trainerInitial: "MT",
  },
  {
    id: "prog-molly-hygiene",
    staffName: "Molly",
    moduleId: "mod-hygiene",
    status: "completed",
    quizScore: 100,
    quizAttempts: 1,
    completedAt: "2026-05-20T01:00:00.000Z",
    trainerInitial: "MT",
  },
  {
    id: "prog-molly-best-before",
    staffName: "Molly",
    moduleId: "mod-best-before-shelf-life",
    status: "completed",
    quizScore: 100,
    quizAttempts: 1,
    completedAt: "2026-05-20T01:10:00.000Z",
    trainerInitial: "MT",
  },
  {
    id: "prog-molly-calibration",
    staffName: "Molly",
    moduleId: "mod-calibration",
    status: "completed",
    quizScore: 100,
    quizAttempts: 1,
    completedAt: "2026-05-20T01:20:00.000Z",
    trainerInitial: "MT",
  },
  {
    id: "prog-molly-pest-control",
    staffName: "Molly",
    moduleId: "mod-pest-control",
    status: "completed",
    quizScore: 100,
    quizAttempts: 1,
    completedAt: "2026-05-20T01:30:00.000Z",
    trainerInitial: "MT",
  },
  {
    id: "prog-molly-supplier-records",
    staffName: "Molly",
    moduleId: "mod-supplier-records-traceability",
    status: "completed",
    quizScore: 100,
    quizAttempts: 1,
    completedAt: "2026-05-20T01:40:00.000Z",
    trainerInitial: "MT",
  },
];
