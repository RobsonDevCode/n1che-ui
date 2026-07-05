// TODO: delete once ShopsService calls the real backend.
enum MockShopData {
    static let shops: [Shop] = [
        Shop(
            id: "1",
            googlePlaceId: "ChIJ_mock_void_velvet",
            name: "Void & Velvet",
            niche: "goth",
            address: "12 Carnaby St, London W1F 9PS",
            latitude: 51.5138,
            longitude: -0.1396,
            voteCount: 142,
            createdAt: "2024-01-15T10:00:00Z",
            addedByUserId: "user_001",
            addedByUsername: "inkwitch"
        ),
        Shop(
            id: "2",
            googlePlaceId: "ChIJ_mock_seance_supply",
            name: "Séance Supply",
            niche: "goth",
            address: "8 Portobello Rd, London W11 2DG",
            latitude: 51.5172,
            longitude: -0.2019,
            voteCount: 98,
            createdAt: "2024-02-03T14:30:00Z",
            addedByUserId: "user_002",
            addedByUsername: "morrigan"
        ),
        Shop(
            id: "3",
            googlePlaceId: "ChIJ_mock_harwick",
            name: "Harwick & Sons",
            niche: "vintage",
            address: "116 Columbia Rd, London E2 7RG",
            latitude: 51.5290,
            longitude: -0.0714,
            voteCount: 211,
            createdAt: "2024-01-22T09:15:00Z",
            addedByUserId: "user_003",
            addedByUsername: "tweedjacket"
        ),
        Shop(
            id: "4",
            googlePlaceId: "ChIJ_mock_drip_district",
            name: "Drip District",
            niche: "streetwear",
            address: "42 Brick Lane, London E1 6RF",
            latitude: 51.5226,
            longitude: -0.0712,
            voteCount: 376,
            createdAt: "2024-03-10T11:00:00Z",
            addedByUserId: "user_001",
            addedByUsername: "inkwitch"
        ),
        Shop(
            id: "5",
            googlePlaceId: "ChIJ_mock_the_crypt",
            name: "The Crypt",
            niche: "goth",
            address: "5 Neal's Yard, London WC2H 9DP",
            latitude: 51.5131,
            longitude: -0.1265,
            voteCount: 67,
            createdAt: "2024-04-01T16:00:00Z",
            addedByUserId: "user_004",
            addedByUsername: "gravemince"
        ),
        Shop(
            id: "6",
            googlePlaceId: "ChIJ_mock_concrete_thread",
            name: "Concrete & Thread",
            niche: "streetwear",
            address: "174 Shoreditch High St, London E1 6JE",
            latitude: 51.5247,
            longitude: -0.0780,
            voteCount: 189,
            createdAt: "2024-02-28T13:00:00Z",
            addedByUserId: "user_002",
            addedByUsername: "morrigan"
        ),
        Shop(
            id: "7",
            googlePlaceId: "ChIJ_mock_static",
            name: "Static",
            niche: "vintage",
            address: "272 Camden High St, London NW1 8QS",
            latitude: 51.5390,
            longitude: -0.1426,
            voteCount: 303,
            createdAt: "2024-01-08T10:30:00Z",
            addedByUserId: "user_003",
            addedByUsername: "tweedjacket"
        ),
        Shop(
            id: "8",
            googlePlaceId: "ChIJ_mock_gnarly",
            name: "Gnarly",
            niche: "skater",
            address: "46 Southbank, London SE1 8XX",
            latitude: 51.5054,
            longitude: -0.1132,
            voteCount: 254,
            createdAt: "2024-03-20T15:00:00Z",
            addedByUserId: "user_005",
            addedByUsername: "kickflip"
        ),
    ]
}
