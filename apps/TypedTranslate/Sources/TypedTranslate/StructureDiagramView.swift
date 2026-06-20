import SwiftUI

/// Left pane: the editable generated code plus the color-coded composition tree.
struct StructureDiagramView: View {
    @EnvironmentObject private var annotation: AnnotationViewModel

    var body: some View {
        VStack(spacing: 0) {
            header
            Divider()
            ScrollView {
                VStack(alignment: .leading, spacing: Theme.Spacing.lg) {
                    codeEditor
                    treeSection
                }
                .padding(Theme.Spacing.lg)
                .frame(maxWidth: .infinity, alignment: .leading)
            }
        }
        .background(Color(nsColor: .controlBackgroundColor))
    }

    private var header: some View {
        HStack {
            Label("Structure", systemImage: "square.stack.3d.up")
                .font(.headline)
                .foregroundStyle(Theme.accentDeep)
            Spacer()
            if annotation.isReparsing {
                ProgressView().controlSize(.small)
            }
            Button {
                Task { await annotation.reparse() }
            } label: {
                Label("Re-parse", systemImage: "arrow.triangle.2.circlepath")
            }
            .buttonStyle(.bordered)
            .controlSize(.small)
            .disabled(annotation.code.isEmpty || annotation.isReparsing)
        }
        .padding(.horizontal, Theme.Spacing.lg)
        .padding(.vertical, Theme.Spacing.md)
    }

    @ViewBuilder
    private var codeEditor: some View {
        if annotation.hasResult || !annotation.code.isEmpty {
            VStack(alignment: .leading, spacing: Theme.Spacing.xs) {
                Text("Generated annotation")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                TextEditor(text: $annotation.code)
                    .font(Theme.monoFont)
                    .frame(minHeight: 120, maxHeight: 220)
                    .padding(Theme.Spacing.xs)
                    .background(
                        RoundedRectangle(cornerRadius: Theme.Radius.md)
                            .fill(Color(nsColor: .textBackgroundColor))
                    )
                    .overlay(
                        RoundedRectangle(cornerRadius: Theme.Radius.md)
                            .strokeBorder(Color.gray.opacity(0.2), lineWidth: 1)
                    )
            }
        }
    }

    @ViewBuilder
    private var treeSection: some View {
        if let tree = annotation.tree {
            VStack(alignment: .leading, spacing: Theme.Spacing.sm) {
                Text("Composition tree")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                GrammarNodeRow(node: tree, depth: 0)
            }
        } else if annotation.hasResult {
            placeholder("No structure tree was produced.")
        } else {
            placeholder("Annotate a sentence to see its grammar structure.")
        }
    }

    private func placeholder(_ text: String) -> some View {
        HStack {
            Spacer()
            VStack(spacing: Theme.Spacing.sm) {
                Image(systemName: "leaf")
                    .font(.system(size: 28))
                    .foregroundStyle(Theme.accentSoft)
                Text(text)
                    .font(.callout)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
            }
            Spacer()
        }
        .padding(.vertical, Theme.Spacing.xl)
    }
}

/// A recursive, indented, color-coded row for a grammar node. Internal nodes use
/// a `DisclosureGroup`; leaves render as a single row.
private struct GrammarNodeRow: View {
    let node: GrammarNode
    let depth: Int

    @State private var expanded: Bool = true

    var body: some View {
        if node.children.isEmpty {
            rowLabel
                .padding(.vertical, 2)
        } else {
            DisclosureGroup(isExpanded: $expanded) {
                VStack(alignment: .leading, spacing: 0) {
                    ForEach(node.children) { child in
                        GrammarNodeRow(node: child, depth: depth + 1)
                    }
                }
                .padding(.leading, Theme.Spacing.md)
            } label: {
                rowLabel
            }
            .padding(.vertical, 1)
        }
    }

    private var category: GrammarCategory { node.grammarCategory }

    private var rowLabel: some View {
        HStack(alignment: .firstTextBaseline, spacing: Theme.Spacing.sm) {
            RoundedRectangle(cornerRadius: 2)
                .fill(category.color)
                .frame(width: 3, height: 14)

            Text(node.label)
                .font(.system(.body, design: .monospaced).weight(.medium))
                .lineLimit(1)
                .truncationMode(.middle)

            CategoryTag(category: category)

            if let ctor = node.ctor, ctor != node.label {
                Text(ctor)
                    .font(.system(size: 10, design: .monospaced))
                    .foregroundStyle(.secondary)
            }

            Spacer(minLength: Theme.Spacing.sm)

            if let resolved = node.resolved, !resolved.isEmpty {
                Text(resolved)
                    .font(Theme.japaneseFont)
                    .foregroundStyle(Theme.accentDeep)
                    .lineLimit(1)
                    .truncationMode(.tail)
                    .textSelection(.enabled)
            }
        }
        .contentShape(Rectangle())
        .help(node.text)
    }
}
