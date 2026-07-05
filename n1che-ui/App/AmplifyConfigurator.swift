import Amplify
import AWSCognitoAuthPlugin

enum AmplifyConfigurator {
    static func configure() {
        let plugin: JSONValue = [
            "CognitoUserPool": [
                "Default": [
                    "PoolId": .string(AppConfig.cognitoUserPoolId),
                    "AppClientId": .string(AppConfig.cognitoClientId),
                    "Region": .string(AppConfig.cognitoRegion),
                ],
            ],
            "Auth": [
                "Default": [
                    "authenticationFlowType": "USER_PASSWORD_AUTH",
                ],
            ],
        ]
        do {
            try Amplify.add(plugin: AWSCognitoAuthPlugin())
            try Amplify.configure(AmplifyConfiguration(
                auth: AuthCategoryConfiguration(plugins: ["awsCognitoAuthPlugin": plugin])
            ))
        } catch {
            // TODO: report to Sentry once the SDK is added
            print("Amplify configuration failed: \(error)")
        }
    }
}
