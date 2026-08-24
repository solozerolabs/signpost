package strkit

import "testing"

func TestSlugify(t *testing.T) {
	got := Slugify("Hello, World!")
	if got != "hello-world" {
		t.Fatalf("Slugify(%q) = %q, want %q", "Hello, World!", got, "hello-world")
	}
}

func TestReverse(t *testing.T) {
	got := Reverse("abc")
	if got != "cba" {
		t.Fatalf("Reverse(%q) = %q, want %q", "abc", got, "cba")
	}
}

func TestWordCount(t *testing.T) {
	got := WordCount("  a  b c ")
	if got != 3 {
		t.Fatalf("WordCount(%q) = %d, want %d", "  a  b c ", got, 3)
	}
}

func TestCapitalize(t *testing.T) {
	got := Capitalize("hello")
	if got != "Hello" {
		t.Fatalf("Capitalize(%q) = %q, want %q", "hello", got, "Hello")
	}
}
