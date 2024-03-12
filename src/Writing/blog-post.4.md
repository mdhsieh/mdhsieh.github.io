# Swift, SwiftUI, and Firebase Authentication: Setup Firebase Project (Part 1)
_Mar 11, 2024_

<img src="images/writing/setup_firebase_main.jpg" alt="setup_firebase_main_image" width="600"/>

## Intro
If your iOS app needs some kind of authentication, like creating user accounts and signing into them, one option is Google’s [Firebase platform](https://firebase.google.com/). It’s free to start with and has multiple services including authentication.

[Firebase Authentication](https://firebase.google.com/docs/auth/ios/start) from the platform lets users of your app sign in with multiple options, such as with an email and password account, Google account, or Apple account.

This post focuses only on setting up a new Firebase project. It’s for a sign-in example iOS app.
The app uses Swift and SwiftUI. It has create account, login, and logout functionality:

<img src="images/writing/setup_firebase_demo.gif" alt="setup_firebase_demo" width="400" />

This post is part 1 in a series. Final project code is [here](https://github.com/mdhsieh/sign-in-options-example).

Setup Firebase Project (Part 1)

Create Password Account (Part 2)

Apple Sign In (Part 3)

Google Sign In (Part 4)

## Setup Firebase Project

If you don’t already have a Firebase project, these are the setup steps. Otherwise you can skip to the next post.

1. Go into the Firebase console with a Google account. It’s a website for your Firebase projects. Create a new Firebase project to associate with your iOS app. In my case I called it “Sign Up Options Example”.

<img src="images/writing/setup_firebase_step_1.png" alt="setup_firebase_step_1" width="600" />

2. You don’t need Analytics for authentication.

<img src="images/writing/setup_firebase_step_2.png" alt="setup_firebase_step_2" width="600" />

3. Select "iOS+" option. Next steps are to add Firebase to your iOS app.

<img src="images/writing/setup_firebase_step_3.png" alt="setup_firebase_step_3" width="600" />

4. Create a new iOS app using SwiftUI in XCode. Enter the Bundle Identifier of your app in the Firebase console.
You can find it in app icon->Targets->Signing and Capabilities. For example, "com.<your-name>.Sign-In-Options-Example" and replace <your-name> with your full name.

<img src="images/writing/bundle_identifier.png" alt="bundle_identifier" width="600" />

5. Download GoogleService-Info.plist.

<img src="images/writing/info_plist.png" alt="info_plist" width="600" />

6. Drag-and-drop to your project name folder and select "Copy items if needed".

<img src="images/writing/copy_info_plist.png" alt="copy_info_plist" width="600" />

7. Use Swift Package Manager to add the firebase-ios-sdk library to your app. In Xcode, use File->Add Packages...

<img src="images/writing/add_firebase_ios_sdk.png" alt="add_firebase_ios_sdk" width="600" />

8. Add setup code using SwiftUI to the App.swift file. For example Sign_In_Options_ExampleApp.swift:

```
import SwiftUI
import FirebaseCore

class AppDelegate: NSObject, UIApplicationDelegate {
  func application(_ application: UIApplication,
                   didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    FirebaseApp.configure()
    return true
  }
}
@main
struct Sign_In_Options_ExampleApp: App {
    // register app delegate for Firebase setup
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate
    
    var body: some Scene {
        WindowGroup {
            WelcomeView()
        }
    }
}
```

## Next Steps
Now that Firebase is setup, you can work on the UI and Firebase Authentication for your app.



