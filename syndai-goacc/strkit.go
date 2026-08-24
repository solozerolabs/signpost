// Package strkit is a tiny pure-Go string utility module used as an acceptance
// dogfood fixture. Functions here are hermetic (no I/O, no clock, no randomness).
package strkit

// Version reports the fixture module version. Existing surface so the module root
// is a valid, compilable package; the acceptance criteria target NEW functions.
func Version() string { return "0.1.0" }
