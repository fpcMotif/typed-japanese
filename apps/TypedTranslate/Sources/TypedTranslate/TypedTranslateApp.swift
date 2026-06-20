import SwiftUI
import AppKit

@main
struct TypedTranslateApp: App {
    @StateObject private var annotation: AnnotationViewModel
    @StateObject private var chat: ChatViewModel

    init() {
        // A `swift run` launch is an "accessory" by default; make it a regular
        // app so the window comes forward and takes focus.
        NSApplication.shared.setActivationPolicy(.regular)
        NSApp.activate(ignoringOtherApps: true)

        let cli = CLIService()
        _annotation = StateObject(wrappedValue: AnnotationViewModel(cli: cli))
        _chat = StateObject(wrappedValue: ChatViewModel(cli: cli))
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(annotation)
                .environmentObject(chat)
                .frame(minWidth: 960, minHeight: 600)
                .onAppear {
                    // Keep the chat engine in sync with the annotation engine and
                    // wire the live grammar context provider.
                    chat.engine = annotation.engine
                    chat.contextProvider = { [weak annotation] in annotation?.chatContext }
                }
        }
        .windowStyle(.titleBar)
        .defaultSize(width: 1180, height: 760)
    }
}
