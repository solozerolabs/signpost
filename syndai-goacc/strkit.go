// Package strkit is a tiny pure-Go string utility module used as an acceptance
// dogfood fixture. Functions here are hermetic (no I/O, no clock, no randomness).
package strkit

import (
	"strings"
	"unicode"
)

// Version reports the fixture module version. Existing surface so the module root
// is a valid, compilable package; the acceptance criteria target NEW functions.
func Version() string { return "0.1.0" }

// Slugify lowercases s and replaces every run of non-alphanumeric characters
// with a single hyphen, trimming any leading or trailing hyphen.
func Slugify(s string) string {
	var b strings.Builder
	inRun := false
	for _, r := range s {
		if unicode.IsLetter(r) || unicode.IsDigit(r) {
			b.WriteRune(unicode.ToLower(r))
			inRun = false
			continue
		}
		if !inRun {
			b.WriteByte('-')
			inRun = true
		}
	}
	return strings.Trim(b.String(), "-")
}

// Reverse returns s with its characters (runes) in reverse order.
func Reverse(s string) string {
	r := []rune(s)
	for i, j := 0, len(r)-1; i < j; i, j = i+1, j-1 {
		r[i], r[j] = r[j], r[i]
	}
	return string(r)
}

// WordCount returns the number of whitespace-separated words in s.
func WordCount(s string) int {
	return len(strings.Fields(s))
}

// Capitalize returns s with its first character upper-cased and the rest unchanged.
func Capitalize(s string) string {
	if s == "" {
		return s
	}
	r := []rune(s)
	r[0] = unicode.ToUpper(r[0])
	return string(r)
}
