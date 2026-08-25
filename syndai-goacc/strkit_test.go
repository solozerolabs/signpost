package strkit

import "testing"

func TestSlugify(t *testing.T) {
	cases := map[string]string{
		"Hello, World!": "hello-world",
		"---":           "",
		"  Foo_Bar99 ":  "foo-bar99",
	}
	for in, want := range cases {
		if got := Slugify(in); got != want {
			t.Errorf("Slugify(%q) = %q, want %q", in, got, want)
		}
	}
}

func TestReverse(t *testing.T) {
	cases := map[string]string{
		"abc": "cba",
		"":    "",
		"a":   "a",
	}
	for in, want := range cases {
		if got := Reverse(in); got != want {
			t.Errorf("Reverse(%q) = %q, want %q", in, got, want)
		}
	}
}

func TestWordCount(t *testing.T) {
	cases := map[string]int{
		"  a  b c ": 3,
		"":          0,
		"one":       1,
	}
	for in, want := range cases {
		if got := WordCount(in); got != want {
			t.Errorf("WordCount(%q) = %d, want %d", in, got, want)
		}
	}
}

func TestCapitalize(t *testing.T) {
	cases := map[string]string{
		"hello": "Hello",
		"":      "",
		"H":     "H",
	}
	for in, want := range cases {
		if got := Capitalize(in); got != want {
			t.Errorf("Capitalize(%q) = %q, want %q", in, got, want)
		}
	}
}
