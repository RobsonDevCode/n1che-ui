import Foundation

// TODO: replace allNiches with GET /niches from API
struct Niche: Identifiable {
    let id: String
    let label: String
    let sub: String
    let desc: String
    let count: Int
}

let allNiches: [Niche] = [
    Niche(id: "goth",        label: "Goth",       sub: "dark",         desc: "Dark aesthetics, velvet, silver hardware",  count: 847),
    Niche(id: "oldmoney",    label: "Old Money",  sub: "quiet luxury", desc: "Tailored cuts, cashmere, quiet luxury",     count: 1203),
    Niche(id: "skater",      label: "Skater",     sub: "streetwise",   desc: "Baggy fits, graphic tees, low-tops",        count: 2104),
    Niche(id: "streetwear",  label: "Streetwear", sub: "culture",      desc: "Limited drops, hoodies, sneaker culture",   count: 3281),
    Niche(id: "cottagecore", label: "Cottage",    sub: "soft",         desc: "Floral prints, linen, handmade pieces",     count: 612),
    Niche(id: "y2k",         label: "Y2K",        sub: "retro-future", desc: "Low rise, chrome, butterfly clips",         count: 988),
    Niche(id: "techwear",    label: "Techwear",   sub: "utility",      desc: "Utility, waterproof, tactical fits",        count: 741),
    Niche(id: "vintage",     label: "Vintage",    sub: "archive",      desc: "Deadstock, 80s/90s, thrift finds",          count: 1567),
]
