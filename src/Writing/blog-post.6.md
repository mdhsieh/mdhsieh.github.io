# Swift, SwiftUI, and Firebase Authentication: Apple Sign In (Part 3)
_Mar 12, 2024_

<img src="images/writing/apple_sign_in_main.jpg" alt="apple_sign_in_main" width="600"/>

## Intro
In the previous post, I showed how to use [Firebase Authentication](https://firebase.google.com/docs/auth/ios/start) to make a password account in a SwiftUI app.

However, using a password account is a little old-fashioned and inconvenient. You can use a different provider like Apple and do Single Sign On instead.

This post improves the previous app to use Apple to sign in.

<img src="images/writing/apple_sign_in_example.png" alt="apple_sign_in_example" width="400" />

#### Sign In example app with Apple

This post is part 3 in a series. Final project code is [here](https://github.com/mdhsieh/sign-in-options-example):

Setup Firebase Project (Part 1)

Create Password Account (Part 2)

Apple Sign In (Part 3)

Google Sign In (Part 4)

## Setup Apple Firebase Authentication
In the Firebase console, go to Authentication tab and select Apple

<img src="images/writing/apple_authentication.png" alt="apple_authentication" width="600" />

Make sure Enable is checked and Save.

<img src="images/writing/apple_enable.png" alt="apple_enable" width="600" />

In Xcode, go to app icon -> Targets -> Signing & Capabilities, and "+ Capability" to add the Sign in With Apple capability.

<img src="images/writing/apple_capability.png" alt="apple_capability" width="600" />

## Create Account Screen
You can use an image for the Apple sign in button. I used the centered Fixed button from [this Figma design file](https://www.figma.com/community/file/945702178038082375).

Open Figma and select the component, then Export to get a zip folder containing the image.

<img src="images/writing/export_figma_button.png" alt="export_figma_button" width="600" />

Drag-and-drop the image into the Assets folder. Double-click to rename it AppleButton.

<img src="images/writing/assets_apple_button.png" alt="assets_apple_button" width="600" />

Now the create account screen needs to be changed to include a button with the image, and also a text to separate Apple sign in from creating a password account.

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

## Authentication Class
Users need 2FA and be signed into iCloud to [authenticate with Apple](https://firebase.google.com/docs/auth/ios/apple).

The code in the authentication class needs to be updated to use Apple Sign In:

```
import Foundation
import FirebaseCore
import FirebaseAuth
import CryptoKit
import AuthenticationServices

class AuthService: NSObject, ObservableObject, ASAuthorizationControllerDelegate  {
    
    @Published var signedIn:Bool = false
    
    // Unhashed nonce.
    var currentNonce: String?
    
    override init() {
        super.init()
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
    // Create, sign in, and sign out from password account functions...
    
    //MARK: - Apple sign in
    // Adapted from https://auth0.com/docs/api-auth/tutorials/nonce#generate-a-cryptographically-random-nonce
    private func randomNonceString(length: Int = 32) -> String {
      precondition(length > 0)
      let charset: [Character] =
        Array("0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._")
      var result = ""
      var remainingLength = length

      while remainingLength > 0 {
        let randoms: [UInt8] = (0 ..< 16).map { _ in
          var random: UInt8 = 0
          let errorCode = SecRandomCopyBytes(kSecRandomDefault, 1, &random)
          if errorCode != errSecSuccess {
            fatalError(
              "Unable to generate nonce. SecRandomCopyBytes failed with OSStatus \(errorCode)"
            )
          }
          return random
        }

        randoms.forEach { random in
          if remainingLength == 0 {
            return
          }

          if random < charset.count {
            result.append(charset[Int(random)])
            remainingLength -= 1
          }
        }
      }

      return result
    }

    @available(iOS 13, *)
    private func sha256(_ input: String) -> String {
      let inputData = Data(input.utf8)
      let hashedData = SHA256.hash(data: inputData)
      let hashString = hashedData.compactMap {
        String(format: "%02x", $0)
      }.joined()

      return hashString
    }
    
    // Single-sign-on with Apple
    @available(iOS 13, *)
    func startSignInWithAppleFlow() {
       
        let nonce = randomNonceString()
        currentNonce = nonce
        let appleIDProvider = ASAuthorizationAppleIDProvider()
        let request = appleIDProvider.createRequest()
        request.requestedScopes = [.fullName, .email]
        request.nonce = sha256(nonce)

        let authorizationController = ASAuthorizationController(authorizationRequests: [request])
        authorizationController.delegate = self
        authorizationController.performRequests()
    }
    
    func authorizationController(controller: ASAuthorizationController, didCompleteWithAuthorization authorization: ASAuthorization) {
        if let appleIDCredential = authorization.credential as? ASAuthorizationAppleIDCredential {
            guard let nonce = currentNonce else {
                fatalError("Invalid state: A login callback was received, but no login request was sent.")
            }
            guard let appleIDToken = appleIDCredential.identityToken else {
                print("Unable to fetch identity token")
                return
            }
            guard let idTokenString = String(data: appleIDToken, encoding: .utf8) else {
                print("Unable to serialize token string from data: \(appleIDToken.debugDescription)")
                return
            }
            // Initialize a Firebase credential.
            let credential = OAuthProvider.credential(withProviderID: "apple.com",
                                                      idToken: idTokenString,
                                                      rawNonce: nonce)
            
            // Sign in with Firebase.
            Auth.auth().signIn(with: credential) { (authResult, error) in
                if (error != nil) {
                    // Error. If error.code == .MissingOrInvalidNonce, make sure
                    // you're sending the SHA256-hashed nonce as a hex string with
                    // your request to Apple.
                    print(error?.localizedDescription)
                    return
                }
                // User is signed in to Firebase with Apple.
                // ...
                print("Apple sign in!")
                
                // Allow proceed to next screen
            }
        }
    }
    
    func authorizationController(controller: ASAuthorizationController, didCompleteWithError error: Error) {
        // Handle error.
        print("Sign in with Apple errored: \(error)")
    }
}
```

The class uses startSignInWithAppleFlow() to create an [ASAuthorizationController](https://developer.apple.com/documentation/authenticationservices/asauthorizationcontroller).

The class itself is set as the [delegate](https://developer.apple.com/documentation/authenticationservices/asauthorizationcontrollerdelegate) for the controller, so we can then either sign into Firebase with the Apple account using the function _didCompleteWithAuthorization_, or print an error if _didCompleteWithError_.

Because of these changes, the class now also has to conform to the [NSObject](https://developer.apple.com/documentation/objectivec/nsobjectprotocol) protocol. That’s why you need to override init(), and then call super.init() to do NSObject’s initialization first before starting to listen to any authorization changes.

Now you should be able to sign in with Apple and see the user’s account in Authentication in the Firebase console.

<img src="images/writing/apple_sign_in_example.png" alt="apple_sign_in_example" width="400" />

That’s it. Hope this was useful.