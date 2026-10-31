# The Leap brand board

A one-page presentation of The Leap identity (Leap Arc mark, "the leap"
wordmark, orange / charcoal / cream) applied across mockups: logo tiles,
T-shirt, collared shirt, container office with a round sign, smartphone
(the app's welcome screen), staff ID card, coffee cup and mug, and a
podcast studio.

- `the-leap-brand-board.png`: 4000 × 7020 px, for screens and print.
- `the-leap-brand-board.pdf`: vector, scales to any size.

The mockups are vector illustrations, not photographs. For photo-real
mockups, place the files from `../the-leap-logo/` into photo mockup
templates (Canva, Photoshop and similar).

## Regenerating

`build.py` writes the board as HTML using the logo kit's outlined paths:

    python build.py ../the-leap-logo board.html

It expects `avatar.jpg` (the ID card photo) and the Sora and Karla web
fonts (`sora.woff2`, `karla.woff2`) next to `board.html`. Render with
headless Chrome:

    chrome --headless=new --allow-file-access-from-files \
      --force-device-scale-factor=2.5 --window-size=1600,2808 \
      --screenshot=the-leap-brand-board.png file://$PWD/board.html
