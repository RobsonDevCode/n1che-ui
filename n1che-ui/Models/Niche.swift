import Foundation

// TODO: replace allNiches with GET /niches from API
struct Niche: Identifiable {
    let id: String
    let label: String
    let sub: String
    let desc: String
    let count: Int
    let fontStyle: NicheFontStyle
}

enum NicheFontStyle {
    case bebas, oswald, fellItalic
}

let allNiches: [Niche] = [
    Niche(id: "goth",        label: "Goth",       sub: "dark",         desc: "Dark aesthetics, velvet, silver hardware",  count: 847,  fontStyle: .bebas),
    Niche(id: "oldmoney",    label: "Old Money",  sub: "quiet luxury", desc: "Tailored cuts, cashmere, quiet luxury",     count: 1203, fontStyle: .fellItalic),
    Niche(id: "skater",      label: "Skater",     sub: "streetwise",   desc: "Baggy fits, graphic tees, low-tops",        count: 2104, fontStyle: .oswald),
    Niche(id: "streetwear",  label: "Streetwear", sub: "culture",      desc: "Limited drops, hoodies, sneaker culture",   count: 3281, fontStyle: .bebas),
    Niche(id: "cottagecore", label: "Cottage",    sub: "soft",         desc: "Floral prints, linen, handmade pieces",     count: 612,  fontStyle: .fellItalic),
    Niche(id: "y2k",         label: "Y2K",        sub: "retro-future", desc: "Low rise, chrome, butterfly clips",         count: 988,  fontStyle: .oswald),
    Niche(id: "techwear",    label: "Techwear",   sub: "utility",      desc: "Utility, waterproof, tactical fits",        count: 741,  fontStyle: .oswald),
    Niche(id: "vintage",     label: "Vintage",    sub: "archive",      desc: "Deadstock, 80s/90s, thrift finds",          count: 1567, fontStyle: .fellItalic),
]
