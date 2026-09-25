#!/usr/bin/env python3
"""Generate downloadable PDFs for the free resource library.

Pure Python, no dependencies. Writes the resource PDFs into
public/downloads/ from src/data/resources.json so Astro ships them with
every build. Deterministic output (no timestamps) for clean git diffs.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RESOURCES = json.loads((ROOT / "src" / "data" / "resources.json").read_text())
OUT = ROOT / "public" / "downloads"

PAGE_W, PAGE_H = 612.0, 792.0  # US Letter
ML, MR = 50.0, 50.0
MT, MB = 54.0, 64.0
CONTENT_W = PAGE_W - ML - MR

INK = (0.09, 0.07, 0.05)
GRAY = (0.42, 0.38, 0.34)
GOLD = (0.48, 0.30, 0.15)
FOOT = (0.55, 0.52, 0.48)
BOX_BG = (0.965, 0.95, 0.925)
BOX_LINE = (0.72, 0.66, 0.58)

# Standard Helvetica widths for codes 32..126.
_HELV = [
    278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278,
    556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556,
    1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778,
    667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556,
    333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556,
    556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584,
]


def glyph_w(ch, size):
    code = ord(ch)
    return (_HELV[code - 32] if 32 <= code <= 126 else 500) / 1000.0 * size


def text_w(s, size):
    return sum(glyph_w(c, size) for c in s)


def space_w(size):
    return glyph_w(" ", size)


_TOKEN_RE = re.compile(r"\*\*(.+?)\*\*")


def parse_inline(text):
    """Split a paragraph into (style, word) tokens, honoring **bold**."""
    tokens = []
    pos = 0
    for m in _TOKEN_RE.finditer(text):
        if m.start() > pos:
            tokens += _lex(text[pos:m.start()], "r")
        tokens += _lex(m.group(1), "b")
        pos = m.end()
    if pos < len(text):
        tokens += _lex(text[pos:], "r")
    return tokens


def _lex(chunk, style):
    return [(style, w) for w in chunk.split(" ") if w]


def wrap(tokens, size, maxw):
    lines = []
    cur, curw = [], 0.0
    for st, w in tokens:
        ww = text_w(w, size)
        need = ww + (space_w(size) if cur else 0.0)
        if cur and curw + need > maxw:
            lines.append(cur)
            cur, curw = [], 0.0
            need = ww
        cur.append((st, w))
        curw += need
    if cur:
        lines.append(cur)
    return lines


class PDF:
    def __init__(self):
        self.pages = []
        self.op = None
        self.y = 0.0
        self._add_page()

    def _add_page(self):
        self.op = []
        self.pages.append(self.op)
        self.y = MT

    def ensure(self, ht):
        if self.y + ht > PAGE_H - MB:
            self._add_page()

    def _text(self, text, style, size, x, y, color):
        t = text.encode("cp1252", "replace").decode("latin-1")
        t = t.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
        r, g, b = color
        font = "F1" if style == "r" else "F2"
        self.op.append(
            "%s %s %s rg /%s %s Tf 1 0 0 1 %s %s Tm (%s) Tj"
            % (f"{r:.3f}", f"{g:.3f}", f"{b:.3f}", font, f"{size:.1f}",
               f"{x:.2f}", f"{PAGE_H - y:.2f}", t)
        )

    def rule(self, y, color=(0.82, 0.78, 0.70), width=0.7):
        r, g, b = color
        self.op.append(
            "%s %s %s RG %s w %s %s m %s %s l S"
            % (f"{r:.3f}", f"{g:.3f}", f"{b:.3f}", f"{width:.2f}",
               f"{ML:.2f}", f"{PAGE_H - y:.2f}", f"{PAGE_W - MR:.2f}", f"{PAGE_H - y:.2f}")
        )

    def para(self, text, size=10.5, leading=16.0, color=INK, hang=0.0):
        tokens = parse_inline(text)
        maxw = CONTENT_W - hang
        lines = wrap(tokens, size, maxw)
        for line in lines:
            self.ensure(leading + 2)
            x = ML + hang
            for style, word in line:
                self._text(word, style, size, x, self.y, color)
                x += text_w(word, size) + space_w(size)
            self.y += leading

    def bullet(self, text, size=10.5, leading=16.0, color=INK):
        mark = "\u2022"
        indent = text_w(mark, size) + space_w(size) * 2
        maxw = CONTENT_W - indent
        lines = wrap(parse_inline(text), size, maxw)
        first = True
        for line in lines:
            self.ensure(leading + 2)
            x = ML
            if first:
                self._text(mark, "r", size, x, self.y, GOLD)
                x += indent
            else:
                x = ML + indent
            for style, word in line:
                self._text(word, style, size, x, self.y, color)
                x += text_w(word, size) + space_w(size)
            self.y += leading
            first = False

    def heading(self, text, size=13.0, space_before=18.0, leading=18.0):
        self.ensure(space_before + leading)
        self.y += space_before
        self._text(text.upper(), "b", size, ML, self.y, GOLD)
        self.y += leading

    def kicker(self, text):
        self.ensure(16)
        self._text(text, "b", 8.5, ML, self.y, GRAY)
        self.y += 13

    def title(self, text):
        self.ensure(34)
        self._text(text, "b", 20.0, ML, self.y, INK)
        self.y += 28

    def tagline(self, text):
        self.para(text, size=11.5, leading=17.0, color=GRAY)
        self.ensure(10)
        self.y += 8
        self.rule(self.y)
        self.y += 10

    def box(self, text_pairs, size=8.8, leading=13.5):
        self.ensure(10)
        self.y += 10
        x1, x2 = ML, PAGE_W - MR
        y1 = self.y
        width = x2 - x1
        h = 18
        for line in wrap(parse_inline(text_pairs[0]), size, width - 24):
            h += leading
        for extra in text_pairs[1:]:
            h += 12
            for line in wrap(parse_inline(extra), size, width - 24):
                h += leading
        y2 = y1 + h
        bg = BOX_BG
        ln = BOX_LINE
        self.op.append(
            "%s %s %s rg %s %s %s %s re f"
            % (f"{bg[0]:.3f}", f"{bg[1]:.3f}", f"{bg[2]:.3f}",
               f"{x1:.2f}", f"{PAGE_H - y2:.2f}", f"{width:.2f}", f"{h:.2f}")
        )
        self.op.append(
            "%s %s %s RG 0.8 w %s %s %s %s re S"
            % (f"{ln[0]:.3f}", f"{ln[1]:.3f}", f"{ln[2]:.3f}",
               f"{x1:.2f}", f"{PAGE_H - y2:.2f}", f"{width:.2f}", f"{h:.2f}")
        )
        self.y = y1 + 14
        self.para(text_pairs[0], size=size, leading=leading, color=INK, hang=12)
        for extra in text_pairs[1:]:
            self.para(extra, size=size, leading=leading, color=INK, hang=12)
        self.y = y2 + 14

    def spacer(self, ht=12):
        self.ensure(ht)
        self.y += ht

    def footer(self):
        for i, ops in enumerate(self.pages):
            y_rule = PAGE_H - MB + 12
            y_text = PAGE_H - MB + 22
            r, g, b = FOOT
            ops.append(
                "%s %s %s RG 0.6 w %s %s m %s %s l S"
                % (f"{r:.3f}", f"{g:.3f}", f"{b:.3f}",
                   f"{ML:.2f}", f"{y_rule:.2f}", f"{PAGE_W - MR:.2f}", f"{y_rule:.2f}")
            )
            left = "Jaylen Sinegal · jaylensinegal.com · Education, not representation · Not legal advice"
            t = left.encode("cp1252", "replace").decode("latin-1").replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
            ops.append("0.0 0.0 0.0 rg /F1 7.5 Tf 1 0 0 1 %s %s Tm (%s) Tj" % (f"{ML:.2f}", f"{y_text:.2f}", t))
            page = "Page %d of %d" % (i + 1, len(self.pages))
            pw = text_w(page, 7.5)
            t2 = page.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
            ops.append("0.0 0.0 0.0 rg /F1 7.5 Tf 1 0 0 1 %s %s Tm (%s) Tj" % (f"{PAGE_W - MR - pw:.2f}", f"{y_text:.2f}", t2))

    def render(self):
        n = len(self.pages)
        parts = []
        offsets = {}
        position = 0

        def emit(text):
            nonlocal position
            data = text if isinstance(text, bytes) else text.encode("latin-1")
            parts.append(data)
            position += len(data)

        emit("%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
        catalog, pagetree = 1, 2
        font_r, font_b = 3, 4
        page_objs = list(range(5, 5 + n))
        content_objs = list(range(5 + n, 5 + 2 * n))
        total = 4 + 2 * n

        def out(objnum, body):
            offsets[objnum] = position
            emit(b"%d 0 obj\n" % objnum)
            emit(body)
            emit(b"\nendobj\n")

        out(catalog, b"<< /Type /Catalog /Pages %d 0 R >>" % pagetree)
        kids = " ".join("%d 0 R" % o for o in page_objs)
        out(pagetree, ("<< /Type /Pages /Kids [%s] /Count %d >>" % (kids, n)).encode("latin-1"))
        out(font_r, b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>")
        out(font_b, b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>")
        for i in range(n):
            out(
                page_objs[i],
                ("<< /Type /Page /Parent %d 0 R /MediaBox [0 0 %d %d]"
                 " /Resources << /Font << /F1 %d 0 R /F2 %d 0 R >> >> /Contents %d 0 R >>")
                % (pagetree, int(PAGE_W), int(PAGE_H), font_r, font_b, content_objs[i]),
            )
        for i, ops in enumerate(self.pages):
            stream = "\n".join(ops).encode("latin-1")
            header = b"<< /Length %d >>\nstream\n" % len(stream)
            out(content_objs[i], header + stream + b"\nendstream")
        xref_pos = position
        lines = ["xref\n0 %d\n" % (total + 1)]
        lines.append("0000000000 65535 f \n")
        for num in range(1, total + 1):
            lines.append("%010d 00000 n \n" % offsets[num])
        lines.append("trailer\n<< /Size %d /Root %d 0 R >>\n" % (total + 1, catalog))
        lines.append("startxref\n%d\n%%%%EOF\n" % xref_pos)
        emit("".join(lines))
        return b"".join(parts)


ABOUT = (
    "Jaylen Sinegal is an executive brand strategist and media IP consultant in Louisiana. "
    "He teaches athlete and family brand architecture, NIL and music licensing to schools, "
    "and media copyright and facility audits. He is Chief Brand Officer of FlightTime "
    "Athletics LLC and builds the Find a Producer director for Louisiana music."
)

PROMISE = (
    "Education, not representation. Jaylen Sinegal provides brand strategy, media education, "
    "and IP consulting. He is not a licensed sports agent and does not solicit, negotiate, or "
    "procure athletic contracts, sponsorships, or employment. He does not sell, license, or "
    "represent music. Families, schools, and buyers keep direct control of their own assets."
)

DISCLAIMER = (
    "This resource is educational material meant to help you ask better questions. It is not "
    "legal, tax, financial, or investment advice, and it is not a contract. Louisiana law, "
    "platform terms, and school rules change. Confirm the current rules for your situation "
    "and have a qualified attorney review final documents whenever money, minors, or "
    "contracts are involved.",
    "If this resource references an organization, platform, or law (including Louisiana "
    "Act 810 and La. R.S. 51:2500 et seq.), it is a plain-English overview, not the "
    "authoritative text. Read the actual statutes and terms before relying on any checklist.",
)


SPEAKER_TALKS = [
    {
        "title": "Being Seen Isn't the Same as Being Remembered",
        "subtitle": "The Architecture of Long-Term Brand Memory",
        "audience": "Corporate executives, marketing directors, regional chambers of commerce, and entrepreneurs.",
        "summary": "Moves beyond short-lived viral attention into cognitive brand structure. Jaylen demonstrates how businesses build distinctive brand assets, narrative depth, and sustainable market trust across the Gulf Coast.",
    },
    {
        "title": "The Modern Athlete IP Ecosystem & Louisiana Act 810",
        "subtitle": "Ethics, Amateurism, and the Future of Sports",
        "audience": "High school athletic directors, school boards, head coaches, sports law symposiums.",
        "summary": "Translates Louisiana Act 810 and SB 389 into an actionable institutional defense strategy. Covers protecting student amateur status, insulating campuses from predatory runner agents, and eliminating copyright liabilities on school media channels.",
    },
    {
        "title": "Systems Over Symptoms: Leadership Under Pressure",
        "subtitle": "From 11 Schools to the Executive Suite",
        "audience": "Corporate leadership retreats, universities, and student-athlete leadership conferences.",
        "summary": "Drawing from his journey navigating 11 different schools, coaching award-winning athletic programs, and managing municipal sports complexes, Jaylen breaks down his core philosophy: \"I don't just build the thing. I build the system around it.\"",
    },
]


def build_speaker_one_sheet(asset):
    d = PDF()
    d.kicker("Jaylen Sinegal · Executive Speaker One-Sheet")
    d.title(asset["title"])
    d.tagline(asset["tagline"])
    d.heading("The three talks", space_before=10)
    for talk in SPEAKER_TALKS:
        d.para("**" + talk["title"] + "**", size=11.5, leading=15, color=GOLD)
        d.para(talk["subtitle"], size=9.8, leading=13, color=GRAY)
        d.para("**Audience:** " + talk["audience"], size=9.2, leading=13, color=INK)
        d.para("**Summary:** " + talk["summary"], size=9.2, leading=13, color=INK)
        d.spacer(4)
    d.heading("Who is Jaylen Sinegal?", space_before=10)
    d.para(ABOUT, size=9.5, leading=14.5)
    d.spacer(4)
    d.box(DISCLAIMER)
    d.footer()
    return d.render()


def build(asset):
    if asset["slug"] == "executive-speaker-one-sheet":
        return build_speaker_one_sheet(asset)
    d = PDF()
    d.kicker("Jaylen Sinegal · Free Resource Library")
    d.title(asset["title"])
    d.tagline(asset["tagline"])
    d.heading("Why this matters")
    d.para(asset["intro"])
    d.heading("What's inside")
    for b in asset["bullets"]:
        d.bullet(b)
    d.heading("About Jaylen Sinegal")
    d.para(ABOUT)
    d.heading("A standing promise")
    d.para(PROMISE)
    d.spacer(8)
    d.box(DISCLAIMER)
    d.footer()
    return d.render()


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for asset in RESOURCES:
        data = build(asset)
        target = OUT / asset["pdf"]
        target.write_bytes(data)
        print("Wrote %s (%d bytes)" % (target.relative_to(ROOT), len(data)))
    print("Done: %d resources" % len(RESOURCES))


if __name__ == "__main__":
    main()