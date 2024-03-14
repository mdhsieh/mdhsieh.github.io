# Swift, SwiftUI, and Firebase Authentication: Create Password Account (Part 2)
_Mar 11, 2024_

<img src="images/writing/password_account_main.jpg" alt="password_account_main_image" width="600"/>

## Intro
As mentioned in a [previous post](https://mdhsieh.github.io/setup-firebase), [Firebase Authentication](https://firebase.google.com/docs/auth/ios/start[]) from Google’s [Firebase](https://firebase.google.com/) platform lets users of your app sign in with multiple options. This includes an email and password account or Apple account.

This post shows how to use Firebase to make a password account in an iOS app. The app uses Swift and SwiftUI. It has create account, login, and logout functionality:

<img src="images/writing/setup_firebase_demo.gif" alt="setup_firebase_demo" width="400" />

#### Example app Firebase password account

This post is part 2 in a series. Final project code is [here](https://github.com/mdhsieh/sign-in-options-example):

[Setup Firebase Project (Part 1)](https://mdhsieh.github.io/setup-firebase)

**Create Password Account (Part 2)**

[Apple Sign In (Part 3)](https://mdhsieh.github.io/apple-sign-in)

[Google Sign In (Part 4)](https://mdhsieh.github.io/google-sign-in)

## Setup Firebase Project
If you don’t already have a Firebase project, you can follow my setup steps [here](https://mdhsieh.github.io/setup-firebase).

## Setup Firebase Authentication
In the Firebase Console, select "Authentication" to start setting up Firebase Authentication.

<img src="images/writing/authentication.png" alt="authentication" width="600" />

Choose “Email/Password” from the list of providers.

<img src="images/writing/email_password.png" alt="email_password" width="600" />

Enable the Email option and select Save.

<img src="images/writing/enable_password.png" alt="enable_password" width="600" />

## Create Account Screen
Let’s make a screen to create a password account with a new SwiftUI file. This can be the welcome screen that the user first sees in your app:

```
import SwiftUI


struct WelcomeView: View {
    @State private var email: String = ""
    @State private var password: String = ""
    @EnvironmentObject var authService: AuthService

    var body: some View {
        NavigationView {
            ZStack {
                Color.gray
                    .ignoresSafeArea()
                    .opacity(0.5)
                
                VStack {
                    TextField("Email", text: $email)
                        .textFieldStyle(.roundedBorder)
                    SecureField("Password", text: $password)
                        .textFieldStyle(.roundedBorder)
                    
                    Button("Create an Account") {
                        authService.regularCreateAccount(email: email, password: password)
                    }
                    .buttonStyle(.borderedProminent)
                    .controlSize(.large)
                    
                    HStack {
                        Text("Already have an account? ")
                        
                        NavigationLink(destination: LoginView()) {
                            Text("Login").foregroundColor(.blue)
                        }
                    }.frame(maxWidth: .infinity, alignment: .center)
                }
                .padding()
            }
        }
    }
}

struct WelcomeView_Previews: PreviewProvider {
    static var previews: some View {
        WelcomeView()
    }
}
```

I have a ZStack to place all the buttons and TextFields in a gray background, so they’re easier to see. The state variables _email_ and _password_ get updated with whatever the user inputs in the fields. Tapping "Create an Account" should make our Firebase account.

<img src="images/writing/create_account_screen.png" alt="create_account" width="400" />

AuthService class and LoginView will be defined later.

## Home Screen
After a user either creates an account or signs in, you should show the user’s home screen.

```


struct HomeView: View {
    @EnvironmentObject var authService: AuthService
    
    var body: some View {
        NavigationStack {
            Text("Home Screen")
                .toolbar {
                    ToolbarItem(placement: .navigationBarTrailing) {
                        Button("Log out") {
                            print("Log out tapped!")
                            authService.regularSignOut { error in
                                
                                if let e = error {
                                    print(e.localizedDescription)
                                }
                            }
                        }
                    }
                }
        }
    }
}

struct HomeView_Previews: PreviewProvider {
    static var previews: some View {
        HomeView()
    }
}
```

This new SwiftUI file has a Text and a bar button item to log out when it’s tapped.

<img src="images/writing/home_screen.png" alt="home_screen" width="400" />

#### Home Screen

## Switch Between Create Account/Home

If you think about it, we have a problem. The screen you show a user changes depending on if the user is already signed in or not. It can be either the _create account screen_ or the user’s _home screen_.

One solution is to have a Published boolean from an authentication class, to check if the user is signed in. If true, show the user’s home screen. Otherwise, show the create account screen. This is in a new, starting SwiftUI file:

```
import SwiftUI
import FirebaseAuth

struct StartView: View {
    @EnvironmentObject var authService: AuthService
    
    var body: some View {
        if authService.signedIn {
            HomeView()
        } else {
            WelcomeView()
        }
    }
}

struct StartView_Previews: PreviewProvider {
    @StateObject static var authService = AuthService()

    static var previews: some View {
        if authService.signedIn {
            HomeView()
        } else {
            WelcomeView()
        }
    }
}
```

## Authentication Class
Now you need an authentication class to handle creating an account, logging in, and logging out of user Firebase accounts. I called this AuthService but you can pick any name.

First, we want to have the AuthService class available to all SwiftUI Views so we can do the appropriate action for each screen. You can make an AuthService object a StateObject and inject it into the new starting screen.

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
    
    @StateObject var authService = AuthService()
    
    var body: some Scene {
        WindowGroup {
            StartView()
                .environmentObject(authService)
        }
    }
}
```

By marking the AuthService with [@StateObject](https://www.hackingwithswift.com/quick-start/swiftui/what-is-the-stateobject-property-wrapper) property wrapper, and then putting it in [environmentObject()](https://developer.apple.com/documentation/swiftui/environmentobject), the same object is available in any View.

You don’t need to initialize it again. For example in the starting screen, StartView, you can use _authService_ to check if the user has signed in.

Here’s the AuthService class:

```
import Foundation
import FirebaseCore
import FirebaseAuth


class AuthService: ObservableObject {
    
    @Published var signedIn:Bool = false
    
    init() {
        Auth.auth().addStateDidChangeListener() { auth, user in
            if user != nil {
                self.signedIn = true
                print("Auth state changed, is signed in")
            } else {
                self.signedIn = false
                print("Auth state changed, is signed out")
            }
        }
    }
    
    // MARK: - Password Account
    func regularCreateAccount(email: String, password: String) {
        Auth.auth().createUser(withEmail: email, password: password) { authResult, error in
            if let e = error {
                print(e.localizedDescription)
                
            } else {
                print("Successfully created password account")
            }
        }
    }
    
    //MARK: - Traditional sign in
    // Traditional sign in with password and email
    func regularSignIn(email:String, password:String, completion: @escaping (Error?) -> Void) {
        Auth.auth().signIn(withEmail: email, password: password) {  authResult, error in
            if let e = error {
                completion(e)
            } else {
                print("Login success")
                completion(nil)
            }
        }
    }
    
    // Regular password acount sign out.
    // Closure has whether sign out was successful or not
    func regularSignOut(completion: @escaping (Error?) -> Void) {
        let firebaseAuth = Auth.auth()
        do {
            try firebaseAuth.signOut()
            completion(nil)
        } catch let signOutError as NSError {
          print("Error signing out: %@", signOutError)
          completion(signOutError)
        }
    }
    
}
```

Here’s an explanation of each part of the class:

1. The [Published](https://www.hackingwithswift.com/quick-start/swiftui/what-is-the-published-property-wrapper) boolean _signedIn_ is used to set whether you should show the create account or home screen.

Because _singedIn_ is Published property, changes to it automatically trigger a reload in SwiftUI Views.

2. AuthService "conforms" to [ObservableObject](https://www.hackingwithswift.com/quick-start/swiftui/how-to-use-observedobject-to-manage-state-from-external-objects) protocol because earlier we marked it as a StateObject. That means we can use the class in a View, and when important changes happen to this class, SwiftUI will reload the View.

3. init(): Firebase has a listener function, [addStateDidChangeListener()](https://firebase.google.com/docs/auth/ios/start), which is called whenever the authentication state changes. We use that to update _signedIn_.

## Create Account
4. regularCreateAccount(): You can see is a simple function. It uses FirebaseAuth from the [firebase-ios-sdk](https://github.com/firebase/firebase-ios-sdk) library to create a Firebase account with an email and password. This will authenticate the user and trigger addStateDidChangeListener(), so we don’t need to do anything further.

I call the functions names like regularCreateAccount() to keep regular or "traditional" password account functions separate from Single-Sign-On functions. Your app might want other account options like Apple Single-Sign-On if the user has an Apple account.

## Login
5. regularSignIn(): The login function. It is input an email and password from a login screen and has a [completion closure](https://www.geeksforgeeks.org/escaping-and-non-escaping-closures-in-swift/#:~:text=An%20escaping%20closure%20is%20a,to%20before%20the%20function%20returns.). The closure is if you want to do something once login succeeds or fails.

In this case I just use the closure to print any error that occurs in the create account screen.

Like when creating an account, this will trigger addStateDidChangeListener() automatically, so _signedIn_ will update automatically and you should go to the home screen if login succeeds.

## Logout
6. regularSignOut(): Signs the user out, which will trigger the listener function so we don’t need to set _signedIn_ here either. It also has a completion closure. I use it to print any error.

## Login Screen
The last SwiftUI View we need is a login screen. The user can tap the "Login" button at the bottom of the create account screen to switch to login, and vice versa.

```
import SwiftUI

struct LoginView: View {
    @State private var email: String = ""
    @State private var password: String = ""
    @EnvironmentObject var authService: AuthService
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        NavigationView {
            ZStack {
                Color.gray
                    .ignoresSafeArea()
                    .opacity(0.5)
                
                VStack {
                    TextField("Email", text: $email)
                        .textFieldStyle(.roundedBorder)
                
                    SecureField("Password", text: $password)
                        .textFieldStyle(.roundedBorder)
                    
                    Button("Login") {
                        authService.regularSignIn(email: email, password: password) { error in
                            if let e = error {
                                print(e.localizedDescription)
                            }
                        }
                    }
                    .buttonStyle(.borderedProminent)
                    .controlSize(.large)
                    
                    HStack {
                        Text("Don't have an account?")
                        
                        Button {
                            dismiss()
                        } label: {
                            Text("Create Account").foregroundColor(.blue)
                        }
                    }.frame(maxWidth: .infinity, alignment: .center)
                }
            }
        }
    }
}

struct LoginView_Previews: PreviewProvider {
    static var previews: some View {
        LoginView()
    }
}
```

It has state variables so it attempts to login with whatever email or password given in the fields. The screen is in a gray background to match the create account screen and make the fields stand out a little more.

The screen looks like this:

<img src="images/writing/login_screen.png" alt="login_screen" width="400" />

#### Login screen

## Next Steps
Now users of your app can have a password account, login, and logout.

The [next post](https://mdhsieh.github.io/apple-sign-in) goes over adding a sign in with Apple option.