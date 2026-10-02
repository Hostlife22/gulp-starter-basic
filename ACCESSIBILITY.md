# Accessibility

The canvas has a text description. The complete twenty-work catalogue uses semantic buttons with titles, dates and an active state. Controls and catalogue remain usable without interpreting animation or colour.

Tab moves between controls; focus outlines are visible. The slider supports arrow keys and announces seconds. Space toggles play outside native controls. H hides/restores controls, and Escape restores them. A skip link goes to the catalogue. Touch controls are at least 44 CSS pixels high.

`prefers-reduced-motion` starts with the complete gallery at 48 seconds, paused. Playback requires an explicit action. The preference is read at page load. Background tabs suspend time without advancing the animation.

On phones the overview has two columns and scrolls through all twenty works. Individual scenes remain square, with captions below. Short desktop windows scroll to the controls and catalogue rather than cropping them.

Known limits: canvas artwork is not individually described in the level of detail available visually. Tiny museum labels in the desktop overview mirror the reference; equivalent readable text is available in the catalogue. Canvas 2D is required for artwork; if it fails, a visible error is shown and the text catalogue remains. LOW POLY uses no WebGL and has no GPU-specific failure path. The source soundtrack is enabled by default and has a mute control. If the browser blocks audible autoplay, a status message asks for a click or key press. No flashing strobe is included. Screen-reader use has not been tested with a human operator.
