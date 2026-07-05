import SwiftUI

// TODO: full map screen — MKMapView, panel states, search, navigation
struct MapView: View {
    var body: some View {
        ZStack {
            Color.paper.ignoresSafeArea()
            Text("MAP")
                .font(.bebas(FontSize.h1))
                .foregroundStyle(Color.inkCol)
        }
    }
}
