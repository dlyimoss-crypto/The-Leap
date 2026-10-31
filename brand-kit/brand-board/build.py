"""Builds The Leap brand board (HTML with inline SVG mockups).

Usage: python build.py <brand-kit/the-leap-logo dir> <out.html>
"""
import re
import sys

KIT, OUT = sys.argv[1], sys.argv[2]


def path_d(file):
    return re.search(r' d="([^"]+)"', open(file).read()).group(1)


GLYPH = path_d(f"{KIT}/black/the-leap-mark.svg")
WORD = path_d(f"{KIT}/black/the-leap-wordmark.svg")
WORD_RATIO = 270.46 / 64

ORANGE = "#FF7A00"
CREAM = "#FAF7F2"
CHAR = "#1E1E1E"


# ── Logo helpers (coordinates in the enclosing SVG's px) ──────────────────
def mark(x, y, size, color):
    return f'<use href="#glyph" x="{x}" y="{y}" width="{size}" height="{size}" fill="{color}"/>'


def word(x, y, h, color):
    return f'<use href="#word" x="{x}" y="{y}" width="{h * WORD_RATIO:.1f}" height="{h}" fill="{color}"/>'


def icon(x, y, size, bg, fg):
    return (f'<rect x="{x}" y="{y}" width="{size}" height="{size}" rx="{size * 0.22:.1f}" fill="{bg}"/>'
            + mark(x, y, size, fg))


def lockup(x, y, size, bg, fg, word_color):
    """App icon + 'the leap', vertically centred on the icon."""
    wh = size * 0.78
    return icon(x, y, size, bg, fg) + word(x + size * 1.22, y + (size - wh) / 2 + wh * 0.02, wh, word_color)


def lockup_width(size):
    return size * 1.22 + size * 0.78 * WORD_RATIO


# ── Tiles ────────────────────────────────────────────────────────────────
def tile(w, h, body, defs="", bg=None, cls=""):
    style = f' style="background:{bg}"' if bg else ""
    return (f'<div class="tile {cls}"{style}><svg viewBox="0 0 {w} {h}" width="{w}" height="{h}">'
            f"<defs>{defs}</defs>{body}</svg></div>")


def t_logo_white():
    w, h, s = 504, 360, 92
    x = (w - lockup_width(s)) / 2
    return tile(w, h, lockup(x, (h - s) / 2, s, ORANGE, CREAM, "#2A2A2A"), bg="#FFFFFF")


def t_logo_orange():
    w, h, s = 630, 360, 150
    wh = 88
    total = s * 0.86 + wh * WORD_RATIO
    x = (w - total) / 2
    body = mark(x - s * 0.18, (h - s) / 2, s, "#FFFFFF") + word(x + s * 0.74, (h - wh) / 2 + 4, wh, "#FFFFFF")
    return tile(w, h, body, bg=f"linear-gradient(135deg,#FF8A1F,{ORANGE} 55%,#E8590C)")


def t_logo_black():
    w, h = 378, 360
    body = mark((w - 190) / 2, 40, 190, ORANGE) + word((w - 52 * WORD_RATIO) / 2, 252, 52, "#FFFFFF")
    return tile(w, h, body, bg="#141414")


TSHIRT = ("M 205 62 Q 300 118 395 62 L 478 92 Q 520 108 545 150 L 590 228 L 500 276 L 462 222 "
          "L 462 528 Q 300 546 138 528 L 138 222 L 100 276 L 10 228 L 55 150 Q 80 108 122 92 Z")


def t_tshirt():
    w, h = 756, 600
    ox, oy = 78, 28
    defs = f'''
      <clipPath id="tee"><path d="{TSHIRT}"/></clipPath>
      <linearGradient id="teeShade" x1="0" x2="1">
        <stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset=".25" stop-color="#000" stop-opacity="0"/>
        <stop offset=".75" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/>
      </linearGradient>
      <radialGradient id="teeHi" cx=".45" cy=".35" r=".6">
        <stop offset="0" stop-color="#fff" stop-opacity=".09"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>'''
    body = f'''
      <ellipse cx="{w/2}" cy="{oy+548}" rx="270" ry="16" fill="#000" opacity=".12"/>
      <g transform="translate({ox} {oy})">
        <path d="{TSHIRT}" fill="#1A1A1A"/>
        <g clip-path="url(#tee)">
          <path d="M -40 600 C 60 420 190 520 300 430 S 520 300 660 360" fill="none" stroke="{ORANGE}" stroke-width="64" stroke-linecap="round"/>
          <rect x="0" y="0" width="600" height="560" fill="url(#teeShade)"/>
          <rect x="0" y="0" width="600" height="560" fill="url(#teeHi)"/>
          <path d="M 180 300 Q 200 380 190 470" stroke="#000" stroke-opacity=".25" stroke-width="3" fill="none"/>
          <path d="M 420 320 Q 405 400 415 480" stroke="#000" stroke-opacity=".2" stroke-width="3" fill="none"/>
        </g>
        <path d="M 205 62 Q 300 118 395 62" fill="none" stroke="#2C2C2C" stroke-width="12"/>
        <path d="M 100 276 L 10 228" stroke="#2C2C2C" stroke-width="8"/><path d="M 500 276 L 590 228" stroke="#2C2C2C" stroke-width="8"/>
        {mark(300 - 92, 150, 54, ORANGE)}
        {word(300 - 36, 160, 34, "#FFFFFF")}
      </g>'''
    return tile(w, h, body, defs, bg="linear-gradient(160deg,#EFEBE5,#D8D1C7)")


def t_shirt():
    w, h = 756, 600
    ox, oy = 78, 28
    defs = f'''
      <clipPath id="shirt"><path d="{TSHIRT}"/></clipPath>
      <linearGradient id="shirtShade" x1="0" x2="1">
        <stop offset="0" stop-color="#7A6E60" stop-opacity=".35"/><stop offset=".22" stop-color="#7A6E60" stop-opacity="0"/>
        <stop offset=".78" stop-color="#7A6E60" stop-opacity="0"/><stop offset="1" stop-color="#7A6E60" stop-opacity=".35"/>
      </linearGradient>'''
    buttons = "".join(f'<circle cx="300" cy="{y}" r="5.5" fill="#D9D2C6" stroke="#C4BBAD"/>' for y in (175, 245, 315, 385, 455))
    body = f'''
      <ellipse cx="{w/2}" cy="{oy+548}" rx="270" ry="16" fill="#000" opacity=".35"/>
      <g transform="translate({ox} {oy})">
        <path d="{TSHIRT}" fill="#F4F1EB"/>
        <g clip-path="url(#shirt)">
          <rect x="0" y="0" width="600" height="560" fill="url(#shirtShade)"/>
          <path d="M 300 108 L 300 560" stroke="#DDD6CA" stroke-width="22"/>
          <path d="M 289 108 L 289 560 M 311 108 L 311 560" stroke="#CFC7BA" stroke-width="1.5"/>
        </g>
        {buttons}
        <polygon points="210,56 300,38 390,56 300,112" fill="#D4CCBF"/>
        <polygon points="300,112 206,54 232,150" fill="#ECE7DF" stroke="#CFC7BA" stroke-width="2"/>
        <polygon points="300,112 394,54 368,150" fill="#ECE7DF" stroke="#CFC7BA" stroke-width="2"/>
        <rect x="340" y="196" width="104" height="92" rx="8" fill="#EFEAE2" stroke="#CFC7BA" stroke-width="2"/>
        <path d="M 340 214 L 444 214" stroke="#CFC7BA" stroke-width="2"/>
        {icon(350, 234, 26, ORANGE, CREAM)}
        {word(381, 240, 13.5, "#2A2A2A")}
        <path d="M 100 276 L 10 228" stroke="#DCD5C9" stroke-width="10"/><path d="M 500 276 L 590 228" stroke="#DCD5C9" stroke-width="10"/>
      </g>'''
    return tile(w, h, body, defs, bg="linear-gradient(160deg,#2C2C2C,#161616)")


def t_container():
    w, h = 882, 560
    cx, cy, cw, ch = 230, 150, 600, 300
    defs = '''
      <pattern id="corr" width="18" height="10" patternUnits="userSpaceOnUse">
        <rect width="18" height="10" fill="#1F1F1F"/><rect width="9" height="10" fill="#292929"/>
      </pattern>
      <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#9FB6C8"/><stop offset=".55" stop-color="#5D7486"/><stop offset="1" stop-color="#2E3B46"/>
      </linearGradient>
      <radialGradient id="lamp" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="#FFB15C" stop-opacity=".9"/><stop offset="1" stop-color="#FFB15C" stop-opacity="0"/>
      </radialGradient>'''
    body = f'''
      <rect x="0" y="{cy+ch}" width="{w}" height="{h-cy-ch}" fill="#D3C8B9"/>
      <ellipse cx="{cx+cw/2}" cy="{cy+ch+6}" rx="{cw/2+30}" ry="14" fill="#000" opacity=".18"/>
      <rect x="{cx}" y="{cy}" width="{cw}" height="{ch}" fill="url(#corr)"/>
      <rect x="{cx-6}" y="{cy-10}" width="{cw+12}" height="16" rx="3" fill="#141414"/>
      <rect x="{cx-6}" y="{cy+ch-8}" width="{cw+12}" height="16" rx="3" fill="#141414"/>
      <rect x="{cx-6}" y="{cy-10}" width="16" height="{ch+18}" fill="#141414"/>
      <rect x="{cx+cw-10}" y="{cy-10}" width="16" height="{ch+18}" fill="#141414"/>
      <rect x="{cx+42}" y="{cy+62}" width="170" height="112" fill="url(#glass)" stroke="{ORANGE}" stroke-width="7"/>
      <path d="M {cx+127} {cy+62} L {cx+127} {cy+174}" stroke="{ORANGE}" stroke-width="5"/>
      <path d="M {cx+60} {cy+150} L {cx+110} {cy+80}" stroke="#fff" stroke-opacity=".35" stroke-width="6"/>
      {mark(cx+226, cy+92, 70, ORANGE)}
      {word(cx+292, cy+110, 34, "#FFFFFF")}
      <rect x="{cx+cw-110}" y="{cy+92}" width="84" height="{ch-92}" fill="#2B2B2B" stroke="{ORANGE}" stroke-width="6"/>
      <rect x="{cx+cw-100}" y="{cy+110}" width="64" height="60" fill="url(#glass)" opacity=".8"/>
      <circle cx="{cx+cw-40}" cy="{cy+210}" r="5" fill="#C9C9C9"/>
      <rect x="{cx+cw-122}" y="{cy+ch+8}" width="108" height="14" rx="3" fill="#8E8579"/>
      <circle cx="{cx+cw-68}" cy="{cy+76}" r="38" fill="url(#lamp)"/>
      <rect x="{cx+cw-78}" y="{cy+70}" width="20" height="9" rx="3" fill="#111"/>
      <path d="M {cx} {cy+40} L {cx-92} {cy+40}" stroke="#111" stroke-width="8" stroke-linecap="round"/>
      <path d="M {cx-8} {cy+40} L {cx-38} {cy+12}" stroke="#111" stroke-width="5"/>
      <path d="M {cx-118} {cy+44} L {cx-118} {cy+66} M {cx-66} {cy+44} L {cx-66} {cy+66}" stroke="#555" stroke-width="3"/>
      <circle cx="{cx-92}" cy="{cy+140}" r="80" fill="#fff"/>
      <circle cx="{cx-92}" cy="{cy+140}" r="72" fill="{ORANGE}"/>
      {mark(cx-92-46, cy+94, 92, "#FFFFFF")}
      <path d="M 70 {cy+ch} q 10 -60 30 -70 q -2 40 -12 70 Z M 98 {cy+ch} q 18 -50 38 -52 q -12 30 -26 52 Z" fill="#4E6B3A"/>
      <rect x="64" y="{cy+ch-6}" width="72" height="34" rx="4" fill="#2A2A2A"/>'''
    return tile(w, h, body, defs, bg="linear-gradient(180deg,#FBF7F1,#EDE4D8)")


def t_phone():
    w, h = 630, 560
    pw, ph = 252, 500
    px, py = (w - pw) / 2, (h - ph) / 2
    sx, sy, sw, sh = px + 10, py + 10, pw - 20, ph - 20
    defs = f'''
      <clipPath id="screen"><rect x="{sx}" y="{sy}" width="{sw}" height="{sh}" rx="34"/></clipPath>
      <radialGradient id="glowA" cx=".1" cy="-.05" r=".9">
        <stop offset="0" stop-color="#FF8A12" stop-opacity=".95"/><stop offset=".3" stop-color="#E85C0C" stop-opacity=".55"/>
        <stop offset=".6" stop-color="#78280A" stop-opacity=".25"/><stop offset=".8" stop-color="#000" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="glowB" cx="1" cy="0" r=".7">
        <stop offset="0" stop-color="#D63014" stop-opacity=".85"/><stop offset=".7" stop-color="#000" stop-opacity="0"/>
      </radialGradient>
      <filter id="phoneShadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="24" stdDeviation="22" flood-color="#5A1E00" flood-opacity=".45"/>
      </filter>'''
    cxm = sx + sw / 2
    body = f'''
      <g transform="rotate(-6 {w/2} {h/2})">
        <rect x="{px}" y="{py}" width="{pw}" height="{ph}" rx="44" fill="#0F0F0F" filter="url(#phoneShadow)"/>
        <rect x="{px+3}" y="{py+3}" width="{pw-6}" height="{ph-6}" rx="41" fill="none" stroke="#3A3A3A" stroke-width="2"/>
        <g clip-path="url(#screen)">
          <rect x="{sx}" y="{sy}" width="{sw}" height="{sh}" fill="#0B0B0B"/>
          <rect x="{sx}" y="{sy}" width="{sw}" height="{sh}" fill="url(#glowA)"/>
          <rect x="{sx}" y="{sy}" width="{sw}" height="{sh}" fill="url(#glowB)"/>
          {icon(cxm - 34, sy + 150, 68, ORANGE, CREAM)}
          <text x="{cxm}" y="{sy+258}" text-anchor="middle" class="sora" font-size="19" font-weight="700" fill="#fff">Welcome to The Leap</text>
          <text x="{cxm}" y="{sy+280}" text-anchor="middle" class="karla" font-size="10.5" fill="#fff" fill-opacity=".7">Your Essential Companion in Christ</text>
          <rect x="{sx+30}" y="{sy+318}" width="{sw-60}" height="34" rx="17" fill="{ORANGE}"/>
          <text x="{cxm}" y="{sy+340}" text-anchor="middle" class="karla" font-size="12" font-weight="700" fill="#2A2A2A">Get Started</text>
          <text x="{cxm}" y="{sy+376}" text-anchor="middle" class="karla" font-size="11" font-weight="700" fill="{ORANGE}">I already have an account</text>
        </g>
        <rect x="{cxm-36}" y="{sy+12}" width="72" height="20" rx="10" fill="#000"/>
        <rect x="{px+pw-2}" y="{py+120}" width="4" height="60" rx="2" fill="#2A2A2A"/>
      </g>'''
    return tile(w, h, body, defs, bg=f"linear-gradient(140deg,#FF8E2A,{ORANGE} 45%,#DE5208)")


def t_id():
    w, h = 630, 520
    cw, chh = 236, 360
    cx, cy = (w - cw) / 2, 128
    defs = f'''
      <clipPath id="photo"><rect x="{cx+cw/2-62}" y="{cy+102}" width="124" height="124" rx="16"/></clipPath>
      <clipPath id="card"><rect x="{cx}" y="{cy}" width="{cw}" height="{chh}" rx="18"/></clipPath>
      <filter id="cardShadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#000" flood-opacity=".22"/>
      </filter>'''
    strap_words = "".join(
        f'<g transform="translate({x} {y}) rotate({r})">{word(0, 0, 11, "#FFFFFF")}</g>'
        for x, y, r in ((236, 10, 62), (270, 70, 62), (394, 58, 118), (428, -2, 118)))
    body = f'''
      <polygon points="200,-10 250,-10 322,112 296,118" fill="{ORANGE}"/>
      <polygon points="430,-10 380,-10 308,112 334,118" fill="#E8640A"/>
      {strap_words}
      <rect x="{w/2-17}" y="104" width="34" height="28" rx="6" fill="#B8B8B8" stroke="#8F8F8F" stroke-width="2"/>
      <g transform="rotate(3 {w/2} {cy+chh/2})">
        <rect x="{cx}" y="{cy}" width="{cw}" height="{chh}" rx="18" fill="#FFFFFF" filter="url(#cardShadow)"/>
        <g clip-path="url(#card)">
          <rect x="{cx}" y="{cy}" width="{cw}" height="84" fill="{ORANGE}"/>
          <path d="M {cx} {cy+84} Q {cx+cw/2} {cy+104} {cx+cw} {cy+84} L {cx+cw} {cy} L {cx} {cy} Z" fill="{ORANGE}"/>
          <rect x="{cx}" y="{cy+chh-38}" width="{cw}" height="38" fill="#1A1A1A"/>
        </g>
        <rect x="{w/2-22}" y="{cy+12}" width="44" height="9" rx="4.5" fill="#E8E3DB"/>
        {mark(cx+cw/2-80, cy+28, 44, "#FFFFFF")}
        {word(cx+cw/2-34, cy+38, 24, "#FFFFFF")}
        <rect x="{cx+cw/2-66}" y="{cy+98}" width="132" height="132" rx="19" fill="#FFFFFF"/>
        <image href="avatar.jpg" x="{cx+cw/2-62}" y="{cy+102}" width="124" height="124" clip-path="url(#photo)" preserveAspectRatio="xMidYMid slice"/>
        <text x="{cx+cw/2}" y="{cy+256}" text-anchor="middle" class="sora" font-size="17" font-weight="700" fill="#1E1E1E">Pastor Deniss Lyimo</text>
        <text x="{cx+cw/2}" y="{cy+276}" text-anchor="middle" class="karla" font-size="11.5" font-weight="700" fill="{ORANGE}">Founder &amp; Lead Pastor</text>
        <text x="{cx+cw/2}" y="{cy+300}" text-anchor="middle" class="karla" font-size="9.5" fill="#6E6862" letter-spacing="1.5">ID  LEAP-0001</text>
        <text x="{cx+cw/2}" y="{cy+chh-14}" text-anchor="middle" class="karla" font-size="10" font-weight="700" fill="#FFFFFF" letter-spacing="1.2">leapgrow.app</text>
      </g>'''
    return tile(w, h, body, defs, bg="linear-gradient(160deg,#EEE9E2,#DCD5CB)")


def t_coffee():
    w, h = 882, 520
    defs = '''
      <linearGradient id="cupShade" x1="0" x2="1">
        <stop offset="0" stop-color="#C9C0B3"/><stop offset=".3" stop-color="#FAF7F2"/>
        <stop offset=".7" stop-color="#F3EEE7"/><stop offset="1" stop-color="#BDB3A5"/>
      </linearGradient>
      <linearGradient id="sleeveShade" x1="0" x2="1">
        <stop offset="0" stop-color="#0E0E0E"/><stop offset=".35" stop-color="#2A2A2A"/><stop offset="1" stop-color="#0E0E0E"/>
      </linearGradient>
      <linearGradient id="mugShade" x1="0" x2="1">
        <stop offset="0" stop-color="#D45F00"/><stop offset=".35" stop-color="#FF8A1F"/><stop offset="1" stop-color="#C85400"/>
      </linearGradient>'''
    body = f'''
      <ellipse cx="330" cy="418" rx="96" ry="14" fill="#000" opacity=".16"/>
      <polygon points="252,168 408,168 390,410 270,410" fill="url(#cupShade)"/>
      <polygon points="262,236 398,236 391,336 269,336" fill="url(#sleeveShade)"/>
      {mark(296, 248, 70, ORANGE)}
      <rect x="240" y="146" width="180" height="28" rx="9" fill="#151515"/>
      <rect x="256" y="126" width="148" height="26" rx="11" fill="#222"/>
      <rect x="350" y="131" width="28" height="7" rx="3.5" fill="#0A0A0A"/>
      <ellipse cx="590" cy="416" rx="120" ry="15" fill="#000" opacity=".16"/>
      <path d="M 688 268 C 760 268 760 380 688 380" fill="none" stroke="#E46A00" stroke-width="24" stroke-linecap="round"/>
      <rect x="490" y="236" width="200" height="176" rx="20" fill="url(#mugShade)"/>
      <ellipse cx="590" cy="238" rx="100" ry="15" fill="#B94D00"/>
      <ellipse cx="590" cy="240" rx="88" ry="10" fill="#3B2416"/>
      {mark(548, 272, 84, CREAM)}
      {word(549, 360, 22, CREAM)}
      <path d="M 560 214 q -14 -22 0 -44 q 14 -22 0 -44 M 600 212 q -14 -22 0 -44 q 14 -22 0 -44" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="5" stroke-linecap="round"/>'''
    return tile(w, h, body, defs, bg="linear-gradient(160deg,#F3EEE7,#E0D7CB)")


def t_podcast():
    w, h = 1488, 560
    defs = f'''
      <pattern id="slats" width="26" height="10" patternUnits="userSpaceOnUse">
        <rect width="26" height="10" fill="#140E0A"/><rect x="3" width="16" height="10" fill="#3A2618"/>
      </pattern>
      <radialGradient id="screenGlow" cx=".2" cy="0" r="1">
        <stop offset="0" stop-color="#FF8A12"/><stop offset=".45" stop-color="#F06A0A"/><stop offset="1" stop-color="#B8280F"/>
      </radialGradient>
      <radialGradient id="spill" cx=".5" cy=".38" r=".55">
        <stop offset="0" stop-color="#FF7A00" stop-opacity=".35"/><stop offset="1" stop-color="#FF7A00" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#1A1512"/><stop offset="1" stop-color="#070707"/>
      </linearGradient>
      <linearGradient id="desk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#2E2E2E"/><stop offset="1" stop-color="#141414"/>
      </linearGradient>'''

    def mic(x, flip):
        s = -1 if flip else 1
        return f'''
        <path d="M {x} 410 L {x + s*22} 362 L {x + s*88} 340" fill="none" stroke="#2A2A2A" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="{x - 8}" y="402" width="16" height="16" rx="3" fill="#2A2A2A"/>
        <g transform="rotate({s*-24} {x + s*112} 340) translate(0 44)">
          <rect x="{x + s*112 - 19}" y="252" width="38" height="96" rx="19" fill="#0B0B0B" stroke="#333" stroke-width="2"/>
          <path d="M {x + s*112 - 12} 268 L {x + s*112 + 12} 268 M {x + s*112 - 14} 280 L {x + s*112 + 14} 280 M {x + s*112 - 14} 292 L {x + s*112 + 14} 292" stroke="#3A3A3A" stroke-width="2"/>
          <rect x="{x + s*112 - 22}" y="318" width="44" height="7" rx="3" fill="{ORANGE}"/>
        </g>'''

    body = f'''
      <rect width="{w}" height="{h}" fill="#0F0C0A"/>
      <rect x="0" y="0" width="420" height="430" fill="url(#slats)"/>
      <rect x="{w-420}" y="0" width="420" height="430" fill="url(#slats)"/>
      <rect x="0" y="0" width="{w}" height="430" fill="url(#spill)"/>
      <rect x="0" y="10" width="{w}" height="5" fill="{ORANGE}" opacity=".9"/>
      <rect x="0" y="8" width="{w}" height="12" fill="{ORANGE}" opacity=".25"/>
      <rect x="480" y="52" width="528" height="240" rx="24" fill="url(#screenGlow)"/>
      {mark(516, 92, 130, "#FFFFFF")}
      {word(640, 116, 72, "#FFFFFF")}
      <text x="744" y="262" text-anchor="middle" class="sora" font-size="22" font-weight="700" fill="#FFFFFF" letter-spacing="9">THE LEAP PODCAST</text>
      <rect x="90" y="70" width="168" height="54" rx="12" fill="#1A0D06" stroke="{ORANGE}" stroke-width="3"/>
      <circle cx="118" cy="97" r="8" fill="#FF3B1F"/>
      <text x="190" y="105" text-anchor="middle" class="sora" font-size="20" font-weight="700" fill="{ORANGE}" letter-spacing="3">ON AIR</text>
      <rect x="0" y="430" width="{w}" height="{h-430}" fill="url(#floor)"/>
      <rect x="300" y="300" width="120" height="170" rx="30" fill="#1E1E1E"/>
      <rect x="{w-420}" y="300" width="120" height="170" rx="30" fill="#1E1E1E"/>
      <rect x="430" y="404" width="628" height="26" rx="13" fill="url(#desk)"/>
      <rect x="470" y="430" width="548" height="96" fill="#121212"/>
      {icon(720, 452, 48, ORANGE, CREAM)}
      {mic(520, False)}
      {mic(968, True)}
      <path d="M 640 404 q 0 -40 24 -40 q 24 0 24 40" fill="none" stroke="#2C2C2C" stroke-width="8"/>
      <rect x="788" y="380" width="64" height="24" rx="5" fill="#1C1C1C"/><circle cx="804" cy="392" r="4" fill="{ORANGE}"/><circle cx="820" cy="392" r="4" fill="#3A3A3A"/>'''
    return tile(w, h, body, defs, bg="#0F0C0A")


CSS = """
@font-face { font-family: Sora; src: url(sora.woff2) format("woff2"); font-weight: 100 900; }
@font-face { font-family: Karla; src: url(karla.woff2) format("woff2"); font-weight: 200 900; }
* { box-sizing: border-box; margin: 0; }
html, body { background: #1F1F1F; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
@page { size: 1600px 2808px; margin: 0; }
body { width: 1600px; padding: 56px; }
.board { display: grid; grid-template-columns: repeat(12, 102px); gap: 24px; }
.tile { border-radius: 36px; overflow: hidden; display: flex; }
.tile svg { display: block; }
.sora { font-family: Sora, sans-serif; }
.karla { font-family: Karla, sans-serif; }
.s3 { grid-column: span 3; } .s4 { grid-column: span 4; } .s5 { grid-column: span 5; }
.s6 { grid-column: span 6; } .s7 { grid-column: span 7; } .s12 { grid-column: span 12; }
"""


def span(n, html):
    return html.replace('class="tile ', f'class="tile s{n} ', 1)


tiles = [
    span(4, t_logo_white()), span(5, t_logo_orange()), span(3, t_logo_black()),
    span(6, t_tshirt()), span(6, t_shirt()),
    span(7, t_container()), span(5, t_phone()),
    span(5, t_id()), span(7, t_coffee()),
    span(12, t_podcast()),
]

symbols = f'''<svg width="0" height="0" style="position:absolute"><defs>
  <symbol id="glyph" viewBox="0 0 100 100"><path d="{GLYPH}"/></symbol>
  <symbol id="word" viewBox="0 0 270.46 64"><path transform="translate(0 48.64)" d="{WORD}"/></symbol>
</defs></svg>'''

html = f'''<!DOCTYPE html><html><head><meta charset="utf-8"><title>The Leap brand board</title>
<style>{CSS}</style></head><body>{symbols}<div class="board">{"".join(tiles)}</div></body></html>'''
open(OUT, "w").write(html)
print("written", OUT)
