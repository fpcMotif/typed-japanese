import SwiftUI

/// Centralized look-and-feel: a soft "sakura" accent plus the category color map
/// used by the structure diagram.
enum Theme {
    // MARK: Accent

    /// Sakura pink primary accent.
    static let accent = Color(red: 0.92, green: 0.45, blue: 0.58)
    static let accentSoft = Color(red: 0.98, green: 0.86, blue: 0.90)
    static let accentDeep = Color(red: 0.75, green: 0.28, blue: 0.42)

    // MARK: Spacing

    enum Spacing {
        static let xs: CGFloat = 4
        static let sm: CGFloat = 8
        static let md: CGFloat = 12
        static let lg: CGFloat = 16
        static let xl: CGFloat = 24
    }

    enum Radius {
        static let sm: CGFloat = 6
        static let md: CGFloat = 10
        static let lg: CGFloat = 14
    }

    // MARK: Typography

    static let monoFont = Font.system(.body, design: .monospaced)
    static let monoCaption = Font.system(.caption, design: .monospaced)
    static let japaneseFont = Font.system(size: 15, weight: .medium)

    // MARK: Category colors

    static func color(for category: GrammarCategory) -> Color {
        switch category {
        case .phrase:        return Color(red: 0.55, green: 0.45, blue: 0.85)
        case .conjugation:   return Color(red: 0.90, green: 0.50, blue: 0.30)
        case .verb:          return Color(red: 0.20, green: 0.60, blue: 0.85)
        case .adjective:     return Color(red: 0.30, green: 0.70, blue: 0.55)
        case .noun:          return Color(red: 0.85, green: 0.60, blue: 0.20)
        case .technical:     return Color(red: 0.45, green: 0.55, blue: 0.65)
        case .whitespace:    return Color.gray.opacity(0.5)
        case .adverb:        return Color(red: 0.60, green: 0.75, blue: 0.30)
        case .particle:      return Color(red: 0.92, green: 0.45, blue: 0.58)
        case .copula:        return Color(red: 0.70, green: 0.40, blue: 0.70)
        case .suffix:        return Color(red: 0.50, green: 0.65, blue: 0.80)
        case .punctuation:   return Color.secondary
        case .form:          return Color(red: 0.80, green: 0.35, blue: 0.55)
        case .demonstrative: return Color(red: 0.40, green: 0.50, blue: 0.90)
        case .interrogative: return Color(red: 0.85, green: 0.30, blue: 0.45)
        case .literal:       return Color(red: 0.35, green: 0.70, blue: 0.65)
        case .other:         return Color.secondary
        }
    }
}

// MARK: - Reusable views

/// A small rounded color-coded category tag.
struct CategoryTag: View {
    let category: GrammarCategory

    var body: some View {
        Text(category.tag)
            .font(.system(size: 10, weight: .semibold, design: .monospaced))
            .padding(.horizontal, 6)
            .padding(.vertical, 2)
            .background(category.color.opacity(0.18))
            .foregroundStyle(category.color)
            .clipShape(Capsule())
    }
}
