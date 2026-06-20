import SwiftUI

/// Right pane: a grammar discussion chat scoped to the annotated sentence.
struct ChatView: View {
    @EnvironmentObject private var chat: ChatViewModel

    var body: some View {
        VStack(spacing: 0) {
            header
            Divider()
            if chat.isEnabled {
                messageList
                if let error = chat.errorMessage {
                    errorBar(error)
                }
                Divider()
                inputBar
            } else {
                emptyState
            }
        }
        .background(Color(nsColor: .controlBackgroundColor))
    }

    private var header: some View {
        HStack {
            Label("Discuss grammar", systemImage: "bubble.left.and.bubble.right")
                .font(.headline)
                .foregroundStyle(Theme.accentDeep)
            Spacer()
            if !chat.messages.isEmpty {
                Button {
                    chat.clear()
                } label: {
                    Image(systemName: "trash")
                }
                .buttonStyle(.borderless)
                .help("Clear conversation")
            }
        }
        .padding(.horizontal, Theme.Spacing.lg)
        .padding(.vertical, Theme.Spacing.md)
    }

    private var messageList: some View {
        ScrollViewReader { proxy in
            ScrollView {
                LazyVStack(alignment: .leading, spacing: Theme.Spacing.md) {
                    ForEach(chat.messages) { message in
                        MessageBubble(message: message)
                            .id(message.id)
                    }
                    if chat.isSending {
                        HStack(spacing: Theme.Spacing.sm) {
                            ProgressView().controlSize(.small)
                            Text("Thinking…")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                        .id("thinking")
                    }
                }
                .padding(Theme.Spacing.lg)
                .frame(maxWidth: .infinity, alignment: .leading)
            }
            .onChange(of: chat.messages.count) { _, _ in
                scrollToEnd(proxy)
            }
            .onChange(of: chat.isSending) { _, _ in
                scrollToEnd(proxy)
            }
        }
    }

    private func scrollToEnd(_ proxy: ScrollViewProxy) {
        withAnimation(.easeOut(duration: 0.2)) {
            if chat.isSending {
                proxy.scrollTo("thinking", anchor: .bottom)
            } else if let last = chat.messages.last {
                proxy.scrollTo(last.id, anchor: .bottom)
            }
        }
    }

    private func errorBar(_ text: String) -> some View {
        HStack(alignment: .top, spacing: Theme.Spacing.sm) {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundStyle(.orange)
            Text(text)
                .font(.caption)
                .textSelection(.enabled)
            Spacer()
        }
        .padding(Theme.Spacing.sm)
        .background(Color.orange.opacity(0.1))
    }

    private var inputBar: some View {
        HStack(alignment: .bottom, spacing: Theme.Spacing.sm) {
            // TextField(axis: .vertical) sends on Return (via onSubmit) and grows
            // as you type. Return-to-send keeps the chat distinct from the
            // input bar's ⌘-Return Annotate shortcut — no ambiguous binding.
            TextField("Ask about this sentence's grammar…", text: $chat.draft, axis: .vertical)
                .textFieldStyle(.plain)
                .font(.body)
                .lineLimit(1...5)
                .padding(Theme.Spacing.sm)
                .background(
                    RoundedRectangle(cornerRadius: Theme.Radius.md)
                        .fill(Color(nsColor: .textBackgroundColor))
                )
                .overlay(
                    RoundedRectangle(cornerRadius: Theme.Radius.md)
                        .strokeBorder(Color.gray.opacity(0.2), lineWidth: 1)
                )
                .onSubmit(submit)

            Button(action: submit) {
                Image(systemName: "paperplane.fill")
                    .padding(.vertical, 6)
                    .padding(.horizontal, 4)
            }
            .buttonStyle(.borderedProminent)
            .tint(Theme.accent)
            .disabled(!chat.canSend)
            .help("Send (Return)")
        }
        .padding(Theme.Spacing.md)
    }

    private func submit() {
        guard chat.canSend else { return }
        Task { await chat.send() }
    }

    private var emptyState: some View {
        VStack(spacing: Theme.Spacing.md) {
            Spacer()
            Image(systemName: "bubble.left.and.bubble.right")
                .font(.system(size: 30))
                .foregroundStyle(Theme.accentSoft)
            Text("Annotate a sentence first")
                .font(.headline)
            Text("Once a sentence is annotated, you can ask questions about its grammar here.")
                .font(.callout)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, Theme.Spacing.xl)
            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

/// A single user/assistant chat bubble.
private struct MessageBubble: View {
    let message: ChatMessage

    private var isUser: Bool { message.role == .user }

    var body: some View {
        HStack {
            if isUser { Spacer(minLength: 40) }
            VStack(alignment: isUser ? .trailing : .leading, spacing: 2) {
                Text(isUser ? "You" : "Assistant")
                    .font(.system(size: 10, weight: .semibold))
                    .foregroundStyle(.secondary)
                Text(message.text)
                    .font(.body)
                    .textSelection(.enabled)
                    .padding(.horizontal, Theme.Spacing.md)
                    .padding(.vertical, Theme.Spacing.sm)
                    .background(
                        RoundedRectangle(cornerRadius: Theme.Radius.lg)
                            .fill(isUser ? Theme.accent.opacity(0.18) : Color(nsColor: .textBackgroundColor))
                    )
                    .overlay(
                        RoundedRectangle(cornerRadius: Theme.Radius.lg)
                            .strokeBorder(
                                isUser ? Theme.accent.opacity(0.3) : Color.gray.opacity(0.18),
                                lineWidth: 1
                            )
                    )
            }
            if !isUser { Spacer(minLength: 40) }
        }
    }
}
