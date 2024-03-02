# Customized Streaks Calendar with FSCalendar
_Feb 29, 2024_

<img src="images/writing/fscalendar_main.jpg" alt="fscalendar_main_image" width="600"/>

## Purpose
Sometimes your iOS app needs a custom, monthly calendar on the screen. If you use SwiftUI, a default choice is CalendarView, however that's only available in iOS 16 and up. If you want to support older devices, one option is the library [FSCalendar](https://github.com/WenchaoD/FSCalendar).

Here I'll give a quick tutorial on FSCalendar and SwiftUI to make a calendar that has colors filled according to a user's progress. This could be useful if your app needs to display a user's daily achievements or streaks, like reaching a certain number of daily points.

The final result will look like this:
<img src="images/writing/fscalendar_example_demo.gif" alt="fscalendar_demo" />

FSCalendar with custom colors and selected day's sessions

## Setup
I used CocoaPods to install the library. Assuming you have a new project:

First make a Podfile in your top-level folder:

`pod init`

In the Podfile, include FSCalendar:

```
target 'FSCalendar Example' do
  use_frameworks!

  pod 'FSCalendar'
```

Install the pod, run:

`pod install`

And then open your project using the newly generated .xcworkspace file. It's the white icon.

## Data Model
Before we make a calendar we need some data to associate with it. I'm going to use a sample dataset, which you can replace in your project with your own data.

The structure of my data will be:

_Achievements -> [Session], requiredPoints, first start date_

_Session -> points, start date, end date_

In other words every day the user can play one or more Sessions. Each Session has points which are then added up, to get a total number of points per day. That then tells us how the calendar should look.

Create an Achievements Swift file which has the sample dataset, required points and first date, and a function to get points:

```
import Foundation

struct Achievements {
    
    var requiredPoints = 100
    var startDate: Date = getDateFromString("2024-01-01 08:00:00")!
    var sessions: [Session]
    
    //MARK: - Sample set of Sessions with points and duration
    static var sampleDataset = Achievements(
        sessions: [
            // Success
            Session(
                id: UUID().uuidString,
                startDate: getDateFromString("2024-02-20 08:00:00")!,
                endDate: getDateFromString("2024-02-20 09:04:00")!,
                points: 100
            ),
            // Fail
            Session(
                id: UUID().uuidString,
                startDate: getDateFromString("2024-02-24 12:00:00")!,
                endDate: getDateFromString("2024-02-24 01:15:20")!,
                points: 30
            ),
            // Success because combined points of 2 Sessions in same day
            Session(
                id: UUID().uuidString,
                startDate: getDateFromString("2024-02-25 06:30:00")!,
                endDate: getDateFromString("2024-02-25 09:50:42")!,
                points: 80
            ),
            Session(
                id: UUID().uuidString,
                startDate: getDateFromString("2024-02-25 03:12:00")!,
                endDate: getDateFromString("2024-02-25 04:04:07")!,
                points: 20
            ),
            // Success
            Session(
                id: UUID().uuidString,
                startDate: getDateFromString("2024-02-26 09:00:00")!,
                endDate: getDateFromString("2024-02-26 10:00:00")!,
                points: 120
            )
        ]
    )
    
    //MARK: - To get sample Dates
    static func getDateFromString(_ dateString: String) -> Date? {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd HH:mm:ss"
        guard let date = formatter.date(from: dateString) else {
            return nil
        }
        
        return date
    }
    
    //MARK: - Get total points on a Date
    func totalPoints(on date: Date) -> Int {
        var totalPoints = 0
        // only add points from Sessions that occur within same day as the given date
        for session in self.sessions {
            if Calendar.current.compare(date, to: session.startDate, toGranularity: .day) == .orderedSame {
                totalPoints += session.points
            }
        }
        return totalPoints
    }
}
```

After that, we should define the Session itself. We will need an ID, time the Session started, time it ended, and how many points the user got. It will also be helpful for you to have some formatters when later you want to show these times as text.

```
import Foundation

struct Session: Identifiable {
    var id: String
    var startDate: Date
    var endDate: Date
    var points: Int
    
    //MARK: - Show Date as Text
    static var dateFormatter: DateFormatter = {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "MMM d, yyyy"
        return dateFormatter
    }()
    
    //MARK: - Show start and end times as Text
    static var dailyTimeFormatter: DateFormatter = {
        let dateFormatter = DateFormatter()
        dateFormatter.locale = Locale.current
        dateFormatter.dateStyle = .none
        dateFormatter.timeStyle = .short
        return dateFormatter
    }()
}
```
## Initial FSCalendar
Now you've got some data, you can move on to showing a calendar. If you look at the [FSCalendar](https://github.com/WenchaoD/FSCalendar) library, you will notice it was originally written in UIKit, not SwiftUI. But that's fine, we can convert it to a SwiftUI View using UIViewRepresentable.

Let's try and use UIViewRepresentable to make an FSCalendarView.

```
import SwiftUI
import FSCalendar

struct FSCalendarView: UIViewRepresentable {
    
    @Binding var selectedDate: Date
    @Binding var achievements: Achievements
        
    func makeCoordinator() -> Coordinator {
        Coordinator(self, achievements: achievements)
    }
    
    func makeUIView(context: Context) -> FSCalendar {
        let calendar = FSCalendar()
        calendar.delegate = context.coordinator
        calendar.appearance.selectionColor = .systemPurple
        // Remove today circle
        calendar.today = nil
        return calendar
    }
    
    func updateUIView(_ uiView: FSCalendar, context: Context) {
        // update the calendar view if necessary
    }
    
    //MARK: - Coordinator
    class Coordinator: NSObject {
            
        var parent: FSCalendarView
        
        var achievements: Achievements
        
        init(_ calender: FSCalendarView, achievements: Achievements) {
            self.parent = calender
            self.achievements = achievements
        }
    }
    
}
```

You can pass in two Binding variables, a selectedDate which is set when user taps on a day in the calendar, and Achievements which has the sample data. 

In _makeUIView()_ the selection color is set to purple. It can be whatever.

I also remove the default fill color marking today's date, which is done automatically by FSCalendar. In my case, I don't need it because it will be filled with a color from my dataset later.

The Coordinator is important because that is where you can use functions provided by FSCalendar to enable interactivity and customization. For now, I only create it and send in the Achievements as input.

## Calendar Build Error
If you try to run the app now, you will likely run into this off-putting error:

`SDK does not contain 'libarclite' at the path '/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/lib/arc/libarclite_iphonesimulator.a'; try increasing the minimum deployment target`

I needed to search a good while to find a [solution](https://stackoverflow.com/questions/75574268/missing-file-libarclite-iphoneos-a-xcode-14-3) to this. This happens because FSCalendar by default has a minimum deployment target of 8.0. However, your app likely uses or has libraries with higher minimum targets. 

You need to go to Pods -> Targets -> FSCalendar, then in "minimum deployments", set the number to whatever matches your project.

In my case it was 17.0.

<img src="images/writing/fscalendar_update_min_deployment.png" alt="fscalendar_update_min_deployment" width="600"/>

## FSCalendar Coordinator
Go back to FSCalendar. You can add customizations by implementing protocols in the Coordinator.

```
//MARK: - Coordinator
    class Coordinator: NSObject, FSCalendarDelegate, FSCalendarDelegateAppearance {
            
        var parent: FSCalendarView
        
        var achievements: Achievements
        
        init(_ calender: FSCalendarView, achievements: Achievements) {
            self.parent = calender
            self.achievements = achievements
        }
        
        func calendar(_ calendar: FSCalendar, didSelect date: Date, at monthPosition: FSCalendarMonthPosition) {
            self.parent.selectedDate = date
        }
        
        func calendar(_ calendar: FSCalendar, appearance: FSCalendarAppearance, fillDefaultColorFor date: Date) -> UIColor? {
            // Color days in current month up to and including today
            // Must be after or at first start date
            if isDateInMonth(date: date, targetMonth: calendar.currentPage) && date <= Date() && isOnOrAfterAchievementStartDate(date: date) {
                let dailyPoints = achievements.totalPoints(on: date)
                if dailyPoints == 0 {
                    return .gray
                } else if dailyPoints >= 100 {
                    return .systemGreen
                } else {
                    return .systemRed
                }
            } else {
                return nil
            }
        }
        
        // White to contrast well with fill colors, default would be black
        func calendar(_ calendar: FSCalendar, appearance: FSCalendarAppearance, titleDefaultColorFor date: Date) -> UIColor? {
            if isDateInMonth(date: date, targetMonth: calendar.currentPage) && date <= Date() && isOnOrAfterAchievementStartDate(date: date) {
                return .white
            } else {
                return nil
            }
        }
        
        // Need reload to have fill colors display correctly after calendar page changes
        func calendarCurrentPageDidChange(_ calendar: FSCalendar) {
            calendar.reloadData()
        }
        
        //MARK: - Other
        func isDateInMonth(date: Date, targetMonth: Date) -> Bool {
            return Calendar.current.isDate(date, equalTo: targetMonth, toGranularity: .month)
        }
        
        func isOnOrAfterAchievementStartDate(date: Date) -> Bool {
            return (date >= achievements.startDate || Calendar.current.isDate(date, equalTo: achievements.startDate, toGranularity: .day))
        }
    }
```

To change each day's color, you can implement _FSCalendarDelegateAppearance_. You can then implement 2 methods, with _fillDefaultColorFor_ and _titleDefaultColorFor_.

The fill color for each day is now adjusted based on the total points made that day:
- Gray: 0 points. The user did not play any Sessions or score any points that day.
- Red: < 100 points. The user played ≥ 1 Session, however did not reach the required number of points.
- Green: ≥ 100 points. The user reached the required number of points, so we give them a nice green fill color.

Similarly, because our fill colors have changed, we want to set the number color within the fill to be white so it is more visible.

In my sample dataset, Jan 2024 and Feb 2024 are the months affected by custom colors. Nothing happens Jan 2024, while Feb 2024 has 1 success, 1 fail, and then a 2-day success streak.

It's important to implement **_calendarCurrentPageDidChange_** and write:
```
calendar.reloadData()
```

If you don't do this, the colors will not be updating properly whenever you swipe between months.

Implementing _FSCalendarDelegate_ and using the method _didSelect_ allows you to set the selected date variable to whatever the user selects, and make changes to your UI based on that. You can use that to show specifics about that day.

I will use that to show the selected day's individual Sessions later.

## Displaying FSCalendar
In your ContentView, display FSCalendar:
```
import SwiftUI

struct ContentView: View {
    @State private var myAchievements = Achievements.sampleDataset
    @State private var selectedDate: Date = Date()
    
    var body: some View {
        ScrollView {
            VStack {
                FSCalendarView(selectedDate: $selectedDate, achievements: $myAchievements)
                    .frame(height: 500)
            }
        }
        .padding()
    }
}
```

That will give you a custom calendar.

<img src="images/writing/fscalendar_initial.png" alt="fscalendar_initial" width="400" />

## Session Cards

However, we can go 1 step further and show which Sessions were played when a user taps a day.

To do that, first let's set up a SessionCard. This gives us info about 1 Session:

```
struct SessionCard: View {
    let session: Session

    var body: some View {
        VStack {
            Text("Points: \(session.points)")
                .background(
                    RoundedRectangle(cornerRadius: 10)
                        .fill(.white)
                        .frame(height:28)
                )
                .padding(.top, 5)
                .padding(.bottom, 5)
            Text("\(session.startDate, formatter: Session.dailyTimeFormatter) - \(session.endDate, formatter: Session.dailyTimeFormatter)")
                .background(
                    RoundedRectangle(cornerRadius: 10)
                        .fill(.white)
                        .frame(height:28)
                )
                .padding(.top, 5)
                .padding(.bottom, 5)
        }
        .padding()
        .background(Color.gray.opacity(0.2))
        .cornerRadius(10)
    }
}
```

It's pretty much just a gray card with text against a white background.

Then, we edit the ContentView to give us a list of SessionCard:

```
struct ContentView: View {
    @State private var myAchievements = Achievements.sampleDataset
    @State private var selectedDate: Date = Date()
    
    var body: some View {
        ScrollView {
            VStack {
                FSCalendarView(selectedDate: $selectedDate, achievements: $myAchievements)
                    .frame(height: 500)
                
                let sessionsOnDay = myAchievements.sessions.filter { isSameDay($0.startDate, selectedDate) }
                    .sorted(by: { $0.startDate.compare($1.startDate) == .orderedAscending })
                
                if sessionsOnDay.count == 0 {
                    Text("No sessions on \(Session.dateFormatter.string(from: selectedDate))")
                }
                
                ScrollView(.horizontal) {
                    LazyHStack(spacing: 16) {
                        // Display sessions for the selected date
                        ForEach(sessionsOnDay) { session in
                            SessionCard(session: session)
                        }
                    }
                }
            }
        }
        .padding()
    }
    
    func getSessionsOnDay(selectedDate: Date) -> [Session] {
        return myAchievements.sessions.filter { isSameDay($0.startDate, selectedDate) }
             .sorted(by: { $0.startDate.compare($1.startDate) == .orderedAscending })
    }
    
    // Helper function to check if two dates are on the same day
    func isSameDay(_ date1: Date, _ date2: Date) -> Bool {
        let calendar = Calendar.current
        return calendar.isDate(date1, inSameDayAs: date2)
    }
}
```

There's a new variable and function to get the sessions from a selected day. You can compare by start date, then order them by time as a user might expect.

After that either show a Text stating there's no Sessions to show, or show the list using a horizontal ScrollView and a horizontal stack.

Nice. You're done. Thanks for reading this far.

<img src="images/writing/fscalendar_final.png" alt="fscalendar_final" width="400" />