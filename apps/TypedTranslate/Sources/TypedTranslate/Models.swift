import Foundation
import SwiftUI

// MARK: - Bridge contract

/// Result of the bridge `annotate+parse` (and `parse`) commands.
///
/// Mirrors the bridge JSON contract exactly. `code`/`resolved`/`tree` may be
/// absent depending on the command and whether annotation succeeded, so the
/// non-array fields are optional and decoded defensively.
struct AnnotationResult: Codable, Equatable {
    var ok: Bool
    var code: String
    var resolved: String?
    var tree: GrammarNode?
    var errors: [String]

    init(
        ok: Bool,
        code: String,
        resolved: String? = nil,
        tree: GrammarNode? = nil,
        errors: [String] = []
    ) {
        self.ok = ok
        self.code = code
        self.resolved = resolved
        self.tree = tree
        self.errors = errors
    }

    enum CodingKeys: String, CodingKey {
        case ok, code, resolved, tree, errors
    }

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        ok = try c.decodeIfPresent(Bool.self, forKey: .ok) ?? false
        code = try c.decodeIfPresent(String.self, forKey: .code) ?? ""
        resolved = try c.decodeIfPresent(String.self, forKey: .resolved)
        tree = try c.decodeIfPresent(GrammarNode.self, forKey: .tree)
        errors = try c.decodeIfPresent([String].self, forKey: .errors) ?? []
    }
}

/// A node in the grammar composition tree produced by the bridge `parse`.
struct GrammarNode: Codable, Identifiable, Equatable, Hashable {
    let id: String
    let label: String
    let ctor: String?
    let category: String
    let text: String
    let resolved: String?
    let children: [GrammarNode]

    /// Strongly-typed view of the raw `category` string.
    var grammarCategory: GrammarCategory {
        GrammarCategory(rawValue: category) ?? .other
    }

    enum CodingKeys: String, CodingKey {
        case id, label, ctor, category, text, resolved, children
    }

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = try c.decodeIfPresent(String.self, forKey: .id) ?? UUID().uuidString
        label = try c.decodeIfPresent(String.self, forKey: .label) ?? ""
        ctor = try c.decodeIfPresent(String.self, forKey: .ctor)
        category = try c.decodeIfPresent(String.self, forKey: .category) ?? "other"
        text = try c.decodeIfPresent(String.self, forKey: .text) ?? ""
        resolved = try c.decodeIfPresent(String.self, forKey: .resolved)
        children = try c.decodeIfPresent([GrammarNode].self, forKey: .children) ?? []
    }

    init(
        id: String,
        label: String,
        ctor: String?,
        category: String,
        text: String,
        resolved: String?,
        children: [GrammarNode]
    ) {
        self.id = id
        self.label = label
        self.ctor = ctor
        self.category = category
        self.text = text
        self.resolved = resolved
        self.children = children
    }
}

// MARK: - Chat

/// A single chat message exchanged with the grammar assistant.
struct ChatMessage: Identifiable, Equatable, Hashable {
    enum Role: String, Codable {
        case user
        case assistant
    }

    let id: UUID
    let role: Role
    var text: String

    init(id: UUID = UUID(), role: Role, text: String) {
        self.id = id
        self.role = role
        self.text = text
    }
}

// MARK: - Engine

/// The local CLI engine used for annotation and chat.
enum Engine: String, CaseIterable, Identifiable {
    case codex
    case claude

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .codex: return "Codex"
        case .claude: return "Claude"
        }
    }
}

// MARK: - Grammar categories

/// Every category string emitted by the bridge `GrammarCategory` union, plus a
/// presentation color and a short display tag.
enum GrammarCategory: String, CaseIterable {
    case phrase
    case conjugation
    case verb
    case adjective
    case noun
    case technical
    case whitespace
    case adverb
    case particle
    case copula
    case suffix
    case punctuation
    case form
    case demonstrative
    case interrogative
    case literal
    case other

    /// Short uppercase-ish tag shown in the structure tree.
    var tag: String {
        switch self {
        case .phrase: return "phrase"
        case .conjugation: return "conj"
        case .verb: return "verb"
        case .adjective: return "adj"
        case .noun: return "noun"
        case .technical: return "term"
        case .whitespace: return "ws"
        case .adverb: return "adv"
        case .particle: return "prt"
        case .copula: return "copula"
        case .suffix: return "suffix"
        case .punctuation: return "punc"
        case .form: return "form"
        case .demonstrative: return "dem"
        case .interrogative: return "int"
        case .literal: return "lit"
        case .other: return "·"
        }
    }

    /// Color used for the category tag / accent.
    var color: Color {
        Theme.color(for: self)
    }
}
