# Design principles (draft for Family UI 0.1.0)

## Identity
- One shared neutral background and typography system, four distinct product accent themes.
- Food green retains its existing identity. Door's current **blue lock action** remains protected from automatic recoloring during any future migration. The draft Door accent is for navigation and identity; final visual integration needs a live-screen review.
- The theme accent is **not** a semantic success/error indicator.

## Mobile first
- <600px: bottom navigation (safe area included).
- 600–899px: left navigation rail.
- >=900px: left navigation with labels.
- Breakpoints are proposals, to test against real content. Preserve view and user state when resizing.

## Typography and layout
- System font, 16px body, 14px secondary, 12px noncritical metadata.
- Space: 4, 8, 12, 16, 24, 32px.
- Radius: 6, 10, 14, 20px.
- Avoid cards inside cards where a simple list and separators work.

## Large primary action
- A rare, single, prominent 148x148px round control; 138px for very narrow screens.
- Family Door’s real door controls and confirmations remain **entirely app-owned**. This library must never send door commands, infer authority or implement its security policy.
- Another product may use the same visual treatment for e.g. “Workout beginnen”.

## Application autonomy
- No shared accounts, DB, tasks, services, app runtime or domain logic.
- Use versioned releases and explicit per-app updates.
- Julia's English Quest is deliberately excluded.
