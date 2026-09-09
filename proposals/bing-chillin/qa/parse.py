"""Extract slide geometry + text from a .pptx into JSON, in document order."""
import json, os, sys, zipfile
from defusedxml import minidom

EMU = 914400.0
A = "http://schemas.openxmlformats.org/drawingml/2006/main"
P = "http://schemas.openxmlformats.org/presentationml/2006/main"
R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"

src, out = sys.argv[1], sys.argv[2]
z = zipfile.ZipFile(src)


def kids(node, ns, name):
    return [c for c in node.childNodes
            if c.nodeType == 1 and c.namespaceURI == ns and c.localName == name]


def kid(node, ns, name):
    k = kids(node, ns, name)
    return k[0] if k else None


def deep(node, ns, name):
    return node.getElementsByTagNameNS(ns, name)


def deep1(node, ns, name):
    d = deep(node, ns, name)
    return d[0] if d else None


def fill_of(spPr):
    """Returns (hex, opacity) or None for no fill."""
    if spPr is None:
        return None
    if kid(spPr, A, "noFill") is not None:
        return None
    sf = kid(spPr, A, "solidFill")
    if sf is None:
        return None
    c = kid(sf, A, "srgbClr")
    if c is None:
        return None
    op = 1.0
    al = kid(c, A, "alpha")
    if al is not None:
        op = int(al.getAttribute("val")) / 100000.0
    return (c.getAttribute("val"), op)


def line_of(spPr):
    if spPr is None:
        return None
    ln = kid(spPr, A, "ln")
    if ln is None:
        return None
    if kid(ln, A, "noFill") is not None:
        return None
    f = fill_of(ln)
    if f is None:
        return None
    w = ln.getAttribute("w")
    pt = (int(w) / 12700.0) if w else 1.0
    return {"color": f[0], "opacity": f[1], "w": pt}


def runs_of(p):
    out_runs = []
    for c in p.childNodes:
        if c.nodeType != 1 or c.namespaceURI != A:
            continue
        if c.localName == "br":
            out_runs.append({"br": True})
        elif c.localName == "r":
            t = kid(c, A, "t")
            text = t.firstChild.nodeValue if (t and t.firstChild) else ""
            rPr = kid(c, A, "rPr")
            r = {"t": text, "sz": 18.0, "b": False, "i": False,
                 "color": "000000", "face": "Calibri"}
            if rPr is not None:
                if rPr.getAttribute("sz"):
                    r["sz"] = int(rPr.getAttribute("sz")) / 100.0
                r["b"] = rPr.getAttribute("b") == "1"
                r["i"] = rPr.getAttribute("i") == "1"
                f = fill_of(rPr)
                if f:
                    r["color"] = f[0]
                lat = kid(rPr, A, "latin")
                if lat is not None and lat.getAttribute("typeface"):
                    r["face"] = lat.getAttribute("typeface")
            out_runs.append(r)
    return out_runs


def parse_shape(sp):
    spPr = kid(sp, P, "spPr")
    xfrm = kid(spPr, A, "xfrm") if spPr is not None else None
    if xfrm is None:
        return None
    off, ext = kid(xfrm, A, "off"), kid(xfrm, A, "ext")
    if off is None or ext is None:
        return None
    geom = kid(spPr, A, "prstGeom")
    item = {
        "kind": "shape",
        "x": int(off.getAttribute("x")) / EMU,
        "y": int(off.getAttribute("y")) / EMU,
        "w": int(ext.getAttribute("cx")) / EMU,
        "h": int(ext.getAttribute("cy")) / EMU,
        "prst": geom.getAttribute("prst") if geom is not None else "rect",
        "fill": fill_of(spPr),
        "line": line_of(spPr),
        "paras": [],
        "anchor": "t",
    }
    tx = kid(sp, P, "txBody")
    if tx is not None:
        bp = kid(tx, A, "bodyPr")
        if bp is not None and bp.getAttribute("anchor"):
            item["anchor"] = bp.getAttribute("anchor")
        for p in kids(tx, A, "p"):
            pPr = kid(p, A, "pPr")
            algn = pPr.getAttribute("algn") if pPr is not None else ""
            item["paras"].append({"algn": algn or "l", "runs": runs_of(p)})
    return item


def parse_pic(pic, rels):
    spPr = kid(pic, P, "spPr")
    xfrm = kid(spPr, A, "xfrm") if spPr is not None else None
    blip = deep1(pic, A, "blip")
    if xfrm is None or blip is None:
        return None
    off, ext = kid(xfrm, A, "off"), kid(xfrm, A, "ext")
    rid = blip.getAttributeNS(R, "embed")
    return {
        "kind": "pic",
        "x": int(off.getAttribute("x")) / EMU,
        "y": int(off.getAttribute("y")) / EMU,
        "w": int(ext.getAttribute("cx")) / EMU,
        "h": int(ext.getAttribute("cy")) / EMU,
        "target": rels.get(rid, ""),
    }


names = sorted([n for n in z.namelist() if n.startswith("ppt/slides/slide") and n.endswith(".xml")],
               key=lambda n: int("".join(ch for ch in os.path.basename(n) if ch.isdigit())))

slides = []
for name in names:
    base = os.path.basename(name)
    relpath = "ppt/slides/_rels/%s.rels" % base
    rels = {}
    if relpath in z.namelist():
        rd = minidom.parseString(z.read(relpath))
        for rel in rd.getElementsByTagName("Relationship"):
            t = rel.getAttribute("Target").replace("../", "ppt/")
            rels[rel.getAttribute("Id")] = t
    doc = minidom.parseString(z.read(name))
    tree = deep1(doc, P, "spTree")
    items = []
    for c in tree.childNodes:
        if c.nodeType != 1 or c.namespaceURI != P:
            continue
        it = parse_shape(c) if c.localName == "sp" else (
            parse_pic(c, rels) if c.localName == "pic" else None)
        if it:
            items.append(it)
    notes = ""
    nrel = "ppt/notesSlides/notesSlide%s.xml" % "".join(ch for ch in base if ch.isdigit())
    if nrel in z.namelist():
        nd = minidom.parseString(z.read(nrel))
        parts = []
        for t in deep(nd, A, "t"):
            if t.firstChild:
                parts.append(t.firstChild.nodeValue)
        notes = " ".join(parts)
    slides.append({"name": base, "items": items, "notesLen": len(notes)})

json.dump({"slides": slides}, open(out, "w"), indent=1)
print("parsed %d slides" % len(slides))
