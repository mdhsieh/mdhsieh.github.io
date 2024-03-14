# Swift, SwiftUI, and Firebase Authentication: Google Sign In (Part 4)
_Mar 12, 2024_

<img src="images/writing/google_sign_in_main.jpg" alt="google_sign_in_main" width="600"/>

## Intro
[Firebase Authentication](https://firebase.google.com/docs/auth/ios/start) gives a lot of options for signing in users. One of the most popular is Google Sign In. Here’s a quick demo of how to do it in an iOS app using SwiftUI.

<img src="images/writing/google_sign_in_example.png" alt="google_sign_in_example" width="400" />

#### Demo app

This post is part 4 in a series. Final project code is [here](https://github.com/mdhsieh/sign-in-options-example).

## Setup Google Firebase Authentication
In the [Firebase console](https://console.firebase.google.com/), go to Authentication tab and select Google:

<img src="images/writing/google_authentication.png" alt="google_authentication" width="600" />

Enable and save.

<img src="images/writing/google_enable.png" alt="google_enable" width="600" />

It will ask you to enter a support e-mail. I just used my Google email:

<img src="images/writing/google_support_email.png" alt="google_support_email" width="600" />

You will be given a new GoogleService-Info.plist file. Download it.

<img src="images/writing/google_service_info.png" alt="google_service_info" width="600" />

Replace your existing file with this new one in Xcode.

<img src="images/writing/google_service_info_replace.png" alt="google_service_info_replace" width="600" />

## Install GoogleSignIn
When I wrote this, I found the [documentation](https://firebase.google.com/docs/auth/ios/google-signin) and existing tutorials on Google Sign-In confusing.

One big reason is the library to do it, [GoogleSignIn](https://github.com/google/GoogleSignIn-iOS), has gone through some version updates. This has resulted in required _signIn()_ parameters being changed in iOS apps.

Tutorials I’ve seen use parameters which no longer work with the latest version.

Documentation, meanwhile, seems to assume some knowledge from UIKit. As of this writing, following it directly gave me errors like:

```
Cannot convert value of type 'AuthService' to expected argument type 'UIViewController'
```

The version I got working was **6.2.4**.

I used CocoaPods to install the library. First open your Mac Terminal, go to your project folder, e.g.

```
cd ~/Desktop/medium-blog/Sign\ In\ Options\ Example
```

and run

```
pod init
```

to create a Podfile.

In the Podfile, specify the version of [GoogleSignIn](https://cocoapods.org/pods/GoogleSignIn) to use:

```
# Uncomment the next line to define a global platform for your project
# platform :ios, '9.0'

target 'Sign In Options Example' do
  # Comment the next line if you don't want to use dynamic frameworks
  use_frameworks!

  # Pods for Sign In Options Example
  pod 'GoogleSignIn', '~> 6.2.4'

end
```

And install it:

```
pod install
```

Open the Xcode project from the newly generated .xcworkspace file.

<img src="images/writing/googlesignin_version.png" alt="googlesignin_version" width="600" />

When building, you might need to specify your team.

<img src="images/writing/googlesignin_team.png" alt="googlesignin_team" width="600" />

Now, you need to copy the _reversed client ID_ from your GoogleServices-Info.plist. It should be something like "com.googleusercontent.apps.<project-num-bunch-of-digits-and-letters>".

You then need to go to your project tab->Targets->Info and create a new URL type. In "URL Schemes" field, paste in the reversed client ID:

<img src="images/writing/google_reversed_client_id.png" alt="google_reversed_client_id" width="600" />

## Sign In Functions
In a previous post I made a class to handle authentication. I called mine AuthService.

Add imports for FirebaseCore, FirebaseAuth, and GoogleSignIn. Add a function in the class to do Google Sign-In:

```
import Foundation
import FirebaseCore
import FirebaseAuth
import CryptoKit
import AuthenticationServices
import GoogleSignIn

class AuthService: NSObject, ObservableObject, ASAuthorizationControllerDelegate  {
  
  // Password account sign in...

  // Apple sign in...

  func googleSignIn() {
        guard let clientID = FirebaseApp.app()?.options.clientID else { return }

        // Create Google Sign In configuration object.
        let config = GIDConfiguration(clientID: clientID)
        
        // As you’re not using view controllers to retrieve the presentingViewController, access it through
        // the shared instance of the UIApplication
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene else { return }
        guard let rootViewController = windowScene.windows.first?.rootViewController else { return }

        // Start the sign in flow!
        GIDSignIn.sharedInstance.signIn(with: config, presenting: rootViewController) { [unowned self] user, error in

          if let error = error {
              print("Error doing Google Sign-In, \(error)")
              return
          }

          guard
            let authentication = user?.authentication,
            let idToken = authentication.idToken
          else {
            print("Error during Google Sign-In authentication, \(error)")
            return
          }

          let credential = GoogleAuthProvider.credential(withIDToken: idToken,
                                                         accessToken: authentication.accessToken)
            
            
            // Authenticate with Firebase
            Auth.auth().signIn(with: credential) { authResult, error in
                if let e = error {
                    print(e.localizedDescription)
                }
               
                print("Signed in with Google")
            }
        }
    }
}
```

A brief explanation of the code:

The client ID is taken from GoogleServices-Info.plist.

We then get the root [UIViewController](https://www.hackingwithswift.com/example-code/uikit/what-is-a-uiviewcontroller) so the sign-in flow can show on the screen. To simplify, Google uses that UIViewController to [present](https://developers.google.com/identity/sign-in/ios/reference/Classes/GIDSignIn#/c:objc(cs)GIDSignIn(im)signInWithPresentingViewController:completion:) a browser pop-up on the screen. In UIKit, ["presenting"](https://developer.apple.com/library/archive/featuredarticles/ViewControllerPGforiPhoneOS/TheViewControllerHierarchy.html) meant replacing one ViewController’s content with another’s. But SwiftUI has replaced UIKit and doesn’t have you use ViewControllers by default, so we need those lines.

**GIDSignIn.sharedInstance.signIn()** has user and error as parameters in the callback function. Note this is because of the version specified.

The user object is a [GIDGoogleUser](https://developers.google.com/identity/sign-in/ios/reference/Classes/GIDSignIn#/c:objc(cs)GIDSignIn(cpy)sharedInstance). It represents a signed-in user. We need its info to make an OAuth credential for Google.

[OAuth](https://developer.okta.com/blog/2017/06/21/what-the-heck-is-oauth) (Open Authorization) is an authentication standard used for apps, and Firebase uses it. Instead of a password it uses tokens. It matters to us in this case because we do Single Sign-On with the user’s Google account.

We use that to finally sign in to Firebase.

Okay. Then we need a function to sign out:

```
// Sign out if used Single-sign-on with Google
func googleSignOut() {
    GIDSignIn.sharedInstance.signOut()
    print("Google sign out")
}
```

## Create Account Screen
You can use an image for the Google sign in button. I used the centered Fixed button from [this Figma design file](https://www.figma.com/community/file/945702178038082375).

<img src="images/writing/figma_google_button.png" alt="figma_google_button" width="600" />

Open Figma and select the component, then Export to get a zip folder containing the image.

<img src="images/writing/export_figma_google_button.png" alt="export_figma_google_button" width="600" />

Drag-and-drop the image into the Assets folder. Double-click to rename it GoogleButton.

<img src="images/writing/assets_google_button.png" alt="assets_google_button" width="600" />

Now change the create account screen to include the Google sign-in button.

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
                    Button {
                        print("Tapped google sign in")
                        authService.googleSignIn()
                    } label: {
                        Image("GoogleButton")
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 300)
                    }
                    
                    
                    Button {
                        print("Tapped apple sign in")
                        authService.startSignInWithAppleFlow()
                    } label: {
                        Image("AppleButton")
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 300)
                    }
                    
                    Text("OR")
                    
                    
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

The screen should look like this:

<img src="images/writing/google_sign_in_example.png" alt="google_sign_in_example" width="400" />

You should also log out of both the Google authentication and Firebase in the home screen.

```
import SwiftUI


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
                            
                            authService.googleSignOut()
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

Now if you run the app, you should be able to enter the Google sign-in flow, select an account, and be directed to the home screen.

<img src="images/writing/google_sign_in_flow_1.png" alt="google_sign_in_flow_1" width="400" />

#### Confirm to continue

<img src="images/writing/google_sign_in_flow_2.png" alt="google_sign_in_flow_2" width="400" />

#### Choose an account

<img src="images/writing/google_sign_in_home.png" alt="google_sign_in_home" width="400" />

#### Signed in

Hoping this will save you some time. Thanks for reading.