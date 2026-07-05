import Foundation

// Values flow from Config.xcconfig (gitignored) → build settings →
// Info.plist substitution → here.
enum AppConfig {
    static var googlePlacesAPIKey: String {
        Bundle.main.object(forInfoDictionaryKey: "GooglePlacesAPIKey") as? String ?? ""
    }

    static var cognitoUserPoolId: String {
        Bundle.main.object(forInfoDictionaryKey: "CognitoUserPoolId") as? String ?? ""
    }

    static var cognitoClientId: String {
        Bundle.main.object(forInfoDictionaryKey: "CognitoClientId") as? String ?? ""
    }

    static var cognitoRegion: String {
        Bundle.main.object(forInfoDictionaryKey: "CognitoRegion") as? String ?? ""
    }
}
