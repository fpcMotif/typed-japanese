import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var annotation: AnnotationViewModel
    @EnvironmentObject private var chat: ChatViewModel

    var body: some View {
        VStack(spacing: 0) {
            InputBar()
            Divider()
            HSplitView {
                StructureDiagramView()
                    .frame(minWidth: 380, idealWidth: 560)
                ChatView()
                    .frame(minWidth: 360, idealWidth: 480)
            }
        }
        .background(Color(nsColor: .windowBackgroundColor))
    }
}

/// Top bar: sentence input, engine picker, annotate button, status banner.
private struct InputBar: View {
    @EnvironmentObject private var annotation: AnnotationViewModel
    @EnvironmentObject private var chat: ChatViewModel

    var body: some View {
        VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
            HStack(alignment: .top, spacing: Theme.Spacing.md) {
                VStack(alignment: .leading, spacing: Theme.Spacing.xs) {
                    Text("Japanese sentence")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    TextEditor(text: $annotation.sentence)
                        .font(Theme.japaneseFont)
                        .frame(minHeight: 56, maxHeight: 96)
                        .padding(Theme.Spacing.xs)
                        .background(
                            RoundedRectangle(cornerRadius: Theme.Radius.md)
                                .fill(Color(nsColor: .textBackgroundColor))
                        )
                        .overlay(
                            RoundedRectangle(cornerRadius: Theme.Radius.md)
                                .strokeBorder(Theme.accentSoft, lineWidth: 1)
                        )
                }

                VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
                    Text("Engine")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    Picker("Engine", selection: $annotation.engine) {
                        ForEach(Engine.allCases) { engine in
                            Text(engine.displayName).tag(engine)
                        }
                    }
                    .pickerStyle(.segmented)
                    .labelsHidden()
                    .frame(width: 180)
                    .onChange(of: annotation.engine) { _, newValue in
                        chat.engine = newValue
                    }

                    TextField("Model (optional)", text: $annotation.model)
                        .textFieldStyle(.roundedBorder)
                        .font(.caption)
                        .frame(width: 180)
                        .onChange(of: annotation.model) { _, newValue in
                            chat.model = newValue
                        }

                    Button {
                        Task { await annotation.annotate() }
                    } label: {
                        HStack(spacing: Theme.Spacing.xs) {
                            if annotation.isAnnotating {
                                ProgressView().controlSize(.small)
                            }
                            Text(annotation.isAnnotating ? "Annotating…" : "Annotate")
                                .fontWeight(.semibold)
                        }
                        .frame(width: 160)
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(Theme.accent)
                    .disabled(!annotation.canAnnotate)
                    .keyboardShortcut(.return, modifiers: [.command])
                }
            }

            StatusBanner()
        }
        .padding(Theme.Spacing.lg)
    }
}

/// Resolved-string / error banner under the input.
private struct StatusBanner: View {
    @EnvironmentObject private var annotation: AnnotationViewModel

    var body: some View {
        Group {
            if let message = annotation.errorMessage {
                banner(
                    icon: "exclamationmark.triangle.fill",
                    color: .orange,
                    title: "Issue",
                    text: message
                )
            } else if let resolved = annotation.resolved, !resolved.isEmpty {
                banner(
                    icon: annotation.typeChecks ? "checkmark.seal.fill" : "questionmark.circle.fill",
                    color: annotation.typeChecks ? Theme.accentDeep : .secondary,
                    title: annotation.typeChecks ? "Resolved" : "Resolved (unchecked)",
                    text: resolved
                )
            } else if annotation.hasResult {
                banner(
                    icon: "info.circle.fill",
                    color: .secondary,
                    title: "Parsed",
                    text: "No resolved reading available."
                )
            } else {
                EmptyView()
            }
        }
    }

    private func banner(icon: String, color: Color, title: String, text: String) -> some View {
        HStack(alignment: .top, spacing: Theme.Spacing.sm) {
            Image(systemName: icon).foregroundStyle(color)
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(color)
                Text(text)
                    .font(title.hasPrefix("Resolved") ? Theme.japaneseFont : .callout)
                    .textSelection(.enabled)
            }
            Spacer()
        }
        .padding(Theme.Spacing.sm)
        .background(
            RoundedRectangle(cornerRadius: Theme.Radius.md)
                .fill(color.opacity(0.08))
        )
    }
}
