// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "TypedTranslate",
    platforms: [
        .macOS(.v14)
    ],
    products: [
        .executable(name: "TypedTranslate", targets: ["TypedTranslate"])
    ],
    targets: [
        .executableTarget(
            name: "TypedTranslate",
            path: "Sources/TypedTranslate",
            // The CLI bridge work is naturally actor-isolated and we cross the
            // SwiftUI/AppKit boundary frequently; Swift 5 language mode keeps the
            // Sendable friction low without sacrificing concurrency safety where
            // we actually rely on it (CLIService is an `actor`).
            swiftSettings: [
                .swiftLanguageMode(.v5)
            ]
        )
    ]
)
