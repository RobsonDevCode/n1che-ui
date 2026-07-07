extension Shop {
    // A place that isn't a shop yet — everything the community adds later starts empty
    init(place: Place, niche: String) {
        self.init(
            id: place.id,
            googlePlaceId: place.id,
            name: place.displayName?.text ?? place.id,
            niche: niche,
            address: place.formattedAddress ?? "",
            latitude: place.location?.latitude ?? 0,
            longitude: place.location?.longitude ?? 0,
            voteCount: 0,
            createdAt: "",
            addedByUserId: "",
            addedByUsername: "",
            photoUrl: nil
        )
    }

    // Real place details layered over this shop — vote counts and usernames
    // stay as-is until the backend exists.
    func overlaying(_ place: Place, photoUrl: String?) -> Shop {
        Shop(
            id: place.id,
            googlePlaceId: place.id,
            name: place.displayName?.text ?? name,
            niche: niche,
            address: place.formattedAddress ?? address,
            latitude: place.location?.latitude ?? latitude,
            longitude: place.location?.longitude ?? longitude,
            voteCount: voteCount,
            createdAt: createdAt,
            addedByUserId: addedByUserId,
            addedByUsername: addedByUsername,
            photoUrl: photoUrl
        )
    }
}
