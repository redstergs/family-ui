# Accessibility contract (draft)

- Aim for WCAG 2.2 AA: normal text >=4.5:1, large text and critical component boundaries >=3:1.
- All inputs have persistent labels, optional help and linked errors (aria-describedby).
- Mark invalid fields using aria-invalid and visible text, not color alone.
- Real native controls, logical tab order, screenreader names and visible keyboard focus.
- Interactive targets ideally >=44x44 CSS px; form controls 48px high.
- Never automatically focus destructive actions; provide a safe cancel path.
- Dialogs use native <dialog> showModal(), restore focus when closed and support Escape as appropriate.
- Form validation should not flag untouched fields upon first load.
- Never depend on animation; respect prefers-reduced-motion.
- Ensure overlays account for virtual keyboards and safe areas.
- Product-specific security controls must retain their own verified safeguards.
